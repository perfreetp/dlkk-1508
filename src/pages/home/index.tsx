import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro, { useDidShow, usePullDownRefresh } from '@tarojs/taro';
import { useAppContext } from '@/context/AppContext';
import StatCard from '@/components/StatCard';
import QuickAction from '@/components/QuickAction';
import AlarmItem from '@/components/AlarmItem';
import CameraItem from '@/components/CameraItem';
import TaskItem from '@/components/TaskItem';
import EmptyState from '@/components/EmptyState';
import { QuickAction as QuickActionType } from '@/types';
import { getFavoriteCameras } from '@/data/building';
import styles from './index.module.scss';

const HomePage: React.FC = () => {
  const { user, pendingAlarms, pendingTasks, cameras, buildings, refreshData } = useAppContext();
  const [favoriteCameras, setFavoriteCameras] = useState(getFavoriteCameras());
  const [greeting, setGreeting] = useState('');

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 6) return '凌晨好';
    if (hour < 9) return '早上好';
    if (hour < 12) return '上午好';
    if (hour < 14) return '中午好';
    if (hour < 18) return '下午好';
    if (hour < 22) return '晚上好';
    return '夜深了';
  };

  useEffect(() => {
    setGreeting(getGreeting());
    console.log('[HomePage] Component mounted, user:', user.name);
  }, [user.name]);

  useDidShow(() => {
    console.log('[HomePage] Page show, refreshing data');
    setFavoriteCameras(cameras.filter(c => c.isFavorite));
  });

  usePullDownRefresh(() => {
    console.log('[HomePage] Pull down refresh');
    refreshData();
    setFavoriteCameras(getFavoriteCameras());
    setTimeout(() => {
      Taro.stopPullDownRefresh();
      Taro.showToast({ title: '刷新成功', icon: 'success' });
    }, 1000);
  });

  const totalCameras = cameras.length;
  const onlineCameras = cameras.filter(c => c.status === 'online').length;
  const offlineCameras = totalCameras - onlineCameras;
  const todayAlarms = pendingAlarms.length;

  const quickActions: QuickActionType[] = [
    { id: 'scan', name: '扫码绑定', icon: '📷', color: '#1E5AA8', path: 'scan' },
    { id: 'call', name: '一键呼叫', icon: '📞', color: '#00B42A', path: 'tel:13800138000' },
    { id: 'handover', name: '交接班', icon: '📋', color: '#FF7D00', path: 'navigate:/pages/handover/index' },
    { id: 'patrol', name: '巡场登记', icon: '🚶', color: '#86909C', path: 'switchTab:/pages/task/index' }
  ];

  const handleStatClick = useCallback((type: string) => {
    console.log('[HomePage] Stat clicked:', type);
    switch (type) {
      case 'cameras':
        Taro.switchTab({ url: '/pages/building/index' });
        break;
      case 'alarms':
        Taro.switchTab({ url: '/pages/alarm/index' });
        break;
      case 'tasks':
        Taro.switchTab({ url: '/pages/task/index' });
        break;
    }
  }, []);

  const handleViewMoreAlarms = () => {
    Taro.switchTab({ url: '/pages/alarm/index' });
  };

  const handleViewMoreTasks = () => {
    Taro.switchTab({ url: '/pages/task/index' });
  };

  const handleViewMoreCameras = () => {
    Taro.switchTab({ url: '/pages/video/index' });
  };

  return (
    <View className={styles.homePage}>
      <View className={styles.headerBg} />
      
      <ScrollView className={styles.pageContent} scrollY>
        <View className={styles.userCard}>
          <Image 
            className={styles.userAvatar} 
            src={user.avatar} 
            mode="aspectFill"
          />
          <View className={styles.userInfo}>
            <Text className={styles.greetingText}>{greeting}，{user.name}</Text>
            <Text className={styles.userName}>{user.role} · {user.building}</Text>
            <Text className={styles.shiftInfo}>当前班次：{user.shiftName}</Text>
          </View>
        </View>

        <View className={styles.statGrid}>
          <View onClick={() => handleStatClick('cameras')}>
            <StatCard 
              title="摄像头总数" 
              value={totalCameras} 
              unit="个" 
              color="#1E5AA8"
            />
          </View>
          <View onClick={() => handleStatClick('cameras')}>
            <StatCard 
              title="在线设备" 
              value={onlineCameras} 
              unit="个" 
              color="#00B42A"
              trend="down"
              trendValue={`${offlineCameras}个离线`}
            />
          </View>
          <View onClick={() => handleStatClick('alarms')}>
            <StatCard 
              title="待处理告警" 
              value={todayAlarms} 
              unit="条" 
              color="#F53F3F"
            />
          </View>
          <View onClick={() => handleStatClick('tasks')}>
            <StatCard 
              title="待处理任务" 
              value={pendingTasks.length} 
              unit="项" 
              color="#FF7D00"
            />
          </View>
        </View>

        <View className={styles.sectionArea}>
          <QuickAction actions={quickActions} />
        </View>

        <View className={styles.sectionArea}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionTitle}>紧急告警</Text>
            <Text className={styles.sectionMore} onClick={handleViewMoreAlarms}>
              查看全部 →
            </Text>
          </View>
          {pendingAlarms.length > 0 ? (
            pendingAlarms.slice(0, 2).map(alarm => (
              <AlarmItem key={alarm.id} alarm={alarm} />
            ))
          ) : (
            <View className={styles.emptyWrap}>
              <EmptyState 
                icon="✅" 
                title="暂无紧急告警" 
                description="当前园区运行正常"
              />
            </View>
          )}
        </View>

        <View className={styles.sectionArea}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionTitle}>常用点位</Text>
            <Text className={styles.sectionMore} onClick={handleViewMoreCameras}>
              更多 →
            </Text>
          </View>
          {favoriteCameras.length > 0 ? (
            <ScrollView 
              className={styles.favoriteScroll} 
              scrollX 
              enableFlex
              showScrollbar={false}
            >
              {favoriteCameras.map(camera => (
                <View key={camera.id} className={styles.favoriteItem}>
                  <CameraItem camera={camera} showFavorite={false} />
                </View>
              ))}
            </ScrollView>
          ) : (
            <View className={styles.emptyWrap}>
              <EmptyState 
                icon="⭐" 
                title="暂无收藏点位" 
                description="可在视频查看中收藏常用摄像头"
              />
            </View>
          )}
        </View>

        <View className={styles.sectionArea}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionTitle}>今日任务</Text>
            <Text className={styles.sectionMore} onClick={handleViewMoreTasks}>
              查看全部 →
            </Text>
          </View>
          {pendingTasks.length > 0 ? (
            pendingTasks.slice(0, 2).map(task => (
              <TaskItem key={task.id} task={task} />
            ))
          ) : (
            <View className={styles.emptyWrap}>
              <EmptyState 
                icon="📝" 
                title="暂无待办任务" 
                description="今日工作已全部完成"
              />
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default HomePage;
