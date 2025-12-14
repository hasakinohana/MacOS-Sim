import React, { useState } from 'react';
import { FileItem, AppID } from '../types';
import { FileSystemContextType } from '../hooks/useFileSystem';
import { File, Folder } from 'lucide-react';

interface DesktopIconsProps {
  fs: FileSystemContextType;
  onOpenApp: (appId: AppID) => void;
}

export const DesktopIcons: React.FC<DesktopIconsProps> = ({ fs, onOpenApp }) => {
  const desktopFiles = fs.fileSystem['Desktop'] || [];
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);

  const handleDoubleClick = (file: FileItem) => {
    // For now, if it's a folder, we could open Finder. 
    // Since Finder manages its own internal path state and we don't have deep-linking yet,
    // we just open Finder. In a real app we'd pass the path.
    if (file.type === 'folder') {
      onOpenApp(AppID.FINDER);
    } else {
      // Simulate opening a file
      alert(`Opening ${file.name}...`);
    }
    setSelectedIcon(null);
  };

  return (
    <div 
      className="absolute top-8 right-0 bottom-20 w-full pointer-events-none p-4 flex flex-col items-end flex-wrap content-end gap-4"
      onClick={() => setSelectedIcon(null)}
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