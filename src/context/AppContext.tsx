import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { UserInfo, Alarm, Task, Camera, Building, HandoverRecord } from '@/types';
import { mockUserInfo, mockHandoverRecords } from '@/data/task';
import { mockAlarms } from '@/data/alarm';
import { mockTasks } from '@/data/task';
import { mockCameras, mockBuildings } from '@/data/building';

interface AppContextType {
  user: UserInfo;
  alarms: Alarm[];
  pendingAlarms: Alarm[];
  tasks: Task[];
  pendingTasks: Task[];
  cameras: Camera[];
  buildings: Building[];
  handoverRecords: HandoverRecord[];
  refreshData: () => void;
  toggleFavorite: (cameraId: string) => void;
  updateAlarmStatus: (alarmId: string, status: Alarm['status'], note?: string) => void;
  updateTaskStatus: (taskId: string, status: Task['status']) => void;
  addTaskImage: (taskId: string, imageUrl: string) => void;
  removeTaskImage: (taskId: string, index: number) => void;
  addCamera: (camera: Camera) => void;
  addHandoverRecord: (record: HandoverRecord) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user] = useState<UserInfo>(mockUserInfo);
  const [alarms, setAlarms] = useState<Alarm[]>(mockAlarms);
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [cameras, setCameras] = useState<Camera[]>(mockCameras);
  const [buildings, setBuildings] = useState<Building[]>(mockBuildings);
  const [handoverRecords, setHandoverRecords] = useState<HandoverRecord[]>(mockHandoverRecords);

  const pendingAlarms = useMemo(() => {
    return alarms.filter(a => a.status === 'pending' || a.status === 'processing');
  }, [alarms]);

  const pendingTasks = useMemo(() => {
    return tasks.filter(t => t.status === 'pending' || t.status === 'processing');
  }, [tasks]);

  const refreshData = () => {
    console.log('[AppContext] Refreshing data...');
    setAlarms([...mockAlarms]);
    setTasks([...mockTasks]);
    setCameras([...mockCameras]);
    setBuildings([...mockBuildings]);
  };

  const toggleFavorite = (cameraId: string) => {
    console.log('[AppContext] Toggling favorite for camera:', cameraId);
    setCameras(prev => prev.map(cam =>
      cam.id === cameraId ? { ...cam, isFavorite: !cam.isFavorite } : cam
    ));
  };

  const updateAlarmStatus = (alarmId: string, status: Alarm['status'], note?: string) => {
    console.log('[AppContext] Updating alarm status:', alarmId, status);
    setAlarms(prev => prev.map(alarm =>
      alarm.id === alarmId
        ? {
          ...alarm,
          status,
          handler: user.name,
          handleTime: new Date().toISOString(),
          handleNote: note || alarm.handleNote
        }
        : alarm
    ));
  };

  const updateTaskStatus = (taskId: string, status: Task['status']) => {
    console.log('[AppContext] Updating task status:', taskId, status);
    setTasks(prev => prev.map(task =>
      task.id === taskId
        ? { ...task, status, handler: user.name }
        : task
    ));
  };

  const addTaskImage = (taskId: string, imageUrl: string) => {
    console.log('[AppContext] Adding image to task:', taskId);
    setTasks(prev => prev.map(task =>
      task.id === taskId
        ? { ...task, images: [...task.images, imageUrl] }
        : task
    ));
  };

  const removeTaskImage = (taskId: string, index: number) => {
    console.log('[AppContext] Removing image from task:', taskId, 'at index:', index);
    setTasks(prev => prev.map(task =>
      task.id === taskId
        ? { ...task, images: task.images.filter((_, i) => i !== index) }
        : task
    ));
  };

  const addCamera = (camera: Camera) => {
    console.log('[AppContext] Adding camera:', camera.id, camera.name);
    setCameras(prev => [...prev, camera]);
    setBuildings(prev => prev.map(building => {
      if (building.id === camera.buildingId) {
        const floorExists = building.floors.some(f => f.name === camera.floor);
        const updatedFloors = floorExists
          ? building.floors.map(floor => {
            if (floor.name === camera.floor) {
              return {
                ...floor,
                totalCameras: floor.totalCameras + 1,
                onlineCameras: camera.status === 'online' ? floor.onlineCameras + 1 : floor.onlineCameras,
                cameras: [...floor.cameras, camera]
              };
            }
            return floor;
          })
          : [
            ...building.floors,
            {
              id: `f_${Date.now()}`,
              name: camera.floor,
              totalCameras: 1,
              onlineCameras: camera.status === 'online' ? 1 : 0,
              cameras: [camera]
            }
          ];
        return {
          ...building,
          totalCameras: building.totalCameras + 1,
          onlineCameras: camera.status === 'online' ? building.onlineCameras + 1 : building.onlineCameras,
          offlineCameras: camera.status !== 'online' ? building.offlineCameras + 1 : building.offlineCameras,
          floors: updatedFloors
        };
      }
      return building;
    }));
  };

  const addHandoverRecord = (record: HandoverRecord) => {
    console.log('[AppContext] Adding handover record:', record.id);
    setHandoverRecords(prev => [record, ...prev]);
  };

  useEffect(() => {
    console.log('[AppContext] Context initialized with user:', user.name);
  }, []);

  return (
    <AppContext.Provider value={{
      user,
      alarms,
      pendingAlarms,
      tasks,
      pendingTasks,
      cameras,
      buildings,
      handoverRecords,
      refreshData,
      toggleFavorite,
      updateAlarmStatus,
      updateTaskStatus,
      addTaskImage,
      removeTaskImage,
      addCamera,
      addHandoverRecord
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
