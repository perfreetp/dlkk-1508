import React, { useState, useEffect } from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro, { useRouter, useDidShow } from '@tarojs/taro';
import classNames from 'classnames';
import { useAppContext } from '@/context/AppContext';
import { getCameraById } from '@/data/building';
import { getVideoRecordsByCamera, formatDuration } from '@/data/video';
import { getStatusText, getStatusColor } from '@/utils';
import styles from './index.module.scss';

const VideoDetailPage: React.FC = () => {
  const router = useRouter();
  const { toggleFavorite, cameras } = useAppContext();
  const [camera, setCamera] = useState<any>(null);
  const [videoRecords, setVideoRecords] = useState<any[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const id = router.params.id;
    console.log('[VideoDetail] Camera ID:', id);
    if (id) {
      const cameraData = getCameraById(id);
      const liveCamera = cameras.find(c => c.id === id);
      setCamera(cameraData);
      setIsFavorite(liveCamera?.isFavorite || cameraData?.isFavorite || false);
      setVideoRecords(getVideoRecordsByCamera(id));
    }
  }, [router.params.id, cameras]);

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
      title: isPlaying ? '已暂停' : '正在播放',
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

  const handlePlayHistory = (record: any) => {
    console.log('[VideoDetail] Play history:', record.id);
    Taro.showToast({
      title: `正在播放 ${record.startTime}`,
      icon: 'loading',
      duration: 1000
    });
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
          src={camera.snapshotUrl}
          mode="aspectFill"
        />
        <View className={styles.videoPlaceholder}>
          {!isPlaying && (
            <>
              <Text className={styles.placeholderIcon}>▶️</Text>
              <Text className={styles.placeholderText}>点击播放</Text>
            </>
          )}
        </View>
        <View className={styles.videoControls}>
          <View className={styles.playBtn} onClick={handlePlay}>
            <Text className={styles.playIcon}>{isPlaying ? '⏸' : '▶'}</Text>
          </View>
          <View className={styles.progressBar}>
            <View className={styles.progressFill} />
          </View>
          <Text className={styles.timeText}>00:42 / 实时</Text>
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
          <Text className={styles.sectionTitle}>历史录像</Text>
          <View className={styles.historyList}>
            {videoRecords.length > 0 ? (
              videoRecords.map(record => (
                <View 
                  key={record.id}
                  className={styles.historyItem}
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
