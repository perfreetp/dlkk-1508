export const formatTime = (dateStr: string): string => {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return '刚刚';
  if (minutes < 60) return `${minutes}分钟前`;
  if (hours < 24) return `${hours}小时前`;
  if (days < 7) return `${days}天前`;
  
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

export const formatDateTime = (dateStr: string): string => {
  const date = new Date(dateStr);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
};

export const getStatusText = (status: string): string => {
  const statusMap: Record<string, string> = {
    online: '在线',
    offline: '离线',
    blocked: '遮挡',
    disconnected: '断流',
    pending: '待处理',
    processing: '处理中',
    resolved: '已解决',
    transferred: '已转交',
    completed: '已完成'
  };
  return statusMap[status] || status;
};

export const getStatusColor = (status: string): string => {
  const colorMap: Record<string, string> = {
    online: '#00B42A',
    offline: '#F53F3F',
    blocked: '#FF7D00',
    disconnected: '#F53F3F',
    pending: '#F53F3F',
    processing: '#FF7D00',
    resolved: '#00B42A',
    transferred: '#1E5AA8',
    completed: '#00B42A'
  };
  return colorMap[status] || '#86909C';
};

export const getAlarmLevelText = (level: string): string => {
  const levelMap: Record<string, string> = {
    high: '高',
    medium: '中',
    low: '低'
  };
  return levelMap[level] || level;
};

export const getAlarmLevelColor = (level: string): string => {
  const colorMap: Record<string, string> = {
    high: '#F53F3F',
    medium: '#FF7D00',
    low: '#1E5AA8'
  };
  return colorMap[level] || '#86909C';
};

export const getCameraTypeText = (type: string): string => {
  const typeMap: Record<string, string> = {
    entrance: '出入口',
    hallway: '走廊',
    room: '机房',
    parking: '停车场',
    elevator: '电梯'
  };
  return typeMap[type] || type;
};
