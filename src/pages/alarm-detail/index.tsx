import React, { useState, useEffect } from 'react';
import { View, Text, Image, Input } from '@tarojs/components';
import Taro, { useRouter, useDidShow } from '@tarojs/taro';
import classNames from 'classnames';
import { useAppContext } from '@/context/AppContext';
import { getAlarmById } from '@/data/alarm';
import { getCameraById } from '@/data/building';
import { formatDateTime, getStatusText, getStatusColor, getAlarmLevelText, getAlarmLevelColor } from '@/utils';
import styles from './index.module.scss';

const AlarmDetailPage: React.FC = () => {
  const router = useRouter();
  const { updateAlarmStatus, user } = useAppContext();
  const [alarm, setAlarm] = useState<any>(null);
  const [camera, setCamera] = useState<any>(null);
  const [handleNote, setHandleNote] = useState('');

  useEffect(() => {
    const id = router.params.id;
    console.log('[AlarmDetail] Alarm ID:', id);
    if (id) {
      const alarmData = getAlarmById(id);
      const cameraData = alarmData ? getCameraById(alarmData.cameraId) : null;
      setAlarm(alarmData);
      setCamera(cameraData);
    }
  }, [router.params.id]);

  useDidShow(() => {
    console.log('[AlarmDetail] Page show');
  });

  const handleCall = () => {
    console.log('[AlarmDetail] Call support');
    Taro.makePhoneCall({
      phoneNumber: '13800138000',
      fail: (err) => {
        console.error('[AlarmDetail] Call failed:', err);
      }
    });
  };

  const handleTransfer = () => {
    console.log('[AlarmDetail] Transfer to duty desk');
    Taro.showModal({
      title: '转交值班台',
      content: '确定将此告警转交值班台处理吗？',
      success: (res) => {
        if (res.confirm && alarm) {
          updateAlarmStatus(alarm.id, 'transferred', handleNote);
          Taro.showToast({
            title: '已转交值班台',
            icon: 'success'
          });
          setTimeout(() => {
            Taro.navigateBack();
          }, 1500);
        }
      }
    });
  };

  const handleResolve = () => {
    console.log('[AlarmDetail] Mark as resolved');
    if (!handleNote.trim()) {
      Taro.showToast({
        title: '请填写处置说明',
        icon: 'none'
      });
      return;
    }
    Taro.showModal({
      title: '确认处置完成',
      content: '确定此告警已处理完成吗？',
      success: (res) => {
        if (res.confirm && alarm) {
          updateAlarmStatus(alarm.id, 'resolved', handleNote);
          Taro.showToast({
            title: '处置完成',
            icon: 'success'
          });
          setTimeout(() => {
            Taro.navigateBack();
          }, 1500);
        }
      }
    });
  };

  const handleViewVideo = () => {
    if (camera) {
      Taro.navigateTo({
        url: `/pages/video-detail/index?id=${camera.id}`
      });
    }
  };

  if (!alarm) {
    return (
      <View className={styles.pageContainer}>
        <Text>加载中...</Text>
      </View>
    );
  }

  return (
    <View className={styles.pageContainer}>
      <View className={styles.alarmHeader}>
        <View className={styles.alarmTypeRow}>
          <View className={styles.alarmType}>
            <View 
              className={styles.typeDot} 
              style={{ backgroundColor: getAlarmLevelColor(alarm.level) }} 
            />
            <Text className={styles.typeText}>{alarm.typeName}</Text>
            <View 
              className={styles.levelBadge}
              style={{ 
                backgroundColor: getAlarmLevelColor(alarm.level) + '15',
                color: getAlarmLevelColor(alarm.level)
              }}
            >
              <Text>{getAlarmLevelText(alarm.level)}级</Text>
            </View>
          </View>
          <View 
            className={styles.statusBadge}
            style={{ 
              backgroundColor: getStatusColor(alarm.status) + '15',
              borderColor: getStatusColor(alarm.status)
            }}
          >
            <Text 
              className={styles.statusText}
              style={{ color: getStatusColor(alarm.status) }}
            >
              {getStatusText(alarm.status)}
            </Text>
          </View>
        </View>
        
        <Text className={styles.alarmDesc}>{alarm.description}</Text>
        
        <View className={styles.alarmMeta}>
          <View className={styles.metaRow}>
            <Text className={styles.metaLabel}>发生时间</Text>
            <Text className={styles.metaValue}>{formatDateTime(alarm.happenTime)}</Text>
          </View>
          <View className={styles.metaRow}>
            <Text className={styles.metaLabel}>告警位置</Text>
            <Text className={styles.metaValue}>{alarm.location}</Text>
          </View>
          <View className={styles.metaRow}>
            <Text className={styles.metaLabel}>所属楼栋</Text>
            <Text className={styles.metaValue}>{alarm.buildingName}</Text>
          </View>
          {alarm.handler && (
            <View className={styles.metaRow}>
              <Text className={styles.metaLabel}>处理人</Text>
              <Text className={styles.metaValue}>{alarm.handler}</Text>
            </View>
          )}
          {alarm.handleTime && (
            <View className={styles.metaRow}>
              <Text className={styles.metaLabel}>处理时间</Text>
              <Text className={styles.metaValue}>{formatDateTime(alarm.handleTime)}</Text>
            </View>
          )}
          {alarm.handleNote && (
            <View className={styles.metaRow}>
              <Text className={styles.metaLabel}>处置备注</Text>
              <Text className={styles.metaValue}>{alarm.handleNote}</Text>
            </View>
          )}
        </View>
      </View>

      <View className={styles.snapshotSection}>
        <Text className={styles.sectionTitle}>告警截图</Text>
        <Image 
          className={styles.snapshotImage} 
          src={alarm.snapshotUrl} 
          mode="aspectFill"
        />
      </View>

      {camera && (
        <View className={styles.cameraSection}>
          <Text className={styles.sectionTitle}>关联摄像头</Text>
          <View className={styles.cameraInfo}>
            <View className={styles.cameraIcon}>📷</View>
            <View className={styles.cameraDetail}>
              <Text className={styles.cameraName}>{camera.name}</Text>
              <Text className={styles.cameraLocation}>{camera.code} · {camera.location}</Text>
            </View>
            <View className={styles.viewVideoBtn} onClick={handleViewVideo}>
              <Text>查看视频</Text>
            </View>
          </View>
        </View>
      )}

      {(alarm.status === 'pending' || alarm.status === 'processing') && (
        <View className={styles.handleSection}>
          <Text className={styles.sectionTitle}>处置说明</Text>
          <Input
            className={styles.handleNote}
            placeholder="请输入处置说明..."
            value={handleNote}
            onInput={(e) => setHandleNote(e.detail.value)}
          />
        </View>
      )}

      {(alarm.status === 'pending' || alarm.status === 'processing') && (
        <View className={styles.bottomActions}>
          <View className={classNames(styles.actionBtn, styles.call)} onClick={handleCall}>
            <Text className={styles.btnIcon}>📞</Text>
            <Text>呼叫支援</Text>
          </View>
          <View className={classNames(styles.actionBtn, styles.transfer)} onClick={handleTransfer}>
            <Text className={styles.btnIcon}>📤</Text>
            <Text>转交值班台</Text>
          </View>
          <View className={classNames(styles.actionBtn, styles.resolve)} onClick={handleResolve}>
            <Text className={styles.btnIcon}>✓</Text>
            <Text>标记完成</Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default AlarmDetailPage;
