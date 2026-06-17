import React from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { QuickAction as QuickActionType } from '@/types';
import styles from './index.module.scss';

interface QuickActionProps {
  actions: QuickActionType[];
}

const QuickAction: React.FC<QuickActionProps> = ({ actions }) => {
  const handleAction = (action: QuickActionType) => {
    console.log('[QuickAction] Clicked action:', action.name);
    if (action.path.startsWith('tel:')) {
      Taro.makePhoneCall({
        phoneNumber: action.path.replace('tel:', '')
      });
    } else if (action.path.startsWith('navigate:')) {
      Taro.navigateTo({
        url: action.path.replace('navigate:', '')
      });
    } else if (action.path.startsWith('switchTab:')) {
      Taro.switchTab({
        url: action.path.replace('switchTab:', '')
      });
    } else if (action.path === 'scan') {
      Taro.scanCode({
        success: (res) => {
          console.log('[QuickAction] Scan result:', res.result);
          Taro.showToast({
            title: '扫码成功',
            icon: 'success'
          });
          Taro.navigateTo({
            url: `/pages/scan-bind/index?code=${res.result}`
          });
        },
        fail: (err) => {
          console.error('[QuickAction] Scan failed:', err);
        }
      });
    }
  };

  return (
    <View className={styles.actionGrid}>
      {actions.map(action => (
        <View 
          key={action.id}
          className={styles.actionItem}
          onClick={() => handleAction(action)}
        >
          <View 
            className={styles.actionIcon}
            style={{ backgroundColor: action.color + '15' }}
          >
            <Text className={styles.iconText} style={{ color: action.color }}>
              {action.icon}
            </Text>
          </View>
          <Text className={styles.actionName}>{action.name}</Text>
        </View>
      ))}
    </View>
  );
};

export default QuickAction;
