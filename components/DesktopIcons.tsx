import React, { useState } from 'react';
import { FileItem, AppID } from '../types';
import { FileSystemContextType } from '../hooks/useFileSystem';
import { File, Folder } from 'lucide-react';

interface DesktopIconsProps {
  fs: FileSystemContextType;
  onOpenApp: (appId: AppID, launchProps?: any) => void;
  onContextMenu?: (x: number, y: number, options: any[]) => void;
}

export const DesktopIcons: React.FC<DesktopIconsProps> = ({ fs, onOpenApp, onContextMenu }) => {
  const desktopFiles = fs.fileSystem['Desktop'] || [];
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);

  const handleDoubleClick = (file: FileItem) => {
    if (file.type === 'folder') {
      onOpenApp(AppID.FINDER, { initialPath: file.name });
    } else {
      // File handling logic
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (['png', 'jpg', 'jpeg'].includes(ext || '')) {
         onOpenApp(AppID.PHOTOS, { initialPhoto: file.content });
      } else if (['txt', 'md', 'json'].includes(ext || '')) {
         onOpenApp(AppID.NOTES, { 
           initialNote: { title: file.name, content: file.content || '' },
           filePath: 'Desktop'
         });
      } else {
         alert(`Cannot open ${file.name}`);
      }
    }
    setSelectedIcon(null);
  };

  const handleContextMenu = (e: React.MouseEvent, file?: FileItem) => {
    if (!onContextMenu) return;
    
    e.preventDefault();
    e.stopPropagation(); // Prevent propagation to background

    if (file) {
      onContextMenu(e.clientX, e.clientY, [
        { label: 'Open', action: () => handleDoubleClick(file) },
        { label: 'Get Info', action: () => alert(`Name: ${file.name}\nSize: ${file.size}`) },
        { separator: true },
        { label: 'Move to Trash', action: () => fs.deleteFile('Desktop', file.name) },
      ]);
    } else {
      // Background click
      onContextMenu(e.clientX, e.clientY, [
        { label: 'New Folder', action: () => fs.createFolder('Desktop', `New Folder ${desktopFiles.length + 1}`) },
        { label: 'Get Info', action: () => alert("Desktop Info") },
        { separator: true },
        { label: 'Change Wallpaper', action: () => onOpenApp(AppID.SETTINGS) },
      ]);
    }
  };

  return (
    <div 
      className="absolute top-8 right-0 bottom-20 w-full pointer-events-auto p-4 flex flex-col items-end flex-wrap content-end gap-4"
      onClick={() => setSelectedIcon(null)}
      onContextMenu={(e) => handleContextMenu(e)}
    >
      {desktopFiles.map((file) => (
        <div
          key={file.name}
          className={`w-20 flex flex-col items-center gap-1 group pointer-events-auto cursor-default`}
          onClick={(e) => {
            e.stopPropagation();
            setSelectedIcon(file.name);
          }}
          onDoubleClick={(e) => {
            e.stopPropagation();
            handleDoubleClick(file);
          }}
          onContextMenu={(e) => handleContextMenu(e, file)}
        >
          <div className={`w-14 h-14 rounded flex items-center justify-center ${
            selectedIcon === file.name 
              ? 'bg-black/20 border border-white/20' 
              : ''
          }`}>
             {file.type === 'folder' ? (
                <Folder size={48} className="text-blue-400 drop-shadow-md fill-blue-400" />
             ) : (
                <div className="relative">
                   <div className="w-10 h-12 bg-white rounded border border-gray-300 shadow-sm flex items-center justify-center">
                     <File size={24} className="text-gray-500" />
                   </div>
                </div>
             )}
          </div>
          <span className={`text-xs text-white font-medium text-center px-1 rounded line-clamp-2 shadow-sm ${
             selectedIcon === file.name ? 'bg-blue-600' : 'bg-none drop-shadow-md'
          }`}>
            {file.name}
          </span>
        </div>
      ))}
    </div>
  );
};