import { Building, Camera } from '@/types';

export const mockCameras: Camera[] = [
  {
    id: 'cam001',
    name: 'A栋大门',
    code: 'CAM-A-001',
    location: 'A栋1楼正门',
    buildingId: 'b001',
    buildingName: 'A栋办公楼',
    floor: '1楼',
    type: 'entrance',
    status: 'online',
    isFavorite: true,
    lastOnlineTime: '2026-06-17 09:30:00',
    snapshotUrl: 'https://picsum.photos/id/1/400/300'
  },
  {
    id: 'cam002',
    name: 'A栋电梯间',
    code: 'CAM-A-002',
    location: 'A栋1楼电梯厅',
    buildingId: 'b001',
    buildingName: 'A栋办公楼',
    floor: '1楼',
    type: 'elevator',
    status: 'online',
    isFavorite: true,
    lastOnlineTime: '2026-06-17 09:30:00',
    snapshotUrl: 'https://picsum.photos/id/2/400/300'
  },
  {
    id: 'cam003',
    name: 'A栋3楼走廊',
    code: 'CAM-A-003',
    location: 'A栋3楼西侧走廊',
    buildingId: 'b001',
    buildingName: 'A栋办公楼',
    floor: '3楼',
    type: 'hallway',
    status: 'online',
    isFavorite: false,
    lastOnlineTime: '2026-06-17 09:28:00',
    snapshotUrl: 'https://picsum.photos/id/3/400/300'
  },
  {
    id: 'cam004',
    name: 'A栋机房',
    code: 'CAM-A-004',
    location: 'A栋5楼机房',
    buildingId: 'b001',
    buildingName: 'A栋办公楼',
    floor: '5楼',
    type: 'room',
    status: 'blocked',
    isFavorite: true,
    lastOnlineTime: '2026-06-17 08:15:00',
    snapshotUrl: 'https://picsum.photos/id/6/400/300'
  },
  {
    id: 'cam005',
    name: 'A栋地下车库',
    code: 'CAM-A-005',
    location: 'A栋B1层车库入口',
    buildingId: 'b001',
    buildingName: 'A栋办公楼',
    floor: 'B1层',
    type: 'parking',
    status: 'online',
    isFavorite: false,
    lastOnlineTime: '2026-06-17 09:30:00',
    snapshotUrl: 'https://picsum.photos/id/8/400/300'
  },
  {
    id: 'cam006',
    name: 'B栋北门',
    code: 'CAM-B-001',
    location: 'B栋1楼北门',
    buildingId: 'b002',
    buildingName: 'B栋研发楼',
    floor: '1楼',
    type: 'entrance',
    status: 'disconnected',
    isFavorite: false,
    lastOnlineTime: '2026-06-17 06:45:00',
    snapshotUrl: 'https://picsum.photos/id/9/400/300'
  },
  {
    id: 'cam007',
    name: 'B栋2楼走廊',
    code: 'CAM-B-002',
    location: 'B栋2楼东侧走廊',
    buildingId: 'b002',
    buildingName: 'B栋研发楼',
    floor: '2楼',
    type: 'hallway',
    status: 'online',
    isFavorite: false,
    lastOnlineTime: '2026-06-17 09:30:00',
    snapshotUrl: 'https://picsum.photos/id/119/400/300'
  },
  {
    id: 'cam008',
    name: 'B栋机房',
    code: 'CAM-B-003',
    location: 'B栋4楼机房',
    buildingId: 'b002',
    buildingName: 'B栋研发楼',
    floor: '4楼',
    type: 'room',
    status: 'online',
    isFavorite: true,
    lastOnlineTime: '2026-06-17 09:30:00',
    snapshotUrl: 'https://picsum.photos/id/160/400/300'
  },
  {
    id: 'cam009',
    name: 'C栋大门',
    code: 'CAM-C-001',
    location: 'C栋1楼正门',
    buildingId: 'b003',
    buildingName: 'C栋宿舍楼',
    floor: '1楼',
    type: 'entrance',
    status: 'online',
    isFavorite: false,
    lastOnlineTime: '2026-06-17 09:30:00',
    snapshotUrl: 'https://picsum.photos/id/201/400/300'
  },
  {
    id: 'cam010',
    name: 'C栋监控室',
    code: 'CAM-C-002',
    location: 'C栋1楼监控室',
    buildingId: 'b003',
    buildingName: 'C栋宿舍楼',
    floor: '1楼',
    type: 'room',
    status: 'offline',
    isFavorite: false,
    lastOnlineTime: '2026-06-16 22:30:00',
    snapshotUrl: 'https://picsum.photos/id/201/400/300'
  }
];

export const mockBuildings: Building[] = [
  {
    id: 'b001',
    name: 'A栋办公楼',
    address: '园区1号',
    totalCameras: 5,
    onlineCameras: 4,
    offlineCameras: 1,
    floors: [
      {
        id: 'f001',
        name: '1楼',
        totalCameras: 2,
        onlineCameras: 2,
        cameras: mockCameras.filter(c => c.buildingId === 'b001' && c.floor === '1楼')
      },
      {
        id: 'f002',
        name: '3楼',
        totalCameras: 1,
        onlineCameras: 1,
        cameras: mockCameras.filter(c => c.buildingId === 'b001' && c.floor === '3楼')
      },
      {
        id: 'f003',
        name: '5楼',
        totalCameras: 1,
        onlineCameras: 0,
        cameras: mockCameras.filter(c => c.buildingId === 'b001' && c.floor === '5楼')
      },
      {
        id: 'f004',
        name: 'B1层',
        totalCameras: 1,
        onlineCameras: 1,
        cameras: mockCameras.filter(c => c.buildingId === 'b001' && c.floor === 'B1层')
      }
    ]
  },
  {
    id: 'b002',
    name: 'B栋研发楼',
    address: '园区2号',
    totalCameras: 3,
    onlineCameras: 2,
    offlineCameras: 1,
    floors: [
      {
        id: 'f005',
        name: '1楼',
        totalCameras: 1,
        onlineCameras: 0,
        cameras: mockCameras.filter(c => c.buildingId === 'b002' && c.floor === '1楼')
      },
      {
        id: 'f006',
        name: '2楼',
        totalCameras: 1,
        onlineCameras: 1,
        cameras: mockCameras.filter(c => c.buildingId === 'b002' && c.floor === '2楼')
      },
      {
        id: 'f007',
        name: '4楼',
        totalCameras: 1,
        onlineCameras: 1,
        cameras: mockCameras.filter(c => c.buildingId === 'b002' && c.floor === '4楼')
      }
    ]
  },
  {
    id: 'b003',
    name: 'C栋宿舍楼',
    address: '园区3号',
    totalCameras: 2,
    onlineCameras: 1,
    offlineCameras: 1,
    floors: [
      {
        id: 'f008',
        name: '1楼',
        totalCameras: 2,
        onlineCameras: 1,
        cameras: mockCameras.filter(c => c.buildingId === 'b003' && c.floor === '1楼')
      }
    ]
  }
];

export const getFavoriteCameras = (): Camera[] => {
  return mockCameras.filter(c => c.isFavorite);
};

export const getCamerasByBuilding = (buildingId: string): Camera[] => {
  return mockCameras.filter(c => c.buildingId === buildingId);
};

export const getCameraById = (id: string): Camera | undefined => {
  return mockCameras.find(c => c.id === id);
};
