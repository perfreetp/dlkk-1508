import React, { useState, useMemo } from 'react';
import { View, Text, Image, Button, Input, Textarea, Picker, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { useAppContext } from '@/context/AppContext';
import { getCameraTypeText } from '@/utils';
import { Camera } from '@/types';

const ScanBindPage: React.FC = () => {
  const { cameras, buildings } = useAppContext();
  const [showManual, setShowManual] = useState(false);
  const [scannedCamera, setScannedCamera] = useState<Camera | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isBinding, setIsBinding] = useState(false);

  const [manualCode, setManualCode] = useState('');
  const [cameraName, setCameraName] = useState('');
  const [selectedBuilding, setSelectedBuilding] = useState('');
  const [selectedFloor, setSelectedFloor] = useState('');
  const [location, setLocation] = useState('');
  const [remark, setRemark] = useState('');

  const buildingOptions = useMemo(() => {
    return buildings.map(b => b.name);
  }, [buildings]);

  const floorOptions = useMemo(() => {
    if (!selectedBuilding) return [];
    const building = buildings.find(b => b.name === selectedBuilding);
    return building ? building.floors.map(f => f.name) : [];
  }, [selectedBuilding, buildings]);

  const recentCameras = useMemo(() => {
    return cameras.slice(0, 5);
  }, [cameras]);

  const handleScan = () => {
    console.log('[ScanBind] Starting scan...');
    Taro.scanCode({
      success: (res) => {
        console.log('[ScanBind] Scan result:', res.result);
        mockScanResult(res.result);
      },
      fail: (err) => {
        console.error('[ScanBind] Scan failed:', err);
        Taro.showToast({
          title: '扫码失败，使用模拟数据',
          icon: 'none'
        });
        mockScanResult('CAM-2026-011');
      }
    });
  };

  const mockScanResult = (code: string) => {
    const mockCamera: Camera = {
      id: `cam_${Date.now()}`,
      name: '',
      code: code,
      location: '',
      buildingId: '',
      buildingName: '',
      floor: '',
      type: 'entrance',
      status: 'online',
      isFavorite: false,
      lastOnlineTime: new Date().toISOString(),
      snapshotUrl: `https://picsum.photos/id/3/400/300`
    };
    setScannedCamera(mockCamera);
    setCameraName('');
    setSelectedBuilding('');
    setSelectedFloor('');
    setLocation('');
    setRemark('');
  };

  const handleManualInput = () => {
    setShowManual(true);
    setScannedCamera(null);
  };

  const handleBuildingChange = (e: any) => {
    const index = e.detail.value;
    const buildingName = buildingOptions[index];
    setSelectedBuilding(buildingName);
    setSelectedFloor('');
  };

  const handleFloorChange = (e: any) => {
    const index = e.detail.value;
    const floorName = floorOptions[index];
    setSelectedFloor(floorName);
  };

  const handleCancel = () => {
    setScannedCamera(null);
    setShowManual(false);
    setManualCode('');
    setCameraName('');
    setSelectedBuilding('');
    setSelectedFloor('');
    setLocation('');
    setRemark('');
  };

  const handleBind = async () => {
    if (!scannedCamera && !showManual) return;

    const cameraToBind = scannedCamera || {
      id: `cam_${Date.now()}`,
      name: cameraName,
      code: manualCode,
      location: location,
      buildingId: '',
      buildingName: selectedBuilding,
      floor: selectedFloor,
      type: 'entrance' as const,
      status: 'online' as const,
      isFavorite: false,
      lastOnlineTime: new Date().toISOString(),
      snapshotUrl: `https://picsum.photos/id/6/400/300`
    };

    if (!cameraToBind.name.trim()) {
      Taro.showToast({
        title: '请输入摄像头名称',
        icon: 'none'
      });
      return;
    }
    if (!selectedBuilding) {
      Taro.showToast({
        title: '请选择所属楼栋',
        icon: 'none'
      });
      return;
    }
    if (!selectedFloor) {
      Taro.showToast({
        title: '请选择楼层',
        icon: 'none'
      });
      return;
    }
    if (!location.trim()) {
      Taro.showToast({
        title: '请输入安装位置',
        icon: 'none'
      });
      return;
    }

    setIsBinding(true);
    console.log('[ScanBind] Binding camera:', { ...cameraToBind, name: cameraName, buildingName: selectedBuilding, floor: selectedFloor, location, remark });

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        handleCancel();
      }, 2000);
    } catch (error) {
      console.error('[ScanBind] Failed to bind camera:', error);
      Taro.showToast({
        title: '绑定失败，请重试',
        icon: 'none'
      });
    } finally {
      setIsBinding(false);
    }
  };

  const handleViewCamera = (cameraId: string) => {
    console.log('[ScanBind] Viewing camera:', cameraId);
    Taro.navigateTo({
      url: `/pages/video-detail/index?id=${cameraId}`
    });
  };

  const getStatusClass = (status: string) => {
    return status === 'online' ? styles.online : styles.offline;
  };

  const getStatusText = (status: string) => {
    return status === 'online' ? '在线' : '离线';
  };

  return (
    <View className={styles.page}>
      <ScrollView scrollY enhanced showScrollbar={false}>
        {!scannedCamera && !showManual ? (
          <>
            <View className={styles.scanArea}>
              <View className={styles.scanIcon}>
                <Text>📷</Text>
              </View>
              <Text className={styles.scanTitle}>扫码绑定摄像头</Text>
              <Text className={styles.scanDesc}>
                扫描摄像头设备上的二维码，快速完成设备绑定，实现视频级联管理
              </Text>
              <Button className={styles.scanBtn} onClick={handleScan}>
                开始扫码
              </Button>
              <View className={styles.manualSection}>
                <Text>无法扫码？</Text>
                <Text className={styles.manualLink} onClick={handleManualInput}>
                  手动输入编号
                </Text>
              </View>
            </View>

            <View className={styles.divider}>
              <Text className={styles.dividerText}>已绑定摄像头</Text>
            </View>

            <View className={styles.recentSection}>
              <Text className={styles.sectionTitle}>最近绑定</Text>
              {recentCameras.length > 0 ? (
                <View className={styles.recentList}>
                  {recentCameras.map((camera) => (
                    <View
                      key={camera.id}
                      className={styles.recentItem}
                      onClick={() => handleViewCamera(camera.id)}
                    >
                      <Image
                        className={styles.recentSnapshot}
                        src={camera.snapshotUrl}
                        mode='aspectFill'
                      />
                      <View className={styles.recentInfo}>
                        <Text className={styles.recentName}>{camera.name}</Text>
                        <Text className={styles.recentLocation}>
                          {camera.buildingName} {camera.floor} {camera.location}
                        </Text>
                      </View>
                      <View className={`${styles.recentStatus} ${getStatusClass(camera.status)}`}>
                        {getStatusText(camera.status)}
                      </View>
                    </View>
                  ))}
                </View>
              ) : (
                <View className={styles.emptyState}>
                  <Text>暂无绑定记录</Text>
                </View>
              )}
            </View>
          </>
        ) : (
          <>
            {(scannedCamera || showManual) && (
              <View className={styles.cameraCard}>
                {scannedCamera && (
                  <View className={styles.cameraHeader}>
                    <Image
                      className={styles.cameraSnapshot}
                      src={scannedCamera.snapshotUrl}
                      mode='aspectFill'
                    />
                    <View className={styles.cameraInfo}>
                      <Text className={styles.cameraName}>
                        {scannedCamera.code}
                      </Text>
                      <Text className={styles.cameraCode}>
                        设备编号：{scannedCamera.code}
                      </Text>
                      <View className={styles.cameraType}>
                        {getCameraTypeText(scannedCamera.type)}
                      </View>
                    </View>
                  </View>
                )}

                {showManual && (
                  <View className={styles.formGroup}>
                    <Text className={styles.formLabel}>设备编号</Text>
                    <Input
                      className={styles.formInput}
                      placeholder='请输入摄像头设备编号'
                      value={manualCode}
                      onInput={(e) => setManualCode(e.detail.value)}
                    />
                  </View>
                )}

                <View className={styles.formGroup}>
                  <Text className={styles.formLabel}>摄像头名称</Text>
                  <Input
                    className={styles.formInput}
                    placeholder='请输入摄像头名称，如：北门入口'
                    value={cameraName}
                    onInput={(e) => setCameraName(e.detail.value)}
                  />
                </View>

                <View className={styles.formGroup}>
                  <Text className={styles.formLabel}>所属楼栋</Text>
                  <Picker
                    mode='selector'
                    range={buildingOptions}
                    value={buildingOptions.indexOf(selectedBuilding)}
                    onChange={handleBuildingChange}
                  >
                    <View className={styles.pickerContainer}>
                      {selectedBuilding ? (
                        <Text className={styles.pickerValue}>{selectedBuilding}</Text>
                      ) : (
                        <Text className={styles.pickerPlaceholder}>请选择楼栋</Text>
                      )}
                      <Text className={styles.pickerArrow}>›</Text>
                    </View>
                  </Picker>
                </View>

                <View className={styles.formGroup}>
                  <Text className={styles.formLabel}>楼层</Text>
                  <Picker
                    mode='selector'
                    range={floorOptions}
                    value={floorOptions.indexOf(selectedFloor)}
                    onChange={handleFloorChange}
                    disabled={!selectedBuilding}
                  >
                    <View className={styles.pickerContainer}>
                      {selectedFloor ? (
                        <Text className={styles.pickerValue}>{selectedFloor}</Text>
                      ) : (
                        <Text className={styles.pickerPlaceholder}>
                          {selectedBuilding ? '请选择楼层' : '请先选择楼栋'}
                        </Text>
                      )}
                      <Text className={styles.pickerArrow}>›</Text>
                    </View>
                  </Picker>
                </View>

                <View className={styles.formGroup}>
                  <Text className={styles.formLabel}>安装位置</Text>
                  <Input
                    className={styles.formInput}
                    placeholder='请输入具体安装位置，如：5楼机房门口'
                    value={location}
                    onInput={(e) => setLocation(e.detail.value)}
                  />
                </View>

                <View className={styles.formGroup}>
                  <Text className={styles.formLabel}>备注信息</Text>
                  <Textarea
                    className={styles.formTextarea}
                    placeholder='可选：填写其他备注信息...'
                    value={remark}
                    onInput={(e) => setRemark(e.detail.value)}
                    maxlength={200}
                  />
                </View>

                <View className={styles.actionRow}>
                  <Button className={`${styles.actionBtn} ${styles.btnSecondary}`} onClick={handleCancel}>
                    取消
                  </Button>
                  <Button
                    className={`${styles.actionBtn} ${styles.btnPrimary}`}
                    disabled={isBinding}
                    onClick={handleBind}
                  >
                    {isBinding ? '绑定中...' : '确认绑定'}
                  </Button>
                </View>
              </View>
            )}
          </>
        )}
      </ScrollView>

      {showSuccess && (
        <View className={styles.successOverlay}>
          <View className={styles.successCard}>
            <View className={styles.successIcon}>
              <Text>✓</Text>
            </View>
            <Text className={styles.successTitle}>绑定成功</Text>
            <Text className={styles.successDesc}>
              摄像头已成功绑定到{selectedBuilding} {selectedFloor}
            </Text>
            <Button className={styles.successBtn} onClick={() => setShowSuccess(false)}>
              完成
            </Button>
          </View>
        </View>
      )}
    </View>
  );
};

export default ScanBindPage;
