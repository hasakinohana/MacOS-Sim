import React, { useState, useEffect } from 'react';
import { MenuBar } from './components/MenuBar';
import { Dock } from './components/Dock';
import { Window } from './components/Window';
import { DesktopIcons } from './components/DesktopIcons';
import { useWindowManager } from './hooks/useWindowManager';
import { useFileSystem } from './hooks/useFileSystem';
import { WALLPAPER_URL } from './constants';
import { AppID } from './types';
import { FinderApp } from './components/apps/Finder';
import { TerminalApp } from './components/apps/Terminal';
import { CalculatorApp } from './components/apps/Calculator';
import { GeminiAssistant } from './components/apps/GeminiAssistant';
import { NotesApp } from './components/apps/Notes';
import { PhotosApp } from './components/apps/Photos';
import { SettingsApp } from './components/apps/Settings';

const App: React.FC = () => {
  const { 
    windows, 
    activeWindowId,
    setActiveWindowId,
    openApp, 
    closeWindow, 
    minimizeWindow, 
    maximizeWindow,
    focusWindow, 
    updateWindowPosition 
  } = useWindowManager();

  const fileSystem = useFileSystem();
  const [currentWallpaper, setCurrentWallpaper] = useState(WALLPAPER_URL);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Apply dark mode to HTML element for Tailwind
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Determine active app title for Menu Bar
  const activeWindow = windows.find(w => w.id === activeWindowId);
  const activeAppTitle = activeWindow ? activeWindow.title : 'Finder';

  const getAppContent = (appId: AppID) => {
    switch (appId) {
      case AppID.FINDER: return <FinderApp fs={fileSystem} />;
      case AppID.TERMINAL: return <TerminalApp fs={fileSystem} />;
      case AppID.CALCULATOR: return <CalculatorApp />;
      case AppID.GEMINI: return <GeminiAssistant />;
      case AppID.NOTES: return <NotesApp />;
      case AppID.PHOTOS: return <PhotosApp />;
      case AppID.SETTINGS: return (
        <SettingsApp 
          currentWallpaper={currentWallpaper} 
          onWallpaperChange={setCurrentWallpaper} 
          isDarkMode={isDarkMode}
          setDarkMode={setIsDarkMode}
        />
      );
      default: return (
        <div className="flex items-center justify-center h-full bg-white text-gray-400">
           Work in progress...
        </div>
      );
    }
  };

  // Extract list of unique open app IDs for the Dock indicators
  const openAppIds = Array.from(new Set(windows.map(w => w.appId)));

  return (
    <div 
      className="relative w-screen h-screen overflow-hidden bg-cover bg-center transition-all duration-700 ease-in-out"
      style={{ backgroundImage: `url(${currentWallpaper})` }}
      onClick={() => setActiveWindowId(null)} 
    >
      <div className="absolute inset-0 bg-black/10 pointer-events-none" />

      <MenuBar activeApp={activeAppTitle} />

      <DesktopIcons fs={fileSystem} onOpenApp={openApp} />

      {/* Desktop Area - Windows container */}
      <div className="absolute inset-0 top-8 bottom-20 z-0 overflow-hidden pointer-events-none">
        {windows.map(windowState => (
          <div key={windowState.id} className="pointer-events-auto">
             <Window
               windowState={windowState}
               onClose={closeWindow}
               onMinimize={minimizeWindow}
               onMaximize={maximizeWindow}
               onFocus={focusWindow}
               onMove={updateWindowPosition}
             >
               {getAppContent(windowState.appId)}
             </Window>
          </div>
        ))}
      </div>

      <Dock openApps={openAppIds} onAppClick={openApp} />
    </div>
  );
};

export default App;