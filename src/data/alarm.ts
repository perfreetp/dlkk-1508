import { Alarm } from '@/types';

export const mockAlarms: Alarm[] = [
  {
    id: 'alarm001',
    type: 'blocked',
    typeName: '画面遮挡',
    level: 'high',
    cameraId: 'cam004',
    cameraName: 'A栋机房',
    location: 'A栋5楼机房',
    buildingName: 'A栋办公楼',
    happenTime: '2026-06-17 09:15:00',
    status: 'pending',
    description: '检测到画面被遮挡，可能有人为遮挡或设备故障',
    snapshotUrl: 'https://picsum.photos/id/6/400/300'
  },
  {
    id: 'alarm002',
    type: 'disconnected',
    typeName: '视频断流',
    level: 'high',
    cameraId: 'cam006',
    cameraName: 'B栋北门',
    location: 'B栋1楼北门',
    buildingName: 'B栋研发楼',
    happenTime: '2026-06-17 06:45:00',
    status: 'processing',
    description: '视频信号中断，已持续2小时45分钟',
    snapshotUrl: 'https://picsum.photos/id/9/400/300',
    handler: '张伟',
    handleTime: '2026-06-17 07:00:00'
  },
  {
    id: 'alarm003',
    type: 'disconnected',
    typeName: '视频断流',
    level: 'medium',
    cameraId: 'cam010',
    cameraName: 'C栋监控室',
    location: 'C栋1楼监控室',
    buildingName: 'C栋宿舍楼',
    happenTime: '2026-06-16 22:30:00',
    status: 'transferred',
    description: '视频信号中断，已转交技术部处理',
    snapshotUrl: 'https://picsum.photos/id/201/400/300',
    handler: '李明',
    handleTime: '2026-06-16 22:45:00',
    handleNote: '已转交技术部王工处理，预计明天上午修复'
  },
  {
    id: 'alarm004',
    type: 'motion',
    typeName: '移动侦测',
    level: 'medium',
    cameraId: 'cam001',
    cameraName: 'A栋大门',
    location: 'A栋1楼正门',
    buildingName: 'A栋办公楼',
    happenTime: '2026-06-17 08:30:00',
    status: 'resolved',
    description: '检测到异常人员移动，已核实为送货人员',
    snapshotUrl: 'https://picsum.photos/id/1/400/300',
    handler: '张伟',
    handleTime: '2026-06-17 08:35:00',
    handleNote: '已核实为送货人员，正常放行'
  },
  {
    id: 'alarm005',
    type: 'other',
    typeName: '设备异常',
    level: 'low',
    cameraId: 'cam003',
    cameraName: 'A栋3楼走廊',
    location: 'A栋3楼西侧走廊',
    buildingName: 'A栋办公楼',
    happenTime: '2026-06-17 07:00:00',
    status: 'resolved',
    description: '设备运行参数异常，已自动恢复',
    snapshotUrl: 'https://picsum.photos/id/3/400/300',
    handler: '张伟',
    handleTime: '2026-06-17 07:10:00',
    handleNote: '设备自动恢复正常，持续观察中'
  },
  {
    id: 'alarm006',
    type: 'blocked',
    typeName: '画面遮挡',
    level: 'high',
    cameraId: 'cam007',
    cameraName: 'B栋2楼走廊',
    location: 'B栋2楼东侧走廊',
    buildingName: 'B栋研发楼',
    happenTime: '2026-06-17 05:30:00',
    status: 'resolved',
    description: '检测到画面被遮挡，已恢复',
    snapshotUrl: 'https://picsum.photos/id/119/400/300',
    handler: '李明',
    handleTime: '2026-06-17 05:45:00',
    handleNote: '保洁人员清洁时不小心遮挡，已恢复正常'
  }
];

export const getPendingAlarms = (): Alarm[] => {
  return mockAlarms.filter(a => a.status === 'pending' || a.status === 'processing');
};

export const getAlarmById = (id: string): Alarm | undefined => {
  return mockAlarms.find(a => a.id === id);
};

export const getAlarmsByStatus = (status: string): Alarm[] => {
  return mockAlarms.filter(a => a.status === status);
};
