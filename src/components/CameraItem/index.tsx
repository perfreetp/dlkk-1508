import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classNames from 'classnames';
import { Camera } from '@/types';
import { getStatusText, getStatusColor, getCameraTypeText } from '@/utils';
import { useAppContext } from '@/context/AppContext';
import styles from './index.module.scss';

interface CameraItemProps {
  camera: Camera;
  showFavorite?: boolean;
  onClick?: () => void;
}

const CameraItem: React.FC<CameraItemProps> = ({ camera, showFavorite = true, onClick }) => {
  const { toggleFavorite } = useAppContext();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      Taro.navigateTo({
        url: `/pages/video-detail/index?id=${camera.id}`
      });
    }
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(camera.id);
  };

  return (
    <View className={styles.cameraItem} onClick={handleClick}>
      <View className={styles.cameraImageWrap}>
        <Image 
          className={styles.cameraImage} 
          src={camera.snapshotUrl} 
          mode="aspectFill"
        />
        <View 
          className={classNames(styles.statusBadge, styles[camera.status])}
          style={{ backgroundColor: getStatusColor(camera.status) }}
        >
          <Text className={styles.statusText}>{getStatusText(camera.status)}</Text>
        </View>
        {showFavorite && (
          <View 
            className={classNames(styles.favoriteBtn, camera.isFavorite && styles.active)}
            onClick={handleFavorite}
          >
            <Text className={styles.favoriteIcon}>{camera.isFavorite ? '★' : '☆'}</Text>
          </View>
        )}
      </View>
      
      <View className={styles.cameraInfo}>
        <View className={styles.cameraHeader}>
          <Text className={styles.cameraName}>{camera.name}</Text>
          <View className={styles.typeTag}>
            <Text className={styles.typeText}>{getCameraTypeText(camera.type)}</Text>
          </View>
        </View>
        <Text className={styles.locationText}>{camera.location}</Text>
        <View className={styles.cameraFooter}>
          <Text className={styles.codeText}>{camera.code}</Text>
          <Text className={styles.floorText}>{camera.floor}</Text>
        </View>
      </View>
    </View>
  );
};

export default CameraItem;
