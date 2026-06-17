import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro, { useDidShow, usePullDownRefresh } from '@tarojs/taro';
import classNames from 'classnames';
import { useAppContext } from '@/context/AppContext';
import CameraItem from '@/components/CameraItem';
import EmptyState from '@/components/EmptyState';
import { Building, Camera } from '@/types';
import styles from './index.module.scss';

const BuildingPage: React.FC = () => {
  const { buildings, refreshData, cameras } = useAppContext();
  const [expandedBuilding, setExpandedBuilding] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    console.log('[BuildingPage] Component mounted');
  }, []);

  useDidShow(() => {
    console.log('[BuildingPage] Page show');
  });

  usePullDownRefresh(() => {
    console.log('[BuildingPage] Pull down refresh');
    refreshData();
    setTimeout(() => {
      Taro.stopPullDownRefresh();
    }, 1000);
  });

  const handleBuildingClick = (buildingId: string) => {
    setExpandedBuilding(expandedBuilding === buildingId ? null : buildingId);
  };

  const handleScanClick = () => {
    Taro.scanCode({
      success: (res) => {
        console.log('[BuildingPage] Scan result:', res.result);
        Taro.navigateTo({
          url: `/pages/scan-bind/index?code=${res.result}`
        });
      },
      fail: (err) => {
        console.error('[BuildingPage] Scan failed:', err);
        Taro.showToast({
          title: '扫码失败',
          icon: 'none'
        });
      }
    });
  };

  const filterCameras = (cameraList: Camera[]): Camera[] => {
    if (filterStatus === 'all') return cameraList;
    return cameraList.filter(c => c.status === filterStatus);
  };

  const filterTabs = [
    { key: 'all', label: '全部' },
    { key: 'online', label: '在线' },
    { key: 'offline', label: '离线' },
    { key: 'blocked', label: '遮挡' },
    { key: 'disconnected', label: '断流' }
  ];

  return (
    <View className={styles.buildingPage}>
      <ScrollView className={styles.pageContainer} scrollY>
        <View className={styles.filterBar}>
          <ScrollView className={styles.filterTabs} scrollX showScrollbar={false}>
            {filterTabs.map(tab => (
              <Text
                key={tab.key}
                className={classNames(styles.filterTab, filterStatus === tab.key && styles.active)}
                onClick={() => setFilterStatus(tab.key)}
              >
                {tab.label}
              </Text>
            ))}
          </ScrollView>
          <View className={styles.scanBtn} onClick={handleScanClick}>
            <Text>扫码绑定</Text>
          </View>
        </View>

        <View className={styles.buildingList}>
          {buildings.length > 0 ? (
            buildings.map(building => (
              <View key={building.id} className={styles.buildingCard}>
                <View 
                  className={styles.buildingHeader}
                  onClick={() => handleBuildingClick(building.id)}
                >
                  <View className={styles.buildingIcon}>
                    <Text className={styles.buildingIconText}>🏢</Text>
                  </View>
                  <View className={styles.buildingInfo}>
                    <Text className={styles.buildingName}>{building.name}</Text>
                    <Text className={styles.buildingAddress}>{building.address}</Text>
                  </View>
                  <View className={styles.buildingStats}>
                    <View className={classNames(styles.statBadge, styles.online)}>
                      <Text>{building.onlineCameras}在线</Text>
                    </View>
                    {building.offlineCameras > 0 && (
                      <View className={classNames(styles.statBadge, styles.offline)}>
                        <Text>{building.offlineCameras}离线</Text>
                      </View>
                    )}
                  </View>
                  <Text className={classNames(
                    styles.expandIcon, 
                    expandedBuilding === building.id && styles.expanded
                  )}>
                    ▼
                  </Text>
                </View>

                {expandedBuilding === building.id && (
                  <View className={styles.floorList}>
                    {building.floors.map(floor => {
                      const filteredCameras = filterCameras(floor.cameras);
                      if (filteredCameras.length === 0) return null;
                      
                      return (
                        <View key={floor.id} className={styles.floorItem}>
                          <View className={styles.floorHeader}>
                            <Text className={styles.floorName}>{floor.name}</Text>
                            <Text className={styles.floorCount}>
                              {filteredCameras.length} / {floor.totalCameras} 个摄像头
                            </Text>
                          </View>
                          <View className={styles.cameraGrid}>
                            {filteredCameras.map(camera => (
                              <CameraItem key={camera.id} camera={camera} />
                            ))}
                          </View>
                        </View>
                      );
                    })}
                    
                    {building.floors.every(floor => filterCameras(floor.cameras).length === 0) && (
                      <EmptyState 
                        icon="📷" 
                        title="暂无符合条件的摄像头" 
                        description="请尝试切换筛选条件"
                      />
                    )}
                  </View>
                )}
              </View>
            ))
          ) : (
            <EmptyState 
              icon="🏢" 
              title="暂无楼栋数据" 
              description="请联系管理员添加楼栋信息"
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default BuildingPage;
