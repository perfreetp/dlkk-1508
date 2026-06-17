import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro, { useDidShow, usePullDownRefresh } from '@tarojs/taro';
import classNames from 'classnames';
import { useAppContext } from '@/context/AppContext';
import AlarmItem from '@/components/AlarmItem';
import EmptyState from '@/components/EmptyState';
import { Alarm } from '@/types';
import styles from './index.module.scss';

const AlarmPage: React.FC = () => {
  const { alarms, refreshData, pendingAlarms } = useAppContext();
  const [currentTab, setCurrentTab] = useState<string>('pending');
  const [filteredAlarms, setFilteredAlarms] = useState<Alarm[]>([]);

  useEffect(() => {
    console.log('[AlarmPage] Component mounted');
  }, []);

  useEffect(() => {
    filterAlarms();
  }, [currentTab, alarms]);

  useDidShow(() => {
    console.log('[AlarmPage] Page show');
    filterAlarms();
  });

  usePullDownRefresh(() => {
    console.log('[AlarmPage] Pull down refresh');
    refreshData();
    setTimeout(() => {
      Taro.stopPullDownRefresh();
    }, 1000);
  });

  const filterAlarms = () => {
    let result: Alarm[];
    if (currentTab === 'all') {
      result = alarms;
    } else {
      result = alarms.filter(a => a.status === currentTab);
    }
    setFilteredAlarms(result.sort((a, b) => 
      new Date(b.happenTime).getTime() - new Date(a.happenTime).getTime()
    ));
  };

  const handleCallSupport = () => {
    console.log('[AlarmPage] Call support');
    Taro.makePhoneCall({
      phoneNumber: '13800138000',
      fail: (err) => {
        console.error('[AlarmPage] Call failed:', err);
      }
    });
  };

  const handleTransfer = () => {
    console.log('[AlarmPage] Transfer to duty desk');
    if (pendingAlarms.length === 0) {
      Taro.showToast({
        title: '暂无待处理告警',
        icon: 'none'
      });
      return;
    }
    Taro.showModal({
      title: '转交值班台',
      content: `确定将 ${pendingAlarms.length} 条待处理告警转交值班台处理吗？`,
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({
            title: '已转交值班台',
            icon: 'success'
          });
        }
      }
    });
  };

  const tabs = [
    { key: 'pending', label: '待处理', count: alarms.filter(a => a.status === 'pending').length },
    { key: 'processing', label: '处理中', count: alarms.filter(a => a.status === 'processing').length },
    { key: 'resolved', label: '已解决', count: alarms.filter(a => a.status === 'resolved').length },
    { key: 'transferred', label: '已转交', count: alarms.filter(a => a.status === 'transferred').length },
    { key: 'all', label: '全部', count: alarms.length }
  ];

  const pendingCount = alarms.filter(a => a.status === 'pending').length;
  const processingCount = alarms.filter(a => a.status === 'processing').length;
  const resolvedCount = alarms.filter(a => a.status === 'resolved').length;

  return (
    <View className={styles.alarmPage}>
      <ScrollView className={styles.pageContainer} scrollY>
        <View className={styles.summaryCard}>
          <View className={styles.summaryItem}>
            <Text className={styles.summaryValue}>{pendingCount}</Text>
            <Text className={styles.summaryLabel}>待处理</Text>
          </View>
          <View className={styles.summaryItem}>
            <Text className={styles.summaryValue}>{processingCount}</Text>
            <Text className={styles.summaryLabel}>处理中</Text>
          </View>
          <View className={styles.summaryItem}>
            <Text className={styles.summaryValue}>{resolvedCount}</Text>
            <Text className={styles.summaryLabel}>已解决</Text>
          </View>
        </View>

        <View className={styles.quickActions}>
          <View className={classNames(styles.quickBtn, styles.call)} onClick={handleCallSupport}>
            <Text className={styles.btnIcon}>📞</Text>
            <Text>一键呼叫</Text>
          </View>
          <View className={classNames(styles.quickBtn, styles.transfer)} onClick={handleTransfer}>
            <Text className={styles.btnIcon}>📤</Text>
            <Text>批量转交</Text>
          </View>
        </View>

        <ScrollView className={styles.filterTabs} scrollX showScrollbar={false}>
          {tabs.map(tab => (
            <Text
              key={tab.key}
              className={classNames(styles.filterTab, currentTab === tab.key && styles.active)}
              onClick={() => setCurrentTab(tab.key)}
            >
              {tab.label}
              <Text className={styles.tabCount}>{tab.count}</Text>
            </Text>
          ))}
        </ScrollView>

        <View className={styles.alarmList}>
          {filteredAlarms.length > 0 ? (
            filteredAlarms.map(alarm => (
              <AlarmItem key={alarm.id} alarm={alarm} />
            ))
          ) : (
            <EmptyState 
              icon="🔔" 
              title="暂无告警记录" 
              description="当前筛选条件下没有告警信息"
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default AlarmPage;
