import React, { useState, useEffect, useMemo, useRef } from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro, { useRouter, useDidShow } from '@tarojs/taro';
import classNames from 'classnames';
import { useAppContext } from '@/context/AppContext';
import { getCameraById } from '@/data/building';
import { getVideoRecordsByCamera, formatDuration, VideoRecord } from '@/data/video';
import { getStatusText, getStatusColor } from '@/utils';
import styles from './index.module.scss';

const VideoDetailPage: React.FC = () => {
  const router = useRouter();
  const { toggleFavorite, cameras } = useAppContext();
  const [camera, setCamera] = useState<any>(null);
  const [videoRecords, setVideoRecords] = useState<VideoRecord[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [playbackMode, setPlaybackMode] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<VideoRecord | null>(null);
  const [playbackProgress, setPlaybackProgress] = useState(0);
  const playbackTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const id = router.params.id;
    console.log('[VideoDetail] Camera ID:', id);
    if (id) {
      const cameraData = getCameraById(id);
      const liveCamera = cameras.find(c => c.id === id);
      setCamera(cameraData || liveCamera || null);
      setIsFavorite(liveCamera?.isFavorite || cameraData?.isFavorite || false);
      setVideoRecords(getVideoRecordsByCamera(id));
    }
  }, [router.params.id, cameras]);

  useEffect(() => {
    if (isPlaying && playbackMode && currentRecord) {
      if (playbackTimerRef.current) clearInterval(playbackTimerRef.current);
      const tickMs = Math.max(300, (currentRecord.duration / 100) * 1000 / 30);
      playbackTimerRef.current = setInterval(() => {
        setPlaybackProgress(prev => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 100;
          }
          return prev + 1;
        });
      }, tickMs);
    } else {
      if (playbackTimerRef.current) {
        clearInterval(playbackTimerRef.current);
        playbackTimerRef.current = null;
      }
    }

    return () => {
      if (playbackTimerRef.current) {
        clearInterval(playbackTimerRef.current);
        playbackTimerRef.current = null;
      }
    };
  }, [isPlaying, playbackMode, currentRecord]);

  useDidShow(() => {
    console.log('[VideoDetail] Page show');
  });

  const handleToggleFavorite = () => {
    if (camera) {
      toggleFavorite(camera.id);
      setIsFavorite(!isFavorite);
      Taro.showToast({
        title: isFavorite ? '已取消收藏' : '已收藏',
        icon: 'success'
      });
    }
  };

  const handlePlay = () => {
    setIsPlaying(!isPlaying);
    Taro.showToast({
      title: isPlaying ? '已暂停' : (playbackMode ? '回放播放中' : '直播中'),
      icon: 'none'
    });
  };

  const handleSnapshot = () => {
    console.log('[VideoDetail] Take snapshot');
    Taro.showToast({
      title: '截图已保存',
      icon: 'success'
    });
  };

  const handleRecord = () => {
    console.log('[VideoDetail] Start recording');
    Taro.showToast({
      title: '开始录像',
      icon: 'none'
    });
  };

  const handlePlayHistory = (record: VideoRecord) => {
    console.log('[VideoDetail] Play history:', record.id);
    setPlaybackMode(true);
    setCurrentRecord(record);
    setPlaybackProgress(0);
    setIsPlaying(true);
    Taro.showToast({
      title: `正在回放 ${record.startTime.split(' ')[1] || record.startTime}`,
      icon: 'none',
      duration: 1500
    });
  };

  const handleBackToLive = () => {
    console.log('[VideoDetail] Back to live');
    setPlaybackMode(false);
    setCurrentRecord(null);
    setPlaybackProgress(0);
    setIsPlaying(false);
    if (playbackTimerRef.current) {
      clearInterval(playbackTimerRef.current);
      playbackTimerRef.current = null;
    }
  };

  const handleAction = (action: string) => {
    console.log('[VideoDetail] Action:', action);
    switch (action) {
      case 'quality':
        Taro.showActionSheet({
          itemList: ['流畅', '标清', '高清', '超清'],
          success: (res) => {
            Taro.showToast({
              title: `已切换到${['流畅', '标清', '高清', '超清'][res.tapIndex]}`,
              icon: 'none'
            });
          }
        });
        break;
      case 'ptz':
        Taro.showToast({
          title: '云台控制功能开发中',
          icon: 'none'
        });
        break;
      case 'audio':
        Taro.showToast({
          title: '音频已开启',
          icon: 'none'
        });
        break;
      default:
        Taro.showToast({
          title: '功能开发中',
          icon: 'none'
        });
    }
  };

  const displayImage = useMemo(() => {
    if (playbackMode && currentRecord) return currentRecord.snapshotUrl;
    return camera?.snapshotUrl;
  }, [playbackMode, currentRecord, camera]);

  const elapsedSeconds = useMemo(() => {
    if (!currentRecord) return 0;
    return Math.floor(currentRecord.duration * playbackProgress / 100);
  }, [currentRecord, playbackProgress]);

  const getTimeOnly = (datetime: string) => {
    const parts = datetime.split(' ');
    return parts.length > 1 ? parts[1] : datetime;
  };

  const actions = [
    { id: 'quality', icon: '⚙️', text: '画质' },
    { id: 'ptz', icon: '🎮', text: '云台' },
    { id: 'audio', icon: '🔊', text: '音频' }
  ];

  if (!camera) {
    return (
      <View className={styles.videoDetailPage}>
        <View className={styles.pageContent}>
          <Text>加载中...</Text>
        </View>
      </View>
    );
  }

  return (
    <View className={styles.videoDetailPage}>
      <View className={styles.videoPlayer}>
        <Image
          className={styles.videoPlaceholder}
          src={displayImage}
          mode="aspectFill"
        />
        <View className={styles.videoOverlay} />

        {playbackMode && (
          <View className={styles.playbackBadge}>
            <Text className={styles.playbackBadgeText}>回放</Text>
          </View>
        )}

        {playbackMode && currentRecord && (
          <View className={styles.playbackTimeInfo}>
            <Text className={styles.playbackTimeText}>
              {getTimeOnly(currentRecord.startTime)} - {getTimeOnly(currentRecord.endTime)}
            </Text>
            <Text className={styles.playbackDurationText}>
              时长 {formatDuration(currentRecord.duration)}
            </Text>
          </View>
        )}

        {!isPlaying && (
          <View className={styles.playOverlay} onClick={handlePlay}>
            <Text className={styles.playOverlayIcon}>▶</Text>
            <Text className={styles.playOverlayText}>
              {playbackMode ? '点击播放回放' : '点击观看直播'}
            </Text>
          </View>
        )}

        <View className={styles.videoControls}>
          <View className={styles.playBtn} onClick={handlePlay}>
            <Text className={styles.playIcon}>{isPlaying ? '⏸' : '▶'}</Text>
          </View>
          <View className={styles.progressBar}>
            <View
              className={styles.progressFill}
              style={{ width: `${playbackMode ? playbackProgress : 35}%` }}
            />
          </View>
          <Text className={styles.timeText}>
            {playbackMode && currentRecord
              ? `${formatDuration(elapsedSeconds)} / ${formatDuration(currentRecord.duration)}`
              : '00:42 / 实时'
            }
          </Text>
          {playbackMode && (
            <View className={styles.backLiveBtn} onClick={handleBackToLive}>
              <Text className={styles.backLiveIcon}>直播</Text>
            </View>
          )}
          <View className={styles.fullscreenBtn}>
            <Text className={styles.fullscreenIcon}>⛶</Text>
          </View>
        </View>
      </View>

      <View className={styles.pageContent}>
        <View className={styles.cameraInfo}>
          <View className={styles.cameraHeader}>
            <View>
              <Text className={styles.cameraName}>{camera.name}</Text>
              <Text className={styles.cameraCode}>{camera.code}</Text>
            </View>
            <View
              className={classNames(styles.favoriteBtn, isFavorite && styles.active)}
              onClick={handleToggleFavorite}
            >
              <Text className={styles.favoriteIcon}>{isFavorite ? '★' : '☆'}</Text>
            </View>
          </View>

          <View
            className={styles.statusBadge}
            style={{
              backgroundColor: getStatusColor(camera.status) + '15',
              borderColor: getStatusColor(camera.status)
            }}
          >
            <View
              className={styles.statusDot}
              style={{ backgroundColor: getStatusColor(camera.status) }}
            />
            <Text
              className={styles.statusText}
              style={{ color: getStatusColor(camera.status) }}
            >
              {getStatusText(camera.status)}
            </Text>
          </View>

          <View className={styles.cameraMeta}>
            <View className={styles.metaRow}>
              <Text className={styles.metaLabel}>位置</Text>
              <Text className={styles.metaValue}>{camera.location}</Text>
            </View>
            <View className={styles.metaRow}>
              <Text className={styles.metaLabel}>楼栋</Text>
              <Text className={styles.metaValue}>{camera.buildingName}</Text>
            </View>
            <View className={styles.metaRow}>
              <Text className={styles.metaLabel}>楼层</Text>
              <Text className={styles.metaValue}>{camera.floor}</Text>
            </View>
            <View className={styles.metaRow}>
              <Text className={styles.metaLabel}>最后在线</Text>
              <Text className={styles.metaValue}>{camera.lastOnlineTime}</Text>
            </View>
          </View>
        </View>

        <View className={styles.actionSection}>
          <Text className={styles.sectionTitle}>快捷操作</Text>
          <View className={styles.actionGrid}>
            {actions.map(action => (
              <View
                key={action.id}
                className={styles.actionItem}
                onClick={() => handleAction(action.id)}
              >
                <Text className={styles.actionIcon}>{action.icon}</Text>
                <Text className={styles.actionText}>{action.text}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.historySection}>
          <View className={styles.historyHeader}>
            <Text className={styles.sectionTitle}>历史录像</Text>
            {playbackMode && (
              <Text className={styles.playingHint}>回放中</Text>
            )}
          </View>
          <View className={styles.historyList}>
            {videoRecords.length > 0 ? (
              videoRecords.map(record => (
                <View
                  key={record.id}
                  className={classNames(
                    styles.historyItem,
                    currentRecord?.id === record.id && styles.historyItemActive
                  )}
                  onClick={() => handlePlayHistory(record)}
                >
                  <Image
                    className={styles.historyThumb}
                    src={record.snapshotUrl}
                    mode="aspectFill"
                  />
                  <View className={styles.historyInfo}>
                    <Text className={styles.historyTime}>{record.startTime}</Text>
                    <Text className={styles.historyDuration}>
                      时长 {formatDuration(record.duration)} · {record.size}
                    </Text>
                  </View>
                  <View className={styles.playIconSmall}>
                    <Text className={styles.playIconText}>▶</Text>
                  </View>
                </View>
              ))
            ) : (
              <Text className={styles.historyDuration}>暂无历史录像</Text>
            )}
          </View>
        </View>
      </View>

      <View className={styles.bottomActions}>
        <View className={classNames(styles.bottomBtn, styles.snapshot)} onClick={handleSnapshot}>
          <Text className={styles.btnIcon}>📸</Text>
          <Text>截图</Text>
        </View>
        <View className={classNames(styles.bottomBtn, styles.record)} onClick={handleRecord}>
          <Text className={styles.btnIcon}>⏺</Text>
          <Text>录像</Text>
        </View>
      </View>
    </View>
  );
};

export default VideoDetailPage;
