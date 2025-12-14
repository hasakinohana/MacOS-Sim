import React, { useState, useEffect, useMemo } from 'react';
import { FileItem, AppID } from '../../types';
import { FileSystemContextType } from '../../hooks/useFileSystem';
import { 
  File, 
  Folder, 
  HardDrive, 
  Clock, 
  Cloud, 
  Download, 
  Monitor, 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  Plus,
  LayoutGrid,
  List as ListIcon,
  ArrowUpDown,
  AppWindow,
  Trash2,
  Wifi,
  Smartphone,
  Laptop
} from 'lucide-react';

interface FinderAppProps {
  fs: FileSystemContextType;
  launchProps?: { initialPath?: string };
  onContextMenu?: (x: number, y: number, options: any[]) => void;
  onOpenApp: (appId: AppID, launchProps?: any) => void;
}

type ViewMode = 'list' | 'grid';
type SortKey = 'name' | 'date' | 'size' | 'type';
type SortDirection = 'asc' | 'desc';

// Extracted component to ensure stability and prevent re-render issues
const SidebarItem = ({ 
  icon: Icon, 
  label, 
  path, 
  active, 
  onClick 
}: { 
  icon: any, 
  label: string, 
  path: string[], 
  active?: boolean, 
  onClick: (path: string[]) => void 
}) => (
  <div 
    onClick={(e) => {
      e.preventDefault();
      e.stopPropagation();
      onClick(path);
    }}
    className={`flex items-center space-x-2 px-2 py-1.5 rounded-md cursor-pointer text-sm transition-colors select-none ${active ? 'bg-gray-300/60 font-medium' : 'hover:bg-gray-200/50 text-gray-700'}`}
  >
    <Icon size={16} className={active ? 'text-blue-600' : 'text-gray-500'} />
    <span>{label}</span>
  </div>
);

export const FinderApp: React.FC<FinderAppProps> = ({ fs, launchProps, onContextMenu, onOpenApp }) => {
  // Navigation History State
  const [history, setHistory] = useState<string[][]>([['root']]);
  const [historyIndex, setHistoryIndex] = useState(0);
  
  // View & Interaction State
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection }>({ 
    key: 'name', 
    direction: 'asc' 
  });

  // Derived State
  const currentPath = history[historyIndex];
  const currentFolder = currentPath[currentPath.length - 1];
  
  // Resolve path for display (e.g., 'root' -> 'Recents')
  const displayPath = currentFolder === 'root' ? 'Recents' : currentFolder;

  // Handle Deep Linking / Launch Props
  useEffect(() => {
    if (launchProps?.initialPath) {
      const path = launchProps.initialPath;
      let newPath: string[];
      
      // Basic resolution strategy
      if (['Desktop', 'Documents', 'Downloads', 'Applications', 'Trash', 'AirDrop', 'iCloud Drive', 'Macintosh HD'].includes(path)) {
         newPath = ['root', path];
      } else if (path === 'root') {
         newPath = ['root'];
      } else {
         newPath = ['root', path];
      }
      
      setHistory([newPath]);
      setHistoryIndex(0);
    }
  }, [launchProps]);

  // --- Navigation Handlers ---

  const navigateTo = (path: string[]) => {
    // If we are already at this folder, do nothing or just reset search
    const pathString = path.join('/');
    const currentPathString = currentPath.join('/');
    
    if (pathString === currentPathString) {
      setSearchQuery('');
      setSelectedFile(null);
      return;
    }

    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(path);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setSearchQuery(''); // Clear search on navigation
    setSelectedFile(null);
  };

  const handleBack = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setSelectedFile(null);
    }
  };

  const handleForward = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setSelectedFile(null);
    }
  };

  const handleDoubleClick = (file: FileItem) => {
    if (file.type === 'folder') {
      navigateTo([...currentPath, file.name]);
    } else if (file.type === 'app') {
       // Map app name to AppID
       const appMap: Record<string, AppID> = {
         'Terminal': AppID.TERMINAL,
         'Notes': AppID.NOTES,
         'Calculator': AppID.CALCULATOR,
         'Gemini Assistant': AppID.GEMINI,
         'Photos': AppID.PHOTOS,
         'Settings': AppID.SETTINGS,
         'Finder': AppID.FINDER
       };
       const appId = appMap[file.name];
       if (appId) {
         onOpenApp(appId);
       } else {
         alert('Cannot open this application.');
       }
    } else {
      // File handling logic
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (['png', 'jpg', 'jpeg'].includes(ext || '')) {
         onOpenApp(AppID.PHOTOS, { initialPhoto: file.content });
      } else if (['txt', 'md', 'json'].includes(ext || '')) {
         onOpenApp(AppID.NOTES, { initialNote: { title: file.name, content: file.content || '' } });
      } else if (file.size === 'Device') {
         alert(`Connecting to ${file.name}...`);
      } else {
         alert(`Cannot open ${file.name}`);
      }
    }
  };

  // --- File Logic (Filter & Sort) ---

  const rawFiles = fs.fileSystem[currentFolder] || [];

  const processedFiles = useMemo(() => {
    let files = [...rawFiles];

    // 1. Filter
    if (searchQuery) {
      files = files.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    // 2. Sort
    files.sort((a, b) => {
      const valA = a[sortConfig.key] || '';
      const valB = b[sortConfig.key] || '';
      
      let comparison = 0;
      if (valA < valB) comparison = -1;
      if (valA > valB) comparison = 1;
      
      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });

    return files;
  }, [rawFiles, searchQuery, sortConfig]);

  // --- Action Handlers ---

  const handleCreateFolder = () => {
    const name = `New Folder ${rawFiles.filter(f => f.type === 'folder').length + 1}`;
    fs.createFolder(currentFolder, name);
  };

  const handleSort = (key: SortKey) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
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
        { separator: true },
        { label: viewMode === 'list' ? 'Switch to Grid View' : 'Switch to List View', action: () => setViewMode(viewMode === 'list' ? 'grid' : 'list') }
      ]);
    }
  };

  return (
    <div className="h-full w-full flex bg-white rounded-b-lg overflow-hidden text-gray-900 font-sans">
      {/* Sidebar */}
      <div className="w-48 bg-[#f5f5f7]/90 backdrop-blur border-r border-gray-200 p-3 flex flex-col space-y-4 pt-4 select-none overflow-y-auto">
        <div>
          <h3 className="text-xs font-bold text-gray-400 mb-2 px-2">Favorites</h3>
          <SidebarItem icon={Wifi} label="AirDrop" path={['root', 'AirDrop']} active={currentFolder === 'AirDrop'} onClick={navigateTo} />
          <SidebarItem icon={Clock} label="Recents" path={['root']} active={currentFolder === 'root'} onClick={navigateTo} />
          <SidebarItem icon={AppWindow} label="Applications" path={['root', 'Applications']} active={currentFolder === 'Applications'} onClick={navigateTo} />
          <SidebarItem icon={Monitor} label="Desktop" path={['root', 'Desktop']} active={currentFolder === 'Desktop'} onClick={navigateTo} />
          <SidebarItem icon={File} label="Documents" path={['root', 'Documents']} active={currentFolder === 'Documents'} onClick={navigateTo} />
          <SidebarItem icon={Download} label="Downloads" path={['root', 'Downloads']} active={currentFolder === 'Downloads'} onClick={navigateTo} />
          <SidebarItem icon={Trash2} label="Trash" path={['root', 'Trash']} active={currentFolder === 'Trash'} onClick={navigateTo} />
        </div>
        <div>
          <h3 className="text-xs font-bold text-gray-400 mb-2 px-2">iCloud</h3>
          <SidebarItem icon={Cloud} label="iCloud Drive" path={['root', 'iCloud Drive']} active={currentFolder === 'iCloud Drive'} onClick={navigateTo} />
        </div>
        <div>
          <h3 className="text-xs font-bold text-gray-400 mb-2 px-2">Locations</h3>
          <SidebarItem icon={HardDrive} label="Macintosh HD" path={['root', 'Macintosh HD']} active={currentFolder === 'Macintosh HD'} onClick={navigateTo} />
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Toolbar */}
        <div className="h-12 border-b border-gray-200 flex items-center px-4 space-x-4 bg-[#fbfbfd] justify-between shadow-sm z-10">
          <div className="flex items-center space-x-4">
             <div className="flex space-x-1">
               <button onClick={handleBack} disabled={historyIndex <= 0} className="p-1 hover:bg-gray-200 rounded disabled:opacity-30 transition-colors">
                  <ChevronLeft size={20} className="text-gray-600" />
               </button>
               <button onClick={handleForward} disabled={historyIndex >= history.length - 1} className="p-1 hover:bg-gray-200 rounded disabled:opacity-30 transition-colors">
                  <ChevronRight size={20} className="text-gray-600" />
               </button>
             </div>
             <span className="font-semibold text-sm text-gray-700">{displayPath}</span>
          </div>
          
          <div className="flex items-center space-x-3">
             <div className="flex bg-gray-200/50 rounded-md p-0.5 border border-gray-200">
                <button 
                  onClick={() => setViewMode('list')}
                  className={`p-1 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200/50'}`}
                  title="List View"
                >
                  <ListIcon size={16} className="text-gray-600" />
                </button>
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-1 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200/50'}`}
                  title="Grid View"
                >
                  <LayoutGrid size={16} className="text-gray-600" />
                </button>
             </div>

             <button onClick={handleCreateFolder} className="p-1.5 hover:bg-gray-200 rounded text-gray-500 transition-colors" title="New Folder">
               <Plus size={18} />
             </button>
             
             <div className="relative group">
                <Search size={14} className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search" 
                  className="w-32 pl-8 pr-2 py-1 bg-white border border-gray-300 rounded text-xs focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 focus:outline-none focus:w-48 transition-all"
                />
             </div>
          </div>
        </div>

        {/* File View */}
        <div 
          className="flex-1 overflow-auto" 
          onClick={() => setSelectedFile(null)} 
          onContextMenu={handleBackgroundContextMenu}
        >
          {processedFiles.length === 0 ? (
             <div className="flex flex-col items-center justify-center h-full text-gray-400 text-sm">
                <Folder size={48} className="mb-2 opacity-20" />
                <span>{searchQuery ? 'No results found' : 'Folder is empty'}</span>
             </div>
          ) : viewMode === 'list' ? (
            // LIST VIEW
            <div className="min-w-full inline-block align-middle">
              <div className="grid grid-cols-12 text-xs font-semibold text-gray-500 px-4 py-2 border-b border-gray-100 select-none sticky top-0 bg-white/95 backdrop-blur z-0">
                <div className="col-span-6 cursor-pointer hover:text-gray-700 flex items-center group" onClick={() => handleSort('name')}>
                  Name {sortConfig.key === 'name' && <ArrowUpDown size={10} className="ml-1 opacity-50" />}
                </div>
                <div className="col-span-2 cursor-pointer hover:text-gray-700 flex items-center group" onClick={() => handleSort('date')}>
                  Date Modified {sortConfig.key === 'date' && <ArrowUpDown size={10} className="ml-1 opacity-50" />}
                </div>
                <div className="col-span-2 cursor-pointer hover:text-gray-700 flex items-center group" onClick={() => handleSort('size')}>
                  Size {sortConfig.key === 'size' && <ArrowUpDown size={10} className="ml-1 opacity-50" />}
                </div>
                <div className="col-span-2 cursor-pointer hover:text-gray-700 flex items-center group" onClick={() => handleSort('type')}>
                  Kind {sortConfig.key === 'type' && <ArrowUpDown size={10} className="ml-1 opacity-50" />}
                </div>
              </div>
              <div className="pb-2">
                {processedFiles.map((file, idx) => (
                  <div 
                    key={file.name + idx}
                    onClick={(e) => { e.stopPropagation(); setSelectedFile(file.name); }}
                    onDoubleClick={(e) => { e.stopPropagation(); handleDoubleClick(file); }}
                    onContextMenu={(e) => handleContextMenu(e, file)}
                    className={`grid grid-cols-12 items-center px-4 py-1.5 text-sm cursor-default select-none ${
                      selectedFile === file.name ? 'bg-blue-600 text-white' : 'hover:bg-gray-100 odd:bg-gray-50/30'
                    }`}
                  >
                    <div className="col-span-6 flex items-center space-x-2 overflow-hidden">
                      {file.type === 'folder' ? (
                        <Folder size={16} className={`shrink-0 ${selectedFile === file.name ? 'text-white' : 'text-blue-400'}`} fill="currentColor" />
                      ) : file.type === 'app' ? (
                        <AppWindow size={16} className={`shrink-0 ${selectedFile === file.name ? 'text-white' : 'text-purple-500'}`} />
                      ) : file.size === 'Device' ? (
                         file.name.includes('iPhone') ? <Smartphone size={16} className="text-gray-500" /> : <Laptop size={16} className="text-gray-500" />
                      ) : (
                        <File size={16} className={`shrink-0 ${selectedFile === file.name ? 'text-white' : 'text-gray-400'}`} />
                      )}
                      <span className="truncate">{file.name}</span>
                    </div>
                    <div className={`col-span-2 text-xs truncate ${selectedFile === file.name ? 'text-blue-100' : 'text-gray-500'}`}>{file.date || '--'}</div>
                    <div className={`col-span-2 text-xs ${selectedFile === file.name ? 'text-blue-100' : 'text-gray-500'}`}>{file.size || '--'}</div>
                    <div className={`col-span-2 text-xs ${selectedFile === file.name ? 'text-blue-100' : 'text-gray-500'}`}>{
                        file.type === 'folder' ? 'Folder' : file.type === 'app' ? 'Application' : file.size === 'Device' ? 'Device' : 'Document'
                    }</div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            // GRID VIEW
            <div className="p-4 grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-4 content-start">
              {processedFiles.map((file, idx) => (
                 <div
                    key={file.name + idx}
                    onClick={(e) => { e.stopPropagation(); setSelectedFile(file.name); }}
                    onDoubleClick={(e) => { e.stopPropagation(); handleDoubleClick(file); }}
                    onContextMenu={(e) => handleContextMenu(e, file)}
                    className={`flex flex-col items-center p-2 rounded-md cursor-default border ${
                      selectedFile === file.name ? 'bg-gray-200 border-gray-300' : 'border-transparent hover:bg-gray-100'
                    }`}
                 >
                    <div className="w-16 h-16 flex items-center justify-center mb-2">
                      {file.type === 'folder' ? (
                        <Folder size={56} className="text-blue-400 drop-shadow-sm" fill="currentColor" />
                      ) : file.type === 'app' ? (
                        <div className="w-14 h-14 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl shadow-sm flex items-center justify-center border border-white/50">
                             <AppWindow size={32} className="text-gray-600" />
                        </div>
                      ) : file.size === 'Device' ? (
                         file.name.includes('iPhone') ? <Smartphone size={48} className="text-gray-400" /> : <Laptop size={48} className="text-gray-400" />
                      ) : (
                        <div className="w-12 h-14 bg-white border border-gray-200 shadow-sm flex items-center justify-center rounded-[2px]">
                           <File size={28} className="text-gray-400" />
                        </div>
                      )}
                    </div>
                    <span className={`text-xs text-center break-words line-clamp-2 w-full px-1 ${
                       selectedFile === file.name ? 'bg-blue-500 text-white rounded-[3px]' : 'text-gray-700'
                    }`}>
                      {file.name}
                    </span>
                 </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="h-6 border-t border-gray-200 bg-[#f5f5f7] flex items-center px-3 text-xs text-gray-500 select-none justify-between">
           <span>{processedFiles.length} item{processedFiles.length !== 1 ? 's' : ''}</span>
           <span>Available: 240 GB</span>
        </div>
      </div>
    </div>
  );
};