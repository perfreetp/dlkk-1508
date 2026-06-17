export interface Camera {
  id: string;
  name: string;
  code: string;
  location: string;
  buildingId: string;
  buildingName: string;
  floor: string;
  type: 'entrance' | 'hallway' | 'room' | 'parking' | 'elevator';
  status: 'online' | 'offline' | 'blocked' | 'disconnected';
  isFavorite: boolean;
  lastOnlineTime: string;
  snapshotUrl: string;
}

export interface Building {
  id: string;
  name: string;
  address: string;
  totalCameras: number;
  onlineCameras: number;
  offlineCameras: number;
  floors: Floor[];
}

export interface Floor {
  id: string;
  name: string;
  totalCameras: number;
  onlineCameras: number;
  cameras: Camera[];
}

export interface Alarm {
  id: string;
  type: 'disconnected' | 'blocked' | 'motion' | 'other';
  typeName: string;
  level: 'high' | 'medium' | 'low';
  cameraId: string;
  cameraName: string;
  location: string;
  buildingName: string;
  happenTime: string;
  status: 'pending' | 'processing' | 'resolved' | 'transferred';
  description: string;
  snapshotUrl: string;
  handler?: string;
  handleTime?: string;
  handleNote?: string;
}

export interface Task {
  id: string;
  title: string;
  type: 'patrol' | 'alarm' | 'repair' | 'other';
  typeName: string;
  status: 'pending' | 'processing' | 'completed';
  priority: 'high' | 'medium' | 'low';
  location: string;
  buildingName: string;
  createTime: string;
  deadline?: string;
  description: string;
  images: string[];
  handler?: string;
  shift: 'morning' | 'afternoon' | 'night';
  shiftName: string;
}

export interface HandoverRecord {
  id: string;
  shift: string;
  shiftName: string;
  date: string;
  startTime: string;
  endTime: string;
  operator: string;
  receiver: string;
  notes: string;
  unresolvedTasks: number;
  alarms: number;
  images: string[];
}

export interface UserInfo {
  id: string;
  name: string;
  role: string;
  phone: string;
  avatar: string;
  building: string;
  shift: string;
  shiftName: string;
}

export interface StatCardData {
  title: string;
  value: number | string;
  unit?: string;
  trend?: 'up' | 'down' | 'none';
  trendValue?: string;
  color: string;
}

export interface QuickAction {
  id: string;
  name: string;
  icon: string;
  color: string;
  path: string;
}
