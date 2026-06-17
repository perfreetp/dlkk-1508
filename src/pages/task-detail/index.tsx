import React, { useState, useMemo } from 'react';
import { View, Text, Image, Button, ScrollView } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import styles from './index.module.scss';
import { useAppContext } from '@/context/AppContext';
import { formatDateTime, getStatusText } from '@/utils';
import { Task } from '@/types';

interface TimelineRecord {
  id: string;
  title: string;
  time: string;
  description: string;
  type: 'info' | 'success' | 'warning' | 'error';
  images?: string[];
}

const TaskDetailPage: React.FC = () => {
  const router = useRouter();
  const { tasks, cameras, user, updateTaskStatus, addTaskImage, removeTaskImage } = useAppContext();
  const [isProcessing, setIsProcessing] = useState(false);

  const task = useMemo<Task | null>(() => {
    return tasks.find(t => t.id === router.params.id) || null;
  }, [tasks, router.params.id]);

  const relatedCamera = useMemo(() => {
    if (!task) return null;
    return cameras.find(c => c.buildingName === task.buildingName) || cameras[0] || null;
  }, [task, cameras]);

  const timelineRecords = useMemo<TimelineRecord[]>(() => {
    if (!task) return [];

    const records: TimelineRecord[] = [
      {
        id: '1',
        title: '任务创建',
        time: task.createTime,
        description: `任务已创建，指派给${task.handler || '安保班组'}`,
        type: 'info'
      }
    ];

    if (task.status === 'processing' || task.status === 'completed') {
      records.push({
        id: '2',
        title: '开始处理',
        time: task.createTime,
        description: `${task.handler || user.name}开始处理该任务`,
        type: 'info',
        images: task.images.length > 0 ? [task.images[0]] : []
      });
    }

    if (task.status === 'completed') {
      records.push({
        id: '3',
        title: '任务完成',
        time: task.deadline || new Date().toISOString(),
        description: '任务已处理完成，所有问题已解决',
        type: 'success',
        images: task.images.length > 1 ? task.images.slice(1) : []
      });
    }

    return records;
  }, [task, user.name]);

  const handleAddPhoto = () => {
    if (!task) return;
    console.log('[TaskDetail] Adding photo...');
    Taro.chooseImage({
      count: 9 - task.images.length,
      success: (res) => {
        console.log('[TaskDetail] Photos selected:', res.tempFilePaths);
        res.tempFilePaths.forEach(img => addTaskImage(task.id, img));
      },
      fail: (err) => {
        console.error('[TaskDetail] Failed to choose image:', err);
        const mockImages = [
          `https://picsum.photos/id/${8 + task.images.length}/400/300`
        ];
        mockImages.forEach(img => addTaskImage(task.id, img));
      }
    });
  };

  const handleDeletePhoto = (index: number) => {
    if (!task) return;
    console.log('[TaskDetail] Deleting photo at index:', index);
    removeTaskImage(task.id, index);
  };

  const handleViewCamera = (cameraId: string) => {
    console.log('[TaskDetail] Viewing camera:', cameraId);
    Taro.navigateTo({
      url: `/pages/video-detail/index?id=${cameraId}`
    });
  };

  const handleStartProcess = async () => {
    if (!task) return;
    setIsProcessing(true);
    console.log('[TaskDetail] Starting process for task:', task.id);

    try {
      updateTaskStatus(task.id, 'processing');

      Taro.showToast({
        title: '已开始处理',
        icon: 'success'
      });
    } catch (error) {
      console.error('[TaskDetail] Failed to start process:', error);
      Taro.showToast({
        title: '操作失败，请重试',
        icon: 'none'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleComplete = async () => {
    if (!task) return;
    setIsProcessing(true);
    console.log('[TaskDetail] Completing task:', task.id);

    try {
      updateTaskStatus(task.id, 'completed');

      Taro.showToast({
        title: '任务已完成',
        icon: 'success'
      });

      setTimeout(() => {
        Taro.navigateBack();
      }, 1500);
    } catch (error) {
      console.error('[TaskDetail] Failed to complete task:', error);
      Taro.showToast({
        title: '操作失败，请重试',
        icon: 'none'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTransfer = () => {
    if (!task) return;
    console.log('[TaskDetail] Transferring task:', task.id);

    Taro.showModal({
      title: '转交值班台',
      content: '确定将此任务转交值班台处理吗？',
      success: (res) => {
        if (res.confirm) {
          updateTaskStatus(task.id, 'completed');
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

  const handleCallSupport = () => {
    console.log('[TaskDetail] Calling support...');
    Taro.makePhoneCall({
      phoneNumber: '13800138000',
      fail: () => {
        Taro.showToast({
          title: '呼叫支援中...',
          icon: 'none'
        });
      }
    });
  };

  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case 'high': return styles.priorityHigh;
      case 'medium': return styles.priorityMedium;
      case 'low': return styles.priorityLow;
      default: return styles.priorityMedium;
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return '高优先级';
      case 'medium': return '中优先级';
      case 'low': return '低优先级';
      default: return '中优先级';
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'pending': return styles.statusPending;
      case 'processing': return styles.statusProcessing;
      case 'completed': return styles.statusCompleted;
      default: return styles.statusPending;
    }
  };

  const getTimelineDotClass = (type: string) => {
    switch (type) {
      case 'success': return styles.success;
      case 'warning': return styles.warning;
      case 'error': return styles.error;
      default: return '';
    }
  };

  const getCameraStatusClass = (status: string) => {
    return status === 'online' ? styles.online : styles.offline;
  };

  const getCameraStatusText = (status: string) => {
    return status === 'online' ? '在线' : '离线';
  };

  if (!task) {
    return (
      <View className={styles.page}>
        <View className={styles.emptyState}>
          <Text>任务不存在</Text>
        </View>
      </View>
    );
  }

  return (
    <View className={styles.page}>
      <ScrollView scrollY enhanced showScrollbar={false}>
        <View className={styles.taskHeader}>
          <Text className={styles.taskTitle}>{task.title}</Text>
          <View className={styles.taskMeta}>
            <View className={`${styles.metaTag} ${styles.type}`}>
              {task.typeName}
            </View>
            <View className={`${styles.metaTag} ${getPriorityClass(task.priority)}`}>
              {getPriorityText(task.priority)}
            </View>
            <View className={`${styles.metaTag} ${getStatusClass(task.status)}`}>
              {getStatusText(task.status)}
            </View>
            <View className={`${styles.metaTag} ${styles.type}`}>
              {task.shiftName}
            </View>
          </View>
          <View className={styles.taskInfoGrid}>
            <View className={styles.infoItem}>
              <Text className={styles.infoLabel}>任务位置</Text>
              <Text className={styles.infoValue}>{task.location}</Text>
            </View>
            <View className={styles.infoItem}>
              <Text className={styles.infoLabel}>所属楼栋</Text>
              <Text className={styles.infoValue}>{task.buildingName}</Text>
            </View>
            <View className={styles.infoItem}>
              <Text className={styles.infoLabel}>创建时间</Text>
              <Text className={styles.infoValue}>{formatDateTime(task.createTime)}</Text>
            </View>
            <View className={styles.infoItem}>
              <Text className={styles.infoLabel}>截止时间</Text>
              <Text className={styles.infoValue}>
                {task.deadline ? formatDateTime(task.deadline) : '-'}
              </Text>
            </View>
            {task.handler && (
              <View className={styles.infoItem}>
                <Text className={styles.infoLabel}>处理人</Text>
                <Text className={styles.infoValue}>{task.handler}</Text>
              </View>
            )}
          </View>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>任务描述</Text>
          <Text className={styles.sectionContent}>{task.description}</Text>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>处置照片</Text>
          {task.images.length > 0 || task.status !== 'completed' ? (
            <View className={styles.photoGrid}>
              {task.images.map((img, index) => (
                <View key={index} className={styles.photoItem}>
                  <Image
                    className={styles.photoImage}
                    src={img}
                    mode='aspectFill'
                  />
                  {task.status !== 'completed' && (
                    <View className={styles.photoDelete} onClick={() => handleDeletePhoto(index)}>
                      ×
                    </View>
                  )}
                </View>
              ))}
              {task.images.length < 9 && task.status !== 'completed' && (
                <View className={styles.photoAdd} onClick={handleAddPhoto}>
                  <Text className={styles.photoAddIcon}>+</Text>
                  <Text className={styles.photoAddText}>添加照片</Text>
                </View>
              )}
            </View>
          ) : (
            <View className={styles.emptyState}>
              <Text>暂无处置照片</Text>
            </View>
          )}
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>关联摄像头</Text>
          {relatedCamera ? (
            <View
              className={styles.cameraItem}
              onClick={() => handleViewCamera(relatedCamera.id)}
            >
              <Image
                className={styles.cameraSnapshot}
                src={relatedCamera.snapshotUrl}
                mode='aspectFill'
              />
              <View className={styles.cameraInfo}>
                <Text className={styles.cameraName}>{relatedCamera.name}</Text>
                <Text className={styles.cameraLocation}>
                  {relatedCamera.buildingName} {relatedCamera.floor} {relatedCamera.location}
                </Text>
              </View>
              <View className={`${styles.cameraStatus} ${getCameraStatusClass(relatedCamera.status)}`}>
                {getCameraStatusText(relatedCamera.status)}
              </View>
              <Text className={styles.cameraArrow}>›</Text>
            </View>
          ) : (
            <View className={styles.emptyState}>
              <Text>暂无关联摄像头</Text>
            </View>
          )}
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>处理记录</Text>
          {timelineRecords.length > 0 ? (
            <View className={styles.timeline}>
              {timelineRecords.map((record) => (
                <View key={record.id} className={styles.timelineItem}>
                  <View className={`${styles.timelineDot} ${getTimelineDotClass(record.type)}`} />
                  <View className={styles.timelineContent}>
                    <Text className={styles.timelineTitle}>{record.title}</Text>
                    <Text className={styles.timelineTime}>{formatDateTime(record.time)}</Text>
                    <Text className={styles.timelineDesc}>{record.description}</Text>
                    {record.images && record.images.length > 0 && (
                      <View className={styles.timelineImages}>
                        {record.images.map((img, idx) => (
                          <Image
                            key={idx}
                            className={styles.timelineImage}
                            src={img}
                            mode='aspectFill'
                          />
                        ))}
                      </View>
                    )}
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View className={styles.emptyState}>
              <Text>暂无处理记录</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {task.status !== 'completed' && (
        <View className={styles.bottomBar}>
          <View className={styles.actionRow}>
            {task.status === 'pending' && (
              <Button
                className={`${styles.actionBtn} ${styles.btnPrimary}`}
                disabled={isProcessing}
                onClick={handleStartProcess}
              >
                开始处理
              </Button>
            )}
            {task.status === 'processing' && (
              <>
                <Button
                  className={`${styles.actionBtn} ${styles.btnSecondary}`}
                  onClick={handleCallSupport}
                >
                  呼叫支援
                </Button>
                <Button
                  className={`${styles.actionBtn} ${styles.btnWarning}`}
                  onClick={handleTransfer}
                >
                  转交值班台
                </Button>
                <Button
                  className={`${styles.actionBtn} ${styles.btnSuccess}`}
                  disabled={isProcessing}
                  onClick={handleComplete}
                >
                  标记完成
                </Button>
              </>
            )}
          </View>
        </View>
      )}
    </View>
  );
};

export default TaskDetailPage;
