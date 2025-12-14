import React, { useState, useEffect } from 'react';
import { FileItem } from '../../types';
import { FileSystemContextType } from '../../hooks/useFileSystem';
import { File, Folder, HardDrive, Clock, Cloud, Download, Monitor, ChevronLeft, ChevronRight, Search, Plus } from 'lucide-react';

interface FinderAppProps {
  fs: FileSystemContextType;
  launchProps?: { initialPath?: string };
  onContextMenu?: (x: number, y: number, options: any[]) => void;
}

export const FinderApp: React.FC<FinderAppProps> = ({ fs, launchProps, onContextMenu }) => {
  const [currentPath, setCurrentPath] = useState<string[]>(['root']);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  // Handle deep linking
  useEffect(() => {
    if (launchProps?.initialPath) {
      // Very basic path resolution for this flat-file-system simulation
      // If path is "Desktop", map to ['root', 'Desktop']
      // If path matches a root key like "Desktop" or "Documents", go there.
      const path = launchProps.initialPath;
      if (path === 'Desktop' || path === 'root' || path === 'Documents' || path === 'Downloads') {
         setCurrentPath(['root', path === 'root' ? 'root' : path]);
      } else {
         // Fallback or handle deep nesting if FS supported it fully
         // For now, assume it's a top level folder name
         setCurrentPath(['root', path]);
      }
    }
  }, [launchProps]);

  const currentFolder = currentPath[currentPath.length - 1];
  const files = fs.fileSystem[currentFolder] || [];
  
  const displayPath = currentFolder === 'root' ? 'Recents' : currentFolder;

  const handleDoubleClick = (file: FileItem) => {
    if (file.type === 'folder') {
      setCurrentPath([...currentPath, file.name]);
      setSelectedFile(null);
    }
  };

  const handleBack = () => {
    if (currentPath.length > 1) {
      setCurrentPath(currentPath.slice(0, -1));
      setSelectedFile(null);
    }
  };

  const handleCreateFolder = () => {
    const name = `New Folder ${files.filter(f => f.type === 'folder').length + 1}`;
    fs.createFolder(currentFolder, name);
  };

  const handleContextMenu = (e: React.MouseEvent, file: FileItem) => {
    if (onContextMenu) {
      e.preventDefault();
      e.stopPropagation();
      onContextMenu(e.clientX, e.clientY, [
        { label: 'Open', action: () => handleDoubleClick(file) },
        { label: 'Get Info', action: () => alert(`Info: ${file.name}\nSize: ${file.size || '--'}`) },
        { separator: true },
        { label: 'Move to Trash', action: () => fs.deleteFile(currentFolder, file.name) },
      ]);
    }
  };

  const handleBackgroundContextMenu = (e: React.MouseEvent) => {
    if (onContextMenu) {
      e.preventDefault();
      e.stopPropagation();
      onContextMenu(e.clientX, e.clientY, [
        { label: 'New Folder', action: handleCreateFolder },
        { label: 'Get Info', action: () => alert(`Folder: ${currentFolder}`) },
      ]);
    }
  };

  const SidebarItem = ({ icon: Icon, label, active = false, onClick }: { icon: any, label: string, active?: boolean, onClick?: () => void }) => (
    <div 
      onClick={onClick}
      className={`flex items-center space-x-2 px-2 py-1.5 rounded-md cursor-default text-sm ${active ? 'bg-gray-300/50' : 'hover:bg-gray-200/50'}`}
    >
      <Icon size={16} className="text-gray-600" />
      <span className="text-gray-800">{label}</span>
    </div>
  );

  return (
    <div className="h-full w-full flex bg-white rounded-b-lg overflow-hidden text-gray-900">
      {/* Sidebar */}
      <div className="w-48 bg-gray-100/90 backdrop-blur border-r border-gray-200 p-3 flex flex-col space-y-4 pt-4">
        <div>
          <h3 className="text-xs font-semibold text-gray-500 mb-1 px-2">Favorites</h3>
          <SidebarItem icon={Clock} label="Recents" active={currentFolder === 'root'} onClick={() => setCurrentPath(['root'])} />
          <SidebarItem icon={Monitor} label="Desktop" active={currentFolder === 'Desktop'} onClick={() => setCurrentPath(['root', 'Desktop'])} />
          <SidebarItem icon={File} label="Documents" active={currentFolder === 'Documents'} onClick={() => setCurrentPath(['root', 'Documents'])} />
          <SidebarItem icon={Download} label="Downloads" active={currentFolder === 'Downloads'} onClick={() => setCurrentPath(['root', 'Downloads'])} />
        </div>
        <div>
          <h3 className="text-xs font-semibold text-gray-500 mb-1 px-2">iCloud</h3>
          <SidebarItem icon={Cloud} label="iCloud Drive" />
        </div>
        <div>
          <h3 className="text-xs font-semibold text-gray-500 mb-1 px-2">Locations</h3>
          <SidebarItem icon={HardDrive} label="Macintosh HD" />
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Toolbar */}
        <div className="h-12 border-b border-gray-200 flex items-center px-4 space-x-4 bg-gray-50/50 justify-between">
          <div className="flex items-center space-x-4">
             <div className="flex space-x-1">
               <button onClick={handleBack} disabled={currentPath.length <= 1} className="p-1 hover:bg-gray-200 rounded disabled:opacity-30 transition-colors">
                  <ChevronLeft size={18} className="text-gray-600" />
               </button>
               <button className="p-1 hover:bg-gray-200 rounded disabled:opacity-30 transition-colors" disabled>
                  <ChevronRight size={18} className="text-gray-600" />
               </button>
             </div>
             <span className="font-semibold text-sm text-gray-700">{displayPath}</span>
          </div>
          
          <div className="flex items-center space-x-3">
             <button onClick={handleCreateFolder} className="p-1 hover:bg-gray-200 rounded text-gray-500" title="New Folder">
               <Plus size={18} />
             </button>
             <div className="relative">
                <Search size={14} className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search" 
                  className="w-32 pl-8 pr-2 py-1 bg-white border border-gray-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none focus:w-48 transition-all"
                />
             </div>
          </div>
        </div>

        {/* File List */}
        <div className="flex-1 p-2 overflow-auto" onClick={() => setSelectedFile(null)} onContextMenu={handleBackgroundContextMenu}>
          <div className="grid grid-cols-1 gap-1">
            <div className="grid grid-cols-12 text-xs font-medium text-gray-500 px-4 py-2 border-b border-gray-100 select-none">
              <div className="col-span-6">Name</div>
              <div className="col-span-2">Date Modified</div>
              <div className="col-span-2">Size</div>
              <div className="col-span-2">Kind</div>
            </div>
            {files.length > 0 ? files.map((file, idx) => (
              <div 
                key={idx}
                onClick={(e) => { e.stopPropagation(); setSelectedFile(file.name); }}
                onDoubleClick={(e) => { e.stopPropagation(); handleDoubleClick(file); }}
                onContextMenu={(e) => handleContextMenu(e, file)}
                className={`grid grid-cols-12 items-center px-4 py-2 text-sm rounded-md cursor-default select-none ${
                  selectedFile === file.name ? 'bg-blue-600 text-white' : 'hover:bg-gray-100 odd:bg-white'
                }`}
              >
                <div className="col-span-6 flex items-center space-x-2 overflow-hidden">
                  {file.type === 'folder' ? (
                    <Folder size={18} className={`shrink-0 ${selectedFile === file.name ? 'text-white' : 'text-blue-400'}`} fill="currentColor" />
                  ) : (
                    <File size={18} className={`shrink-0 ${selectedFile === file.name ? 'text-white' : 'text-gray-400'}`} />
                  )}
                  <span className="truncate">{file.name}</span>
                </div>
                <div className={`col-span-2 text-xs truncate ${selectedFile === file.name ? 'text-blue-100' : 'text-gray-500'}`}>{file.date || '--'}</div>
                <div className={`col-span-2 text-xs ${selectedFile === file.name ? 'text-blue-100' : 'text-gray-500'}`}>{file.size || '--'}</div>
                <div className={`col-span-2 text-xs ${selectedFile === file.name ? 'text-blue-100' : 'text-gray-500'}`}>{file.type === 'folder' ? 'Folder' : 'Document'}</div>
              </div>
            )) : (
               <div className="flex items-center justify-center h-64 text-gray-400 text-sm">Folder is empty</div>
            )}
          </div>
        </div>
        
        {/* Footer */}
        <div className="h-6 border-t border-gray-200 bg-gray-50 flex items-center px-3 text-xs text-gray-500 select-none">
           {files.length} items, 240 GB available
        </div>
      </div>
    </div>
  );
};