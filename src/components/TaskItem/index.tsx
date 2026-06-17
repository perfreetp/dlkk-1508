import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classNames from 'classnames';
import { Task } from '@/types';
import { formatTime, getStatusText, getStatusColor, getAlarmLevelColor } from '@/utils';
import styles from './index.module.scss';

interface TaskItemProps {
  task: Task;
  onClick?: () => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      Taro.navigateTo({
        url: `/pages/task-detail/index?id=${task.id}`
      });
    }
  };

  return (
    <View className={styles.taskItem} onClick={handleClick}>
      <View className={styles.taskHeader}>
        <View className={styles.taskType}>
          <View 
            className={styles.typeDot} 
            style={{ backgroundColor: getAlarmLevelColor(task.priority) }} 
          />
          <Text className={styles.typeText}>{task.typeName}</Text>
        </View>
        <View 
          className={styles.statusBadge}
          style={{ 
            backgroundColor: getStatusColor(task.status) + '15',
            borderColor: getStatusColor(task.status)
          }}
        >
          <Text 
            className={styles.statusText}
            style={{ color: getStatusColor(task.status) }}
          >
            {getStatusText(task.status)}
          </Text>
        </View>
      </View>

      <Text className={styles.taskTitle}>{task.title}</Text>
      
      <View className={styles.taskInfo}>
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>位置</Text>
          <Text className={styles.infoValue}>{task.location}</Text>
        </View>
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>班次</Text>
          <Text className={styles.infoValue}>{task.shiftName}</Text>
        </View>
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>创建时间</Text>
          <Text className={styles.infoValue}>{formatTime(task.createTime)}</Text>
        </View>
      </View>

      {task.images.length > 0 && (
        <View className={styles.imageList}>
          {task.images.slice(0, 4).map((img, index) => (
            <Image 
              key={index}
              className={styles.taskImage} 
              src={img} 
              mode="aspectFill"
            />
          ))}
          {task.images.length > 4 && (
            <View className={styles.moreImages}>
              <Text className={styles.moreText}>+{task.images.length - 4}</Text>
            </View>
          )}
        </View>
      )}

      {task.deadline && (
        <View className={styles.deadlineRow}>
          <Text className={styles.deadlineLabel}>截止时间</Text>
          <Text className={styles.deadlineValue}>{task.deadline}</Text>
        </View>
      )}

      {task.handler && (
        <View className={styles.handlerRow}>
          <Text className={styles.handlerText}>负责人：{task.handler}</Text>
        </View>
      )}
    </View>
  );
};

export default TaskItem;
