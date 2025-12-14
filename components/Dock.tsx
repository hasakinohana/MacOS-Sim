import React from 'react';
import { AppID } from '../types';
import { APPS } from '../constants';
import { FileSystemContextType } from '../hooks/useFileSystem';
import { Trash2, Download, Folder } from 'lucide-react';

interface DockProps {
  openApps: AppID[];
  onAppClick: (appId: AppID) => void;
  onOpenFolder: (path: string) => void;
  onCloseApp: (appId: AppID) => void;
  fs: FileSystemContextType;
  onContextMenu: (x: number, y: number, options: any[]) => void;
}

export const Dock: React.FC<DockProps> = ({ 
  openApps, 
  onAppClick, 
  onOpenFolder,
  onCloseApp,
  fs,
  onContextMenu 
}) => {
  
  const handleAppContextMenu = (e: React.MouseEvent, appId: AppID) => {
    e.preventDefault();
    const isOpen = openApps.includes(appId);
    
    const options = [
      { label: 'Open', action: () => onAppClick(appId) },
    ];

    if (isOpen) {
      options.push({ separator: true } as any);
      options.push({ label: 'Quit', action: () => onCloseApp(appId) });
    }

    onContextMenu(e.clientX, e.clientY, options);
  };

  const handleFolderContextMenu = (e: React.MouseEvent, folder: 'Trash' | 'Downloads') => {
    e.preventDefault();
    const options = [
      { label: 'Open', action: () => onOpenFolder(folder) },
    ];

    if (folder === 'Trash') {
      options.push({ separator: true } as any);
      options.push({ label: 'Empty Trash', action: () => fs.emptyTrash() });
    }

    onContextMenu(e.clientX, e.clientY, options);
  };

  return (
    <div className="fixed bottom-2 left-1/2 transform -translate-x-1/2 z-50">
      <div className="glass-dark bg-opacity-20 dark:bg-opacity-40 flex items-end space-x-1 px-3 py-2 rounded-2xl mx-auto h-[68px] border border-white/20 shadow-2xl backdrop-blur-xl">
        {/* Apps Section */}
        {Object.values(APPS).map((app) => {
          const isOpen = openApps.includes(app.id);
          const Icon = app.icon;

          return (
            <div 
              key={app.id} 
              className="group relative flex flex-col items-center justify-end cursor-pointer transition-all duration-300 hover:-translate-y-2 px-1.5"
              onClick={() => onAppClick(app.id)}
              onContextMenu={(e) => handleAppContextMenu(e, app.id)}
            >
              {/* Tooltip */}
              <div className="absolute -top-14 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gray-100/90 dark:bg-gray-800/90 backdrop-blur text-gray-800 dark:text-gray-100 text-xs py-1 px-3 rounded-md shadow-lg border border-gray-200/20 pointer-events-none whitespace-nowrap mb-2">
                {app.title}
                <div className="absolute bottom-[-4px] left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-100/90 dark:bg-gray-800/90 rotate-45 border-r border-b border-gray-200/20"></div>
              </div>

              {/* Icon Container */}
              <div className={`w-12 h-12 rounded-xl shadow-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110 active:scale-95 active:brightness-75 ${app.color}`}>
                 <Icon className="text-white w-7 h-7 drop-shadow-md" />
              </div>

              {/* Dot indicator for open apps */}
              <div className={`w-1 h-1 rounded-full bg-gray-800 dark:bg-gray-200 mt-1.5 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}></div>
            </div>
          );
        })}

        {/* Separator */}
        <div className="h-10 w-px bg-white/20 mx-1 mb-3"></div>

        {/* Folders Section */}
        
        {/* Downloads */}
        <div 
           className="group relative flex flex-col items-center justify-end cursor-pointer transition-all duration-300 hover:-translate-y-2 px-1.5"
           onClick={() => onOpenFolder('Downloads')}
           onContextMenu={(e) => handleFolderContextMenu(e, 'Downloads')}
        >
             <div className="absolute -top-14 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gray-100/90 dark:bg-gray-800/90 backdrop-blur text-gray-800 dark:text-gray-100 text-xs py-1 px-3 rounded-md shadow-lg border border-gray-200/20 pointer-events-none whitespace-nowrap mb-2">
                Downloads
                <div className="absolute bottom-[-4px] left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-100/90 dark:bg-gray-800/90 rotate-45 border-r border-b border-gray-200/20"></div>
             </div>
             <div className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 active:scale-95">
                <div className="w-11 h-11 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white/20 shadow-lg bg-gradient-to-b from-blue-400 to-blue-600">
                    <Download className="text-white w-6 h-6 drop-shadow-md" />
                </div>
             </div>
             <div className="w-1 h-1 mt-1.5 opacity-0"></div>
        </div>

        {/* Trash */}
        <div 
           className="group relative flex flex-col items-center justify-end cursor-pointer transition-all duration-300 hover:-translate-y-2 px-1.5"
           onClick={() => onOpenFolder('Trash')}
           onContextMenu={(e) => handleFolderContextMenu(e, 'Trash')}
        >
             <div className="absolute -top-14 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gray-100/90 dark:bg-gray-800/90 backdrop-blur text-gray-800 dark:text-gray-100 text-xs py-1 px-3 rounded-md shadow-lg border border-gray-200/20 pointer-events-none whitespace-nowrap mb-2">
                Trash
                <div className="absolute bottom-[-4px] left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-100/90 dark:bg-gray-800/90 rotate-45 border-r border-b border-gray-200/20"></div>
             </div>
             <div className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 active:scale-95">
                 <div className="w-11 h-11 bg-gray-200 rounded-full flex items-center justify-center border-2 border-white/20 shadow-lg bg-gradient-to-b from-gray-100 to-gray-300">
                    <Trash2 className="text-gray-600 w-6 h-6 drop-shadow-sm" />
                 </div>
             </div>
             <div className="w-1 h-1 mt-1.5 opacity-0"></div>
        </div>

      </div>
    </div>
  );
};