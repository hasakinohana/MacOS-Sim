import { useState, useCallback } from 'react';
import { AppID, WindowState } from '../types';
import { APPS } from '../constants';

export const useWindowManager = () => {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [nextZIndex, setNextZIndex] = useState(10);

  const focusWindow = useCallback((id: string) => {
    setActiveWindowId(id);
    setWindows(prev => prev.map(w => {
      if (w.id === id) {
        return { ...w, zIndex: nextZIndex, isMinimized: false };
      }
      return w;
    }));
    setNextZIndex(prev => prev + 1);
  }, [nextZIndex]);

  const openApp = useCallback((appId: AppID) => {
    // Check if app is already open and just focus it (single instance mode for simplicity)
    const existingWindow = windows.find(w => w.appId === appId);
    if (existingWindow) {
      focusWindow(existingWindow.id);
      return;
    }

    const appConfig = APPS[appId];
    // Randomize initial position slightly for "stacking" effect if multiple opened
    const offset = windows.length * 20;
    
    const newWindow: WindowState = {
      id: `${appId}-${Date.now()}`,
      appId,
      title: appConfig.title,
      isOpen: true,
      isMinimized: false,
      isMaximized: false,
      position: { 
        x: Math.max(50, (window.innerWidth / 2) - (appConfig.defaultSize.width / 2) + offset),
        y: Math.max(50, (window.innerHeight / 2) - (appConfig.defaultSize.height / 2) + offset)
      },
      size: appConfig.defaultSize,
      zIndex: nextZIndex
    };

    setWindows(prev => [...prev, newWindow]);
    setActiveWindowId(newWindow.id);
    setNextZIndex(prev => prev + 1);
  }, [windows, nextZIndex, focusWindow]);

  const closeWindow = useCallback((id: string) => {
    setWindows(prev => prev.filter(w => w.id !== id));
    if (activeWindowId === id) {
      setActiveWindowId(null);
    }
  }, [activeWindowId]);

  const minimizeWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, isMinimized: true } : w
    ));
    setActiveWindowId(null);
  }, []);

  const maximizeWindow = useCallback((id: string) => {
     setWindows(prev => prev.map(w => {
        if (w.id !== id) return w;
        
        // Toggle maximize
        if (w.isMaximized) {
           return {
              ...w,
              isMaximized: false,
              // Restore to default size/position logic would be needed here for full robustness
              // For now, we just reset to default size of the app to keep it simple or last known
              size: APPS[w.appId].defaultSize, 
              position: { x: 100, y: 100 } // Simply resetting to a safe spot
           }
        } else {
           return {
              ...w,
              isMaximized: true,
              position: { x: 0, y: 32 }, // Below menubar
              size: { width: window.innerWidth, height: window.innerHeight - 32 - 80 } // Minus menubar and dock
           }
        }
     }));
     focusWindow(id);
  }, [focusWindow]);

  const updateWindowPosition = useCallback((id: string, x: number, y: number) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, position: { x, y } } : w
    ));
  }, []);

  return {
    windows,
    activeWindowId,
    setActiveWindowId,
    openApp,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    focusWindow,
    updateWindowPosition
  };
};