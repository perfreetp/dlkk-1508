import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro, { useDidShow, usePullDownRefresh } from '@tarojs/taro';
import classNames from 'classnames';
import { useAppContext } from '@/context/AppContext';
import TaskItem from '@/components/TaskItem';
import EmptyState from '@/components/EmptyState';
import { Task } from '@/types';
import styles from './index.module.scss';

const TaskPage: React.FC = () => {
  const { user, tasks, refreshData } = useAppContext();
  const [currentShift, setCurrentShift] = useState<string>('morning');
  const [pendingTasks, setPendingTasks] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);

  useEffect(() => {
    console.log('[TaskPage] Component mounted');
  }, []);

  useEffect(() => {
    filterTasks();
  }, [currentShift, tasks]);

  useDidShow(() => {
    console.log('[TaskPage] Page show');
    filterTasks();
  });

  usePullDownRefresh(() => {
    console.log('[TaskPage] Pull down refresh');
    refreshData();
    setTimeout(() => {
      Taro.stopPullDownRefresh();
    }, 1000);
  });

  const filterTasks = () => {
    const shiftTasks = tasks.filter(t => t.shift === currentShift);
    setPendingTasks(shiftTasks.filter(t => t.status === 'pending' || t.status === 'processing'));
    setCompletedTasks(shiftTasks.filter(t => t.status === 'completed'));
  };

  const handleHandover = () => {
    console.log('[TaskPage] Go to handover page');
    Taro.navigateTo({
      url: '/pages/handover/index'
    });
  };

  const handleViewHistory = () => {
    console.log('[TaskPage] View task history');
    Taro.showToast({
      title: '历史记录功能开发中',
      icon: 'none'
    });
  };

  const getTodayDate = () => {
    const now = new Date();
    const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    return `${now.getMonth() + 1}月${now.getDate()}日 ${weekDays[now.getDay()]}`;
  };

  const shiftTabs = [
    { key: 'morning', label: '早班' },
    { key: 'afternoon', label: '中班' },
    { key: 'night', label: '夜班' }
  ];

  return (
    <View className={styles.taskPage}>
      <ScrollView className={styles.pageContainer} scrollY>
        <View className={styles.userCard}>
          <Image 
            className={styles.userAvatar} 
            src={user.avatar} 
            mode="aspectFill"
          />
          <View className={styles.userInfo}>
            <Text className={styles.userName}>{user.name}</Text>
            <Text className={styles.userRole}>{user.role} · {user.building}</Text>
            <View className={styles.shiftInfo}>
              <Text className={styles.shiftBadge}>{user.shiftName}</Text>
              <Text>{getTodayDate()}</Text>
            </View>
          </View>
        </View>

        <View className={styles.quickActions}>
          <View className={styles.actionCard} onClick={handleHandover}>
            <View className={classNames(styles.actionIcon, styles.handover)}>📋</View>
            <Text className={styles.actionTitle}>交接班</Text>
            <Text className={styles.actionDesc}>生成交接备注</Text>
          </View>
          <View className={styles.actionCard} onClick={handleViewHistory}>
            <View className={classNames(styles.actionIcon, styles.history)}>📊</View>
            <Text className={styles.actionTitle}>历史记录</Text>
            <Text className={styles.actionDesc}>查看过往任务</Text>
          </View>
        </View>

        <View className={styles.statRow}>
          <View className={styles.statItem}>
            <Text className={classNames(styles.statValue, styles.statValueHigh)}>
              {pendingTasks.length}
            </Text>
            <Text className={styles.statLabel}>待处理</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{completedTasks.length}</Text>
            <Text className={styles.statLabel}>已完成</Text>
          </View>
        </View>

        <View className={styles.shiftTabs}>
          {shiftTabs.map(tab => (
            <Text
              key={tab.key}
              className={classNames(styles.shiftTab, currentShift === tab.key && styles.active)}
              onClick={() => setCurrentShift(tab.key)}
            >
              {tab.label}
            </Text>
          ))}
        </View>

        {pendingTasks.length > 0 && (
          <>
            <View className={styles.sectionTitle}>
              <Text>待处理任务</Text>
              <Text className={styles.sectionCount}>{pendingTasks.length}项</Text>
            </View>
            <View className={styles.taskList}>
              {pendingTasks.map(task => (
                <TaskItem key={task.id} task={task} />
              ))}
            </View>
          </>
        )}

        {completedTasks.length > 0 && (
          <>
            <View className={styles.sectionTitle}>
              <Text>已完成任务</Text>
              <Text className={styles.sectionCount}>{completedTasks.length}项</Text>
            </View>
            <View className={styles.taskList}>
              {completedTasks.map(task => (
                <TaskItem key={task.id} task={task} />
              ))}
            </View>
          </>
        )}

        {pendingTasks.length === 0 && completedTasks.length === 0 && (
          <EmptyState 
            icon="📝" 
            title="暂无任务" 
            description="该班次暂无任务安排"
          />
        )}
      </ScrollView>
    </View>
  );
};

export default TaskPage;
