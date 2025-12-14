import React, { useState } from 'react';
import { WALLPAPERS } from '../../constants';
import { 
  Wifi, 
  Bluetooth, 
  Globe, 
  Moon, 
  Monitor, 
  Battery, 
  User, 
  Bell, 
  Search 
} from 'lucide-react';

interface SettingsProps {
  currentWallpaper: string;
  onWallpaperChange: (url: string) => void;
}

const SidebarItem = ({ item, activeTab, onClick }: { item: any, activeTab: string, onClick: (id: string) => void }) => {
  if (item.type === 'separator') return <div className="h-px bg-gray-200 my-2 mx-4" />;
  
  const Icon = item.icon;
  const isActive = activeTab === item.id;
  
  return (
    <div 
      onClick={() => onClick(item.id)}
      className={`flex items-center space-x-3 px-3 py-1.5 mx-2 rounded-md cursor-pointer text-sm ${isActive ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-200'}`}
    >
      <div className={`w-6 h-6 rounded-md flex items-center justify-center ${item.color}`}>
        <Icon size={14} className="text-white" />
      </div>
      <span>{item.label}</span>
    </div>
  );
};

export const SettingsApp: React.FC<SettingsProps> = ({ currentWallpaper, onWallpaperChange }) => {
  const [activeTab, setActiveTab] = useState('wallpaper');

  const categories = [
    { id: 'wifi', label: 'Wi-Fi', icon: Wifi, color: 'bg-blue-500' },
    { id: 'bluetooth', label: 'Bluetooth', icon: Bluetooth, color: 'bg-blue-600' },
    { id: 'network', label: 'Network', icon: Globe, color: 'bg-blue-500' },
    { type: 'separator' },
    { id: 'notifications', label: 'Notifications', icon: Bell, color: 'bg-red-500' },
    { id: 'appearance', label: 'Appearance', icon: Moon, color: 'bg-gray-500' },
    { id: 'display', label: 'Displays', icon: Monitor, color: 'bg-blue-400' },
    { id: 'wallpaper', label: 'Wallpaper', icon: Monitor, color: 'bg-cyan-500' },
    { type: 'separator' },
    { id: 'battery', label: 'Battery', icon: Battery, color: 'bg-green-500' },
    { id: 'users', label: 'Users', icon: User, color: 'bg-gray-400' },
  ];

  return (
    <div className="flex h-full w-full bg-[#f5f5f7] text-gray-900 rounded-b-lg overflow-hidden font-sans">
      {/* Sidebar */}
      <div className="w-56 overflow-y-auto py-4 border-r border-gray-200 bg-[#fbfbfd]">
        {/* User Card */}
        <div className="flex items-center space-x-3 px-4 mb-6">
          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
            <User size={20} />
          </div>
          <div>
            <div className="font-semibold text-sm">Guest User</div>
            <div className="text-xs text-gray-500">Apple ID</div>
          </div>
        </div>

        {/* Search */}
        <div className="px-4 mb-4">
           <div className="relative">
             <Search size={14} className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400" />
             <input 
               type="text" 
               placeholder="Search" 
               className="w-full pl-8 pr-2 py-1 bg-white border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
             />
           </div>
        </div>

        {/* Nav Items */}
        {categories.map((item, i) => (
          <SidebarItem 
            key={item.id || i} 
            item={item} 
            activeTab={activeTab}
            onClick={setActiveTab}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-8">
        {activeTab === 'wallpaper' ? (
          <div>
            <h2 className="text-xl font-semibold mb-6">Wallpaper</h2>
            
            <div className="mb-6">
               <div className="w-full h-48 rounded-xl overflow-hidden shadow-sm relative border border-gray-200">
                 <img src={currentWallpaper} alt="Current" className="w-full h-full object-cover" />
                 <div className="absolute inset-0 flex items-center justify-center">
                    <span className="bg-black/30 backdrop-blur text-white px-4 py-1 rounded-full text-sm">Current Wallpaper</span>
                 </div>
               </div>
            </div>

            <h3 className="text-sm font-semibold text-gray-500 mb-3">Dynamic Wallpapers</h3>
            <div className="grid grid-cols-3 gap-4">
              {WALLPAPERS.map((wp, idx) => (
                <div 
                  key={idx} 
                  onClick={() => onWallpaperChange(wp.url)}
                  className={`group relative aspect-video rounded-lg overflow-hidden cursor-pointer border-2 ${currentWallpaper === wp.url ? 'border-blue-500' : 'border-transparent'}`}
                >
                  <img src={wp.url} alt={wp.name} className="w-full h-full object-cover" />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/40 text-white text-xs p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {wp.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
             <div className="text-center">
               <div className="text-4xl mb-2">⚙️</div>
               <p>{categories.find(c => c.id === activeTab)?.label} settings coming soon.</p>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};