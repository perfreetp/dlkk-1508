import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserInfo, Alarm, Task, Camera, Building } from '@/types';
import { mockUserInfo } from '@/data/task';
import { mockAlarms, getPendingAlarms } from '@/data/alarm';
import { mockTasks, getPendingTasks } from '@/data/task';
import { mockCameras, mockBuildings } from '@/data/building';

interface AppContextType {
  user: UserInfo;
  alarms: Alarm[];
  pendingAlarms: Alarm[];
  tasks: Task[];
  pendingTasks: Task[];
  cameras: Camera[];
  buildings: Building[];
  refreshData: () => void;
  toggleFavorite: (cameraId: string) => void;
  updateAlarmStatus: (alarmId: string, status: Alarm['status'], note?: string) => void;
  updateTaskStatus: (taskId: string, status: Task['status']) => void;
  addTaskImage: (taskId: string, imageUrl: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user] = useState<UserInfo>(mockUserInfo);
  const [alarms, setAlarms] = useState<Alarm[]>(mockAlarms);
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [cameras, setCameras] = useState<Camera[]>(mockCameras);
  const [buildings] = useState<Building[]>(mockBuildings);

  const pendingAlarms = getPendingAlarms();
  const pendingTasks = getPendingTasks();

  const refreshData = () => {
    console.log('[AppContext] Refreshing data...');
    setAlarms([...mockAlarms]);
    setTasks([...mockTasks]);
    setCameras([...mockCameras]);
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
        ? { ...alarm, status, handler: user.name, handleTime: new Date().toISOString(), handleNote: note }
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
      refreshData,
      toggleFavorite,
      updateAlarmStatus,
      updateTaskStatus,
      addTaskImage
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
