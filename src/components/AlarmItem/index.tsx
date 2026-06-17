import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classNames from 'classnames';
import { Alarm } from '@/types';
import { formatTime, getStatusText, getStatusColor, getAlarmLevelText, getAlarmLevelColor } from '@/utils';
import styles from './index.module.scss';

interface AlarmItemProps {
  alarm: Alarm;
  onClick?: () => void;
}

const AlarmItem: React.FC<AlarmItemProps> = ({ alarm, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      Taro.navigateTo({
        url: `/pages/alarm-detail/index?id=${alarm.id}`
      });
    }
  };

  return (
    <View className={styles.alarmItem} onClick={handleClick}>
      <View className={styles.alarmHeader}>
        <View className={styles.alarmType}>
          <View 
            className={styles.typeDot} 
            style={{ backgroundColor: getAlarmLevelColor(alarm.level) }} 
          />
          <Text className={styles.typeText}>{alarm.typeName}</Text>
          <View 
            className={classNames(styles.levelBadge, styles[`level${alarm.level}`])}
          >
            <Text className={styles.levelText}>{getAlarmLevelText(alarm.level)}</Text>
          </View>
        </View>
        <Text className={styles.timeText}>{formatTime(alarm.happenTime)}</Text>
      </View>
      
      <View className={styles.alarmContent}>
        <Image 
          className={styles.alarmImage} 
          src={alarm.snapshotUrl} 
          mode="aspectFill"
        />
        <View className={styles.alarmInfo}>
          <Text className={styles.cameraName}>{alarm.cameraName}</Text>
          <Text className={styles.locationText}>{alarm.location}</Text>
          <Text className={styles.descText}>{alarm.description}</Text>
        </View>
      </View>
      
      <View className={styles.alarmFooter}>
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
        {alarm.handler && (
          <Text className={styles.handlerText}>处理人：{alarm.handler}</Text>
        )}
      </View>
    </View>
  );
};

export default AlarmItem;
