import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';

interface StatCardProps {
  title: string;
  value: number | string;
  unit?: string;
  trend?: 'up' | 'down' | 'none';
  trendValue?: string;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  unit,
  trend = 'none',
  trendValue,
  color
}) => {
  return (
    <View className={styles.statCard}>
      <View className={styles.statIcon} style={{ backgroundColor: color + '15' }}>
        <View className={styles.statDot} style={{ backgroundColor: color }} />
      </View>
      <View className={styles.statInfo}>
        <Text className={styles.statTitle}>{title}</Text>
        <View className={styles.statValueRow}>
          <Text className={styles.statValue} style={{ color }}>{value}</Text>
          {unit && <Text className={styles.statUnit}>{unit}</Text>}
        </View>
        {trendValue && (
          <View className={styles.statTrend}>
            <Text 
              className={styles.trendText}
              style={{ color: trend === 'up' ? '#F53F3F' : trend === 'down' ? '#00B42A' : '#86909C' }}
            >
              {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '—'} {trendValue}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default StatCard;
