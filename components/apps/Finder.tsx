import React, { useState } from 'react';
import { INITIAL_FILES } from '../../constants';
import { FileItem } from '../../types';
import { File, Folder, HardDrive, Clock, Cloud, Download, Monitor } from 'lucide-react';

export const FinderApp: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const SidebarItem = ({ icon: Icon, label, active = false }: { icon: any, label: string, active?: boolean }) => (
    <div className={`flex items-center space-x-2 px-2 py-1.5 rounded-md cursor-default text-sm ${active ? 'bg-gray-300/50' : 'hover:bg-gray-200/50'}`}>
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
          <SidebarItem icon={Clock} label="Recents" />
          <SidebarItem icon={Monitor} label="Desktop" />
          <SidebarItem icon={File} label="Documents" active />
          <SidebarItem icon={Download} label="Downloads" />
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
        {/* Toolbar mockup */}
        <div className="h-10 border-b border-gray-200 flex items-center px-4 space-x-4 bg-gray-50/50">
          <div className="flex space-x-1">
             <div className="p-1 hover:bg-gray-200 rounded"><span className="text-xs text-gray-500">Back</span></div>
          </div>
          <span className="font-semibold text-sm text-gray-700 flex-1 text-center">Documents</span>
          <div className="w-10"></div>
        </div>

        {/* File List */}
        <div className="flex-1 p-2 overflow-auto">
          <div className="grid grid-cols-1 gap-1">
            <div className="grid grid-cols-12 text-xs font-medium text-gray-500 px-4 py-2 border-b border-gray-100">
              <div className="col-span-6">Name</div>
              <div className="col-span-2">Date Modified</div>
              <div className="col-span-2">Size</div>
              <div className="col-span-2">Kind</div>
            </div>
            {INITIAL_FILES.map((file, idx) => (
              <div 
                key={idx}
                onClick={() => setSelectedFile(file.name)}
                className={`grid grid-cols-12 items-center px-4 py-2 text-sm rounded-md cursor-default ${
                  selectedFile === file.name ? 'bg-blue-600 text-white' : 'hover:bg-gray-100 odd:bg-white'
                }`}
              >
                <div className="col-span-6 flex items-center space-x-2">
                  {file.type === 'folder' ? (
                    <Folder size={18} className={selectedFile === file.name ? 'text-white' : 'text-blue-400'} fill="currentColor" />
                  ) : (
                    <File size={18} className={selectedFile === file.name ? 'text-white' : 'text-gray-400'} />
                  )}
                  <span className="truncate">{file.name}</span>
                </div>
                <div className={`col-span-2 text-xs truncate ${selectedFile === file.name ? 'text-blue-100' : 'text-gray-500'}`}>{file.date}</div>
                <div className={`col-span-2 text-xs ${selectedFile === file.name ? 'text-blue-100' : 'text-gray-500'}`}>{file.size || '--'}</div>
                <div className={`col-span-2 text-xs ${selectedFile === file.name ? 'text-blue-100' : 'text-gray-500'}`}>{file.type === 'folder' ? 'Folder' : 'Document'}</div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Footer */}
        <div className="h-6 border-t border-gray-200 bg-gray-50 flex items-center px-3 text-xs text-gray-500">
           {INITIAL_FILES.length} items, 240 GB available
        </div>
      </div>
    </div>
  );
};