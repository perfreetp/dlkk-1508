import { Camera } from '@/types';
import { mockCameras } from './building';

export interface VideoRecord {
  id: string;
  cameraId: string;
  cameraName: string;
  startTime: string;
  endTime: string;
  duration: number;
  size: string;
  snapshotUrl: string;
}

export const mockVideoRecords: VideoRecord[] = [
  {
    id: 'video001',
    cameraId: 'cam001',
    cameraName: 'A栋大门',
    startTime: '2026-06-17 09:00:00',
    endTime: '2026-06-17 09:30:00',
    duration: 1800,
    size: '256MB',
    snapshotUrl: 'https://picsum.photos/id/1/400/300'
  },
  {
    id: 'video002',
    cameraId: 'cam001',
    cameraName: 'A栋大门',
    startTime: '2026-06-17 08:30:00',
    endTime: '2026-06-17 09:00:00',
    duration: 1800,
    size: '248MB',
    snapshotUrl: 'https://picsum.photos/id/1/400/300'
  },
  {
    id: 'video003',
    cameraId: 'cam002',
    cameraName: 'A栋电梯间',
    startTime: '2026-06-17 09:00:00',
    endTime: '2026-06-17 09:30:00',
    duration: 1800,
    size: '192MB',
    snapshotUrl: 'https://picsum.photos/id/2/400/300'
  },
  {
    id: 'video004',
    cameraId: 'cam004',
    cameraName: 'A栋机房',
    startTime: '2026-06-17 08:00:00',
    endTime: '2026-06-17 08:15:00',
    duration: 900,
    size: '128MB',
    snapshotUrl: 'https://picsum.photos/id/6/400/300'
  },
  {
    id: 'video005',
    cameraId: 'cam008',
    cameraName: 'B栋机房',
    startTime: '2026-06-17 08:00:00',
    endTime: '2026-06-17 09:00:00',
    duration: 3600,
    size: '512MB',
    snapshotUrl: 'https://picsum.photos/id/160/400/300'
  }
];

export const getVideoRecordsByCamera = (cameraId: string): VideoRecord[] => {
  return mockVideoRecords.filter(v => v.cameraId === cameraId);
};

export const getRecentCameras = (): Camera[] => {
  return mockCameras.filter(c => c.status === 'online').slice(0, 5);
};

export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}小时${minutes}分钟`;
  } else if (minutes > 0) {
    return `${minutes}分钟${secs}秒`;
  } else {
    return `${secs}秒`;
  }
};
