import React from 'react';
import { MenuBar } from './components/MenuBar';
import { Dock } from './components/Dock';
import { Window } from './components/Window';
import { useWindowManager } from './hooks/useWindowManager';
import { WALLPAPER_URL } from './constants';
import { AppID } from './types';
import { FinderApp } from './components/apps/Finder';
import { TerminalApp } from './components/apps/Terminal';
import { CalculatorApp } from './components/apps/Calculator';
import { GeminiAssistant } from './components/apps/GeminiAssistant';

const App: React.FC = () => {
  const { 
    windows, 
    activeWindowId,
    openApp, 
    closeWindow, 
    minimizeWindow, 
    maximizeWindow,
    focusWindow, 
    updateWindowPosition 
  } = useWindowManager();

  const getAppContent = (appId: AppID) => {
    switch (appId) {
      case AppID.FINDER: return <FinderApp />;
      case AppID.TERMINAL: return <TerminalApp />;
      case AppID.CALCULATOR: return <CalculatorApp />;
      case AppID.GEMINI: return <GeminiAssistant />;
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
      className="relative w-screen h-screen overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: `url(${WALLPAPER_URL})` }}
    >
      <div className="absolute inset-0 bg-black/10 pointer-events-none" />

      <MenuBar />

      {/* Desktop Area - Windows container */}
      <div className="absolute inset-0 top-8 bottom-20 z-0 overflow-hidden">
        {windows.map(windowState => (
          <Window
            key={windowState.id}
            windowState={windowState}
            onClose={closeWindow}
            onMinimize={minimizeWindow}
            onMaximize={maximizeWindow}
            onFocus={focusWindow}
            onMove={updateWindowPosition}
          >
            {getAppContent(windowState.appId)}
          </Window>
        ))}
      </div>

      <Dock openApps={openAppIds} onAppClick={openApp} />
    </div>
  );
};

export default App;