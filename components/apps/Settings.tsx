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
  Search,
  Check,
  Lock,
  Signal,
  Sun,
  Shield,
  Zap,
  Info
} from 'lucide-react';

interface SettingsProps {
  currentWallpaper: string;
  onWallpaperChange: (url: string) => void;
  isDarkMode: boolean;
  setDarkMode: (dark: boolean) => void;
}

interface SidebarItemProps {
  item: any;
  activeTab: string;
  onClick: (id: string) => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ item, activeTab, onClick }) => {
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

const Toggle = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
  <button 
    onClick={onChange}
    className={`w-11 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out ${checked ? 'bg-blue-600' : 'bg-gray-300'}`}
  >
    <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-200 ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
  </button>
);

export const SettingsApp: React.FC<SettingsProps> = ({ currentWallpaper, onWallpaperChange, isDarkMode, setDarkMode }) => {
  const [activeTab, setActiveTab] = useState('wifi');
  const [wifiEnabled, setWifiEnabled] = useState(true);
  const [btEnabled, setBtEnabled] = useState(true);
  const [brightness, setBrightness] = useState(80);

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

  const renderContent = () => {
    switch (activeTab) {
      case 'wifi':
        return (
          <div className="space-y-6 animate-in fade-in duration-300">
             <div className="flex items-center justify-between border-b border-gray-200 pb-4">
               <div className="flex items-center space-x-4">
                 <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <Wifi className="text-white" size={24} />
                 </div>
                 <div>
                   <h2 className="font-semibold text-lg">Wi-Fi</h2>
                   <p className="text-sm text-gray-500">{wifiEnabled ? 'On' : 'Off'}</p>
                 </div>
               </div>
               <Toggle checked={wifiEnabled} onChange={() => setWifiEnabled(!wifiEnabled)} />
             </div>
             
             {wifiEnabled && (
               <div>
                  <h3 className="text-xs font-semibold text-gray-400 uppercase mb-2">Known Networks</h3>
                  <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
                     <div className="p-3 flex items-center justify-between hover:bg-gray-50">
                        <div className="flex items-center space-x-3">
                           <Check size={16} className="text-blue-500" />
                           <span className="font-medium">Home WiFi 5G</span>
                        </div>
                        <div className="flex items-center space-x-3 text-gray-400">
                           <Lock size={14} />
                           <Signal size={16} />
                        </div>
                     </div>
                  </div>

                  <h3 className="text-xs font-semibold text-gray-400 uppercase mb-2 mt-6">Other Networks</h3>
                  <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
                     {['Starbucks WiFi', 'iPhone Hotspot', 'Neighbor_Guest'].map(net => (
                       <div key={net} className="p-3 flex items-center justify-between hover:bg-gray-50 cursor-pointer">
                          <div className="flex items-center space-x-3 pl-7">
                             <span className="text-gray-700">{net}</span>
                          </div>
                          <div className="flex items-center space-x-3 text-gray-400">
                             <Lock size={14} />
                             <Signal size={16} />
                          </div>
                       </div>
                     ))}
                  </div>
               </div>
             )}
          </div>
        );
      case 'bluetooth':
        return (
          <div className="space-y-6 animate-in fade-in duration-300">
             <div className="flex items-center justify-between border-b border-gray-200 pb-4">
               <div className="flex items-center space-x-4">
                 <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                    <Bluetooth className="text-white" size={24} />
                 </div>
                 <div>
                   <h2 className="font-semibold text-lg">Bluetooth</h2>
                   <p className="text-sm text-gray-500">{btEnabled ? 'On' : 'Off'}</p>
                 </div>
               </div>
               <Toggle checked={btEnabled} onChange={() => setBtEnabled(!btEnabled)} />
             </div>
             
             {btEnabled && (
               <div>
                  <h3 className="text-xs font-semibold text-gray-400 uppercase mb-2">My Devices</h3>
                  <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
                     <div className="p-3 flex items-center justify-between">
                        <span className="font-medium">AirPods Pro</span>
                        <span className="text-sm text-gray-500">Connected</span>
                     </div>
                     <div className="p-3 flex items-center justify-between">
                        <span className="font-medium">Magic Keyboard</span>
                        <span className="text-sm text-gray-500">Connected</span>
                     </div>
                     <div className="p-3 flex items-center justify-between">
                        <span className="font-medium opacity-50">MX Master 3</span>
                        <span className="text-sm text-gray-400">Not Connected</span>
                     </div>
                  </div>
               </div>
             )}
          </div>
        );
      case 'network':
        return (
          <div className="space-y-6 animate-in fade-in duration-300">
            <h2 className="text-xl font-semibold mb-6">Network</h2>
            <div className="bg-white rounded-lg border border-gray-200 p-4 flex items-center space-x-4">
               <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Globe className="text-green-600" size={24} />
               </div>
               <div className="flex-1">
                  <div className="font-medium flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Connected
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    IP Address: 192.168.1.5<br/>
                    Router: 192.168.1.1
                  </div>
               </div>
               <button className="px-3 py-1 bg-white border border-gray-300 rounded shadow-sm text-sm hover:bg-gray-50">Details...</button>
            </div>
            <div className="text-sm text-gray-500 px-2">
               Thunderbolt Bridge is not connected.
            </div>
          </div>
        );
      case 'notifications':
         return (
           <div className="space-y-6 animate-in fade-in duration-300">
              <h2 className="text-xl font-semibold mb-4">Notifications</h2>
              <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
                 {['Finder', 'Messages', 'Mail', 'Calendar', 'Photos'].map((app) => (
                    <div key={app} className="p-3 flex items-center justify-between">
                       <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gray-200 rounded-md"></div>
                          <span className="font-medium">{app}</span>
                       </div>
                       <Toggle checked={true} onChange={() => {}} />
                    </div>
                 ))}
              </div>
           </div>
         );
      case 'appearance':
        return (
          <div className="space-y-6 animate-in fade-in duration-300">
             <div className="flex items-center space-x-4 border-b border-gray-200 pb-4">
               <div className="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center">
                  <Moon className="text-white" size={24} />
               </div>
               <div>
                 <h2 className="font-semibold text-lg">Appearance</h2>
                 <p className="text-sm text-gray-500">Select your preferred appearance</p>
               </div>
             </div>

             <div className="grid grid-cols-2 gap-6 max-w-md">
                <div 
                  onClick={() => setDarkMode(false)}
                  className={`cursor-pointer group flex flex-col items-center space-y-3`}
                >
                   <div className={`w-full aspect-video rounded-lg border-2 overflow-hidden shadow-sm relative ${!isDarkMode ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-200 hover:border-gray-300'}`}>
                      <div className="absolute inset-0 bg-[#f5f5f7] flex items-center justify-center">
                         <div className="w-3/4 h-3/4 bg-white rounded shadow-sm border border-gray-200 flex flex-col">
                            <div className="h-4 bg-gray-100 border-b border-gray-200"></div>
                            <div className="flex-1 p-2 space-y-2">
                               <div className="h-2 w-1/2 bg-gray-100 rounded"></div>
                               <div className="h-2 w-3/4 bg-gray-100 rounded"></div>
                            </div>
                         </div>
                      </div>
                      {!isDarkMode && <div className="absolute bottom-2 right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center"><Check size={12} className="text-white" /></div>}
                   </div>
                   <span className="text-sm font-medium">Light</span>
                </div>

                <div 
                  onClick={() => setDarkMode(true)}
                  className={`cursor-pointer group flex flex-col items-center space-y-3`}
                >
                   <div className={`w-full aspect-video rounded-lg border-2 overflow-hidden shadow-sm relative ${isDarkMode ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-200 hover:border-gray-300'}`}>
                      <div className="absolute inset-0 bg-[#1e1e1e] flex items-center justify-center">
                         <div className="w-3/4 h-3/4 bg-[#2c2c2c] rounded shadow-sm border border-gray-700 flex flex-col">
                            <div className="h-4 bg-[#3a3a3a] border-b border-gray-700"></div>
                            <div className="flex-1 p-2 space-y-2">
                               <div className="h-2 w-1/2 bg-gray-600 rounded"></div>
                               <div className="h-2 w-3/4 bg-gray-600 rounded"></div>
                            </div>
                         </div>
                      </div>
                      {isDarkMode && <div className="absolute bottom-2 right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center"><Check size={12} className="text-white" /></div>}
                   </div>
                   <span className="text-sm font-medium">Dark</span>
                </div>
             </div>
          </div>
        );
      case 'display':
         return (
            <div className="space-y-6 animate-in fade-in duration-300">
               <h2 className="text-xl font-semibold mb-4">Displays</h2>
               <div className="flex justify-center mb-6">
                  <div className="w-48 h-32 bg-blue-500 rounded-lg shadow-lg relative flex items-center justify-center text-white border-4 border-black">
                     <span className="text-xs font-mono">Built-in Display</span>
                  </div>
               </div>
               <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
                  <div>
                     <div className="flex justify-between mb-2">
                        <span className="font-medium text-sm">Brightness</span>
                        <Sun size={16} className="text-gray-500"/>
                     </div>
                     <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={brightness} 
                        onChange={(e) => setBrightness(parseInt(e.target.value))}
                        className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                     />
                  </div>
                  <div className="flex items-center justify-between">
                     <span className="text-sm">Resolution</span>
                     <select className="bg-gray-50 border border-gray-200 rounded px-2 py-1 text-sm">
                        <option>Default (1920 x 1080)</option>
                        <option>Scaled</option>
                     </select>
                  </div>
               </div>
            </div>
         );
      case 'wallpaper':
        return (
          <div className="animate-in fade-in duration-300">
            <h2 className="text-xl font-semibold mb-6">Wallpaper</h2>
            
            <div className="mb-6">
               <div className="w-full h-48 rounded-xl overflow-hidden shadow-sm relative border border-gray-200">
                 <img src={currentWallpaper} alt="Current" className="w-full h-full object-cover" />
                 <div className="absolute inset-0 flex items-center justify-center">
                    <span className="bg-black/30 backdrop-blur text-white px-4 py-1 rounded-full text-sm shadow-lg">Current Wallpaper</span>
                 </div>
               </div>
            </div>

            <h3 className="text-sm font-semibold text-gray-500 mb-3">Dynamic Wallpapers</h3>
            <div className="grid grid-cols-3 gap-4">
              {WALLPAPERS.map((wp, idx) => (
                <div 
                  key={idx} 
                  onClick={() => onWallpaperChange(wp.url)}
                  className={`group relative aspect-video rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${currentWallpaper === wp.url ? 'border-blue-500 ring-2 ring-blue-100' : 'border-transparent hover:scale-[1.02]'}`}
                >
                  <img src={wp.url} alt={wp.name} className="w-full h-full object-cover" />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/40 text-white text-xs p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {wp.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'battery':
         return (
            <div className="space-y-6 animate-in fade-in duration-300">
               <h2 className="text-xl font-semibold mb-4">Battery</h2>
               <div className="flex items-center space-x-4 mb-6">
                  <div className="w-16 h-8 border-2 border-gray-400 rounded-md relative p-1 flex items-center">
                     <div className="h-full bg-green-500 w-[85%] rounded-sm"></div>
                     <div className="absolute -right-2 top-2 bottom-2 w-1.5 bg-gray-400 rounded-r-md"></div>
                  </div>
                  <div>
                     <div className="text-2xl font-bold">85%</div>
                     <div className="text-xs text-gray-500">Power Source: Battery</div>
                  </div>
               </div>
               
               <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
                  <div className="p-3 flex items-center justify-between">
                     <div className="flex items-center space-x-3">
                        <Zap size={18} className="text-yellow-500"/>
                        <span className="text-sm">Low Power Mode</span>
                     </div>
                     <Toggle checked={false} onChange={() => {}} />
                  </div>
                  <div className="p-3 flex items-center justify-between">
                     <div className="flex items-center space-x-3">
                        <Info size={18} className="text-blue-500"/>
                        <span className="text-sm">Battery Health</span>
                     </div>
                     <span className="text-sm text-green-600 font-medium">Normal</span>
                  </div>
               </div>
            </div>
         );
      case 'users':
         return (
            <div className="space-y-6 animate-in fade-in duration-300">
               <h2 className="text-xl font-semibold mb-6">Users & Groups</h2>
               <div className="bg-white rounded-lg border border-gray-200 p-4 flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
                     <User size={32} className="text-white"/>
                  </div>
                  <div className="flex-1">
                     <div className="font-bold text-lg">Guest User</div>
                     <div className="text-sm text-gray-500">Standard</div>
                  </div>
                  <button className="text-blue-500 text-sm hover:underline">Edit...</button>
               </div>
               
               <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
                  <div className="p-3 flex items-center justify-between">
                     <div className="flex items-center space-x-3">
                        <Shield size={18} className="text-gray-500"/>
                        <span className="text-sm">Change Password...</span>
                     </div>
                     <button className="px-3 py-1 bg-gray-100 text-xs rounded border border-gray-200">Change</button>
                  </div>
               </div>
            </div>
         );
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 animate-in zoom-in-95 duration-300">
             <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
               {React.createElement(categories.find(c => c.id === activeTab)?.icon || Monitor, { size: 32, className: 'text-gray-400' })}
             </div>
             <p className="text-lg font-medium text-gray-500">{categories.find(c => c.id === activeTab)?.label} Settings</p>
             <p className="text-sm">These settings are not available in this simulation.</p>
          </div>
        );
    }
  };

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
        {renderContent()}
      </div>
    </div>
  );
};