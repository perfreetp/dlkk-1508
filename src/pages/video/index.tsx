import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Input } from '@tarojs/components';
import Taro, { useDidShow, usePullDownRefresh } from '@tarojs/taro';
import classNames from 'classnames';
import { useAppContext } from '@/context/AppContext';
import CameraItem from '@/components/CameraItem';
import EmptyState from '@/components/EmptyState';
import { Camera } from '@/types';
import { getRecentCameras } from '@/data/video';
import styles from './index.module.scss';

const VideoPage: React.FC = () => {
  const { cameras, refreshData, toggleFavorite } = useAppContext();
  const [searchText, setSearchText] = useState('');
  const [filterBuilding, setFilterBuilding] = useState<string>('all');
  const [favoriteCameras, setFavoriteCameras] = useState<Camera[]>([]);
  const [recentCameras, setRecentCameras] = useState<Camera[]>([]);
  const [filteredCameras, setFilteredCameras] = useState<Camera[]>([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>('today');

  useEffect(() => {
    console.log('[VideoPage] Component mounted');
    loadData();
  }, []);

  useEffect(() => {
    filterCameras();
  }, [searchText, filterBuilding, cameras]);

  useDidShow(() => {
    console.log('[VideoPage] Page show');
    loadData();
  });

  usePullDownRefresh(() => {
    console.log('[VideoPage] Pull down refresh');
    refreshData();
    loadData();
    setTimeout(() => {
      Taro.stopPullDownRefresh();
    }, 1000);
  });

  const loadData = () => {
    setFavoriteCameras(cameras.filter(c => c.isFavorite));
    setRecentCameras(getRecentCameras());
    filterCameras();
  };

  const filterCameras = () => {
    let result = cameras;
    
    if (searchText) {
      const keyword = searchText.toLowerCase();
      result = result.filter(c => 
        c.name.toLowerCase().includes(keyword) || 
        c.code.toLowerCase().includes(keyword) ||
        c.location.toLowerCase().includes(keyword)
      );
    }
    
    if (filterBuilding !== 'all') {
      result = result.filter(c => c.buildingId === filterBuilding);
    }
    
    setFilteredCameras(result);
  };

  const handleScanClick = () => {
    Taro.scanCode({
      success: (res) => {
        console.log('[VideoPage] Scan result:', res.result);
        Taro.navigateTo({
          url: `/pages/scan-bind/index?code=${res.result}`
        });
      },
      fail: (err) => {
        console.error('[VideoPage] Scan failed:', err);
      }
    });
  };

  const handleViewHistory = () => {
    console.log('[VideoPage] View history records');
    Taro.showToast({
      title: '正在加载历史录像...',
      icon: 'loading',
      duration: 1000
    });
  };

  const buildingOptions = [
    { key: 'all', label: '全部楼栋' },
    { key: 'b001', label: 'A栋办公楼' },
    { key: 'b002', label: 'B栋研发楼' },
    { key: 'b003', label: 'C栋宿舍楼' }
  ];

  const timeRanges = [
    { key: 'today', label: '今天', start: '00:00', end: '现在' },
    { key: 'yesterday', label: '昨天', start: '00:00', end: '23:59' },
    { key: 'week', label: '近7天', start: '-7天', end: '现在' }
  ];

  return (
    <View className={styles.videoPage}>
      <ScrollView className={styles.pageContainer} scrollY>
        <View className={styles.searchBar}>
          <View className={styles.searchInputWrap}>
            <Text className={styles.searchIcon}>🔍</Text>
            <Input
              className={styles.searchInput}
              placeholder="搜索摄像头名称/编号"
              value={searchText}
              onInput={(e) => setSearchText(e.detail.value)}
            />
          </View>
          <View className={styles.scanBtn} onClick={handleScanClick}>
            <Text className={styles.scanIcon}>📷</Text>
          </View>
        </View>

        <View className={styles.sectionArea}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionTitle}>常用点位</Text>
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
                  <CameraItem camera={camera} />
                </View>
              ))}
            </ScrollView>
          ) : (
            <EmptyState 
              icon="⭐" 
              title="暂无收藏点位" 
              description="点击摄像头右上角☆收藏常用点位"
            />
          )}
        </View>

        <View className={styles.sectionArea}>
          <View className={styles.historySection}>
            <View className={styles.historyHeader}>
              <Text className={styles.historyTitle}>
                <Text className={styles.historyIcon}>📹</Text>
                调看历史片段
              </Text>
              <Text className={styles.dateSelect}>选择日期 →</Text>
            </View>
            <View className={styles.timeRange}>
              {timeRanges.map(range => (
                <View 
                  key={range.key}
                  className={classNames(styles.timeItem, selectedTimeRange === range.key && styles.active)}
                  onClick={() => setSelectedTimeRange(range.key)}
                >
                  <Text className={styles.timeLabel}>{range.label}</Text>
                  <Text className={styles.timeValue}>{range.start}</Text>
                  <Text className={styles.timeLabel}>至 {range.end}</Text>
                </View>
              ))}
            </View>
            <View className={styles.historyBtn} onClick={handleViewHistory}>
              <Text>查看历史录像</Text>
            </View>
          </View>
        </View>

        <View className={styles.sectionArea}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionTitle}>全部摄像头</Text>
            <Text className={styles.sectionMore}>
              共 {filteredCameras.length} 个
            </Text>
          </View>

          <ScrollView className={styles.filterTabs} scrollX showScrollbar={false}>
            {buildingOptions.map(option => (
              <Text
                key={option.key}
                className={classNames(styles.filterTab, filterBuilding === option.key && styles.active)}
                onClick={() => setFilterBuilding(option.key)}
              >
                {option.label}
              </Text>
            ))}
          </ScrollView>

          {filteredCameras.length > 0 ? (
            <View className={styles.cameraGrid}>
              {filteredCameras.map(camera => (
                <CameraItem key={camera.id} camera={camera} />
              ))}
            </View>
          ) : (
            <EmptyState 
              icon="📷" 
              title="暂无摄像头" 
              description="请调整筛选条件或搜索关键词"
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default VideoPage;
