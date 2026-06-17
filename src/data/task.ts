import { Task, HandoverRecord, UserInfo } from '@/types';

export const mockTasks: Task[] = [
  {
    id: 'task001',
    title: '处理A栋机房摄像头遮挡问题',
    type: 'alarm',
    typeName: '告警处置',
    status: 'pending',
    priority: 'high',
    location: 'A栋5楼机房',
    buildingName: 'A栋办公楼',
    createTime: '2026-06-17 09:15:00',
    deadline: '2026-06-17 10:00:00',
    description: 'A栋机房摄像头检测到画面遮挡，请前往现场检查并处理。',
    images: [],
    shift: 'morning',
    shiftName: '早班'
  },
  {
    id: 'task002',
    title: '修复B栋北门视频断流',
    type: 'repair',
    typeName: '设备维修',
    status: 'processing',
    priority: 'high',
    location: 'B栋1楼北门',
    buildingName: 'B栋研发楼',
    createTime: '2026-06-17 07:00:00',
    deadline: '2026-06-17 12:00:00',
    description: 'B栋北门摄像头视频信号中断，已联系技术部处理，需跟进进度。',
    images: ['https://picsum.photos/id/9/400/300'],
    handler: '张伟',
    shift: 'morning',
    shiftName: '早班'
  },
  {
    id: 'task003',
    title: '园区早班巡场',
    type: 'patrol',
    typeName: '日常巡场',
    status: 'processing',
    priority: 'medium',
    location: '园区各楼栋',
    buildingName: '全园区',
    createTime: '2026-06-17 08:00:00',
    deadline: '2026-06-17 10:00:00',
    description: '按照巡场路线检查各楼栋出入口、消防通道、机房等重点区域。',
    images: ['https://picsum.photos/id/1/400/300', 'https://picsum.photos/id/2/400/300'],
    handler: '张伟',
    shift: 'morning',
    shiftName: '早班'
  },
  {
    id: 'task004',
    title: '协助处理C栋人员纠纷',
    type: 'other',
    typeName: '其他任务',
    status: 'completed',
    priority: 'medium',
    location: 'C栋1楼大厅',
    buildingName: 'C栋宿舍楼',
    createTime: '2026-06-16 14:30:00',
    description: 'C栋有员工因琐事发生争执，需前往现场协调处理。',
    images: ['https://picsum.photos/id/64/400/300'],
    handler: '李明',
    shift: 'afternoon',
    shiftName: '中班'
  },
  {
    id: 'task005',
    title: '夜间园区安全巡查',
    type: 'patrol',
    typeName: '日常巡场',
    status: 'completed',
    priority: 'high',
    location: '园区各楼栋',
    buildingName: '全园区',
    createTime: '2026-06-16 22:00:00',
    deadline: '2026-06-17 06:00:00',
    description: '夜间巡查各楼栋门窗、水电、消防设施，确保园区安全。',
    images: ['https://picsum.photos/id/91/400/300', 'https://picsum.photos/id/177/400/300'],
    handler: '王强',
    shift: 'night',
    shiftName: '夜班'
  },
  {
    id: 'task006',
    title: '检查C栋监控室离线问题',
    type: 'alarm',
    typeName: '告警处置',
    status: 'completed',
    priority: 'medium',
    location: 'C栋1楼监控室',
    buildingName: 'C栋宿舍楼',
    createTime: '2026-06-16 22:30:00',
    description: 'C栋监控室摄像头离线，已转交技术部处理。',
    images: ['https://picsum.photos/id/201/400/300'],
    handler: '王强',
    shift: 'night',
    shiftName: '夜班'
  }
];

export const mockHandoverRecords: HandoverRecord[] = [
  {
    id: 'handover001',
    shift: 'morning',
    shiftName: '早班',
    date: '2026-06-17',
    startTime: '08:00',
    endTime: '16:00',
    operator: '张伟',
    receiver: '李明',
    notes: '1. A栋机房摄像头遮挡待处理\n2. B栋北门视频断流跟进中\n3. 今日无其他异常情况',
    unresolvedTasks: 2,
    alarms: 1,
    images: []
  },
  {
    id: 'handover002',
    shift: 'night',
    shiftName: '夜班',
    date: '2026-06-16',
    startTime: '22:00',
    endTime: '08:00',
    operator: '王强',
    receiver: '张伟',
    notes: '1. C栋监控室摄像头离线，已转交技术部\n2. 夜间巡查正常\n3. 注意A栋5楼机房设备运行情况',
    unresolvedTasks: 1,
    alarms: 1,
    images: ['https://picsum.photos/id/91/400/300']
  }
];

export const mockUserInfo: UserInfo = {
  id: 'user001',
  name: '张伟',
  role: '安保班长',
  phone: '138****8888',
  avatar: 'https://picsum.photos/id/64/200/200',
  building: 'A栋办公楼',
  shift: 'morning',
  shiftName: '早班（08:00-16:00）'
};

export const getTasksByShift = (shift: string): Task[] => {
  return mockTasks.filter(t => t.shift === shift);
};

export const getPendingTasks = (): Task[] => {
  return mockTasks.filter(t => t.status === 'pending' || t.status === 'processing');
};

export const getCompletedTasks = (): Task[] => {
  return mockTasks.filter(t => t.status === 'completed');
};

export const getTaskById = (id: string): Task | undefined => {
  return mockTasks.find(t => t.id === id);
};
