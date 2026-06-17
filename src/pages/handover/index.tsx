import React, { useState, useMemo } from 'react';
import { View, Text, Image, Textarea, Button, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { useAppContext } from '@/context/AppContext';
import { HandoverRecord } from '@/types';

const HandoverPage: React.FC = () => {
  const { user, pendingTasks, pendingAlarms, handoverRecords, addHandoverRecord } = useAppContext();
  const [notes, setNotes] = useState<string>('');
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const unresolvedCount = useMemo(() => {
    return pendingTasks.filter(t => t.status === 'pending').length;
  }, [pendingTasks]);

  const alarmCount = useMemo(() => {
    return pendingAlarms.length;
  }, [pendingAlarms]);

  const handleAddPhoto = () => {
    console.log('[Handover] Adding photo...');
    Taro.chooseImage({
      count: 9 - images.length,
      success: (res) => {
        console.log('[Handover] Photos selected:', res.tempFilePaths);
        const newImages = [...images, ...res.tempFilePaths];
        setImages(newImages);
      },
      fail: (err) => {
        console.error('[Handover] Failed to choose image:', err);
        const mockImages = [
          `https://picsum.photos/id/${1 + images.length}/400/300`
        ];
        setImages([...images, ...mockImages]);
      }
    });
  };

  const handleDeletePhoto = (index: number) => {
    console.log('[Handover] Deleting photo at index:', index);
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
  };

  const handleSubmit = async () => {
    if (!notes.trim()) {
      Taro.showToast({
        title: '请填写交接备注',
        icon: 'none'
      });
      return;
    }

    setIsSubmitting(true);
    console.log('[Handover] Submitting handover...', { notes, images });

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      const now = new Date();
      const newRecord: HandoverRecord = {
        id: `handover_${Date.now()}`,
        shift: user.shift,
        shiftName: user.shiftName,
        date: now.toISOString(),
        startTime: now.toISOString(),
        endTime: now.toISOString(),
        operator: user.name,
        receiver: '下一班次',
        notes: notes,
        unresolvedTasks: unresolvedCount,
        alarms: alarmCount,
        images: images
      };
      addHandoverRecord(newRecord);

      Taro.showToast({
        title: '交接成功',
        icon: 'success'
      });

      setNotes('');
      setImages([]);

      setTimeout(() => {
        Taro.navigateBack();
      }, 1500);
    } catch (error) {
      console.error('[Handover] Failed to submit handover:', error);
      Taro.showToast({
        title: '交接失败，请重试',
        icon: 'none'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}月${day}日`;
  };

  return (
    <View className={styles.page}>
      <ScrollView scrollY enhanced showScrollbar={false}>
        <View className={styles.shiftCard}>
          <View className={styles.shiftHeader}>
            <Image
              className={styles.avatar}
              src={user.avatar}
              mode='aspectFill'
            />
            <View className={styles.userInfo}>
              <Text className={styles.userName}>{user.name}</Text>
              <Text className={styles.userRole}>{user.role}</Text>
            </View>
          </View>
          <View className={styles.shiftInfo}>
            <View className={styles.shiftItem}>
              <Text className={styles.shiftLabel}>当前班次</Text>
              <Text className={styles.shiftValue}>{user.shiftName}</Text>
            </View>
            <View className={styles.shiftItem}>
              <Text className={styles.shiftLabel}>负责区域</Text>
              <Text className={styles.shiftValue}>{user.building}</Text>
            </View>
          </View>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>当班未结事项</Text>
          <View className={styles.statsGrid}>
            <View className={styles.statCard}>
              <Text className={styles.statValue}>{unresolvedCount}</Text>
              <Text className={styles.statLabel}>待处理任务</Text>
            </View>
            <View className={styles.statCard}>
              <Text className={`${styles.statValue} ${styles.warning}`}>{alarmCount}</Text>
              <Text className={styles.statLabel}>待处理告警</Text>
            </View>
          </View>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>交接备注</Text>
          <Textarea
            className={styles.notesArea}
            placeholder='请详细记录本班次的重要事项、待处理问题及注意事项...'
            placeholderClass={styles.notesPlaceholder}
            value={notes}
            onInput={(e) => setNotes(e.detail.value)}
            maxlength={500}
            autoHeight
          />
          
          <View className={styles.photoSection}>
            <View className={styles.photoGrid}>
              {images.map((img, index) => (
                <View key={index} className={styles.photoItem}>
                  <Image
                    className={styles.photoImage}
                    src={img}
                    mode='aspectFill'
                    onClick={() => handleDeletePhoto(index)}
                  />
                  <View className={styles.photoDelete} onClick={() => handleDeletePhoto(index)}>
                    ×
                  </View>
                </View>
              ))}
              {images.length < 9 && (
                <View className={styles.photoAdd} onClick={handleAddPhoto}>
                  <Text className={styles.photoAddIcon}>+</Text>
                  <Text className={styles.photoAddText}>添加照片</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>历史交接记录</Text>
          {handoverRecords.length > 0 ? (
            <View className={styles.historyList}>
              {handoverRecords.map((record) => (
                <View key={record.id} className={styles.historyItem}>
                  <View className={styles.historyHeader}>
                    <Text className={styles.historyShift}>{record.shiftName}</Text>
                    <Text className={styles.historyDate}>{formatDate(record.date)}</Text>
                  </View>
                  <View className={styles.historyMeta}>
                    <View className={styles.historyMetaItem}>
                      <Text>交班人：{record.operator}</Text>
                    </View>
                    <View className={styles.historyMetaItem}>
                      <Text>接班人：{record.receiver}</Text>
                    </View>
                  </View>
                  <View>
                    {record.unresolvedTasks > 0 && (
                      <Text className={styles.historyBadge}>
                        {record.unresolvedTasks}项未结
                      </Text>
                    )}
                    {record.alarms > 0 && (
                      <Text className={styles.historyBadge}>
                        {record.alarms}条告警
                      </Text>
                    )}
                  </View>
                  <Text className={styles.historyNotes}>{record.notes}</Text>
                  {record.images.length > 0 && (
                    <View className={styles.historyImages}>
                      {record.images.slice(0, 4).map((img, idx) => (
                        <Image
                          key={idx}
                          className={styles.historyImage}
                          src={img}
                          mode='aspectFill'
                        />
                      ))}
                    </View>
                  )}
                </View>
              ))}
            </View>
          ) : (
            <View className={styles.emptyHistory}>
              <Text>暂无历史交接记录</Text>
            </View>
          )}
        </View>
      </ScrollView>

      <View className={styles.bottomBar}>
        <Button
          className={styles.submitBtn}
          disabled={isSubmitting}
          onClick={handleSubmit}
        >
          {isSubmitting ? '提交中...' : '确认交接'}
        </Button>
      </View>
    </View>
  );
};

export default HandoverPage;
