import React, { useState, useEffect, useRef } from 'react';
import { Apple, Wifi, Search, Battery } from 'lucide-react';

interface MenuBarProps {
  activeApp: string;
}

const MENUS = {
  apple: ['About This Mac', 'System Settings...', 'separator', 'Sleep', 'Restart...', 'Shut Down...'],
  File: ['New Window', 'New Folder', 'separator', 'Close Window'],
  Edit: ['Undo', 'Redo', 'separator', 'Cut', 'Copy', 'Paste', 'Select All'],
  View: ['as Icons', 'as List', 'as Columns', 'separator', 'Enter Full Screen'],
  Go: ['Back', 'Forward', 'separator', 'Applications', 'Desktop', 'Downloads'],
  Window: ['Minimize', 'Zoom', 'separator', 'Bring All to Front'],
  Help: ['Search', 'MacOS Help']
};

const MenuItem: React.FC<{ label: string }> = ({ label }) => {
  if (label === 'separator') return <div className="h-px bg-gray-200 my-1 mx-3" />;
  return (
    <div className="px-4 py-1 hover:bg-blue-500 hover:text-white cursor-default rounded text-sm whitespace-nowrap">
      {label}
    </div>
  );
};

export const MenuBar: React.FC<MenuBarProps> = ({ activeApp }) => {
  const [time, setTime] = useState(new Date());
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 60000); 
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const handleMenuClick = (menu: string) => {
    setActiveMenu(activeMenu === menu ? null : menu);
  };

  return (
    <div 
      ref={menuRef}
      className="h-8 w-full bg-white/40 backdrop-blur-md shadow-sm fixed top-0 left-0 z-50 flex items-center justify-between px-4 text-sm select-none text-gray-800 dark:text-white dark:bg-black/30 transition-colors"
    >
      <div className="flex items-center space-x-1 font-medium relative h-full">
        {/* Apple Menu */}
        <div className="relative h-full flex items-center">
            <div 
                className={`px-3 h-full flex items-center cursor-pointer rounded transition-colors ${activeMenu === 'apple' ? 'bg-black/10' : 'hover:bg-black/5'}`}
                onClick={() => handleMenuClick('apple')}
            >
                <Apple size={18} fill="currentColor" />
            </div>
            {activeMenu === 'apple' && (
                <div className="absolute top-8 left-0 w-48 bg-white/90 backdrop-blur-xl rounded-b-lg shadow-xl border border-gray-200/50 py-1.5 flex flex-col z-50 animate-in fade-in zoom-in-95 duration-100 origin-top-left">
                    {MENUS.apple.map((item, i) => <MenuItem key={i} label={item} />)}
                </div>
            )}
        </div>

        {/* App Name */}
        <div className="relative h-full flex items-center">
             <div 
                className={`px-3 h-full flex items-center cursor-pointer rounded font-bold hidden sm:block transition-colors ${activeMenu === 'app' ? 'bg-black/10' : 'hover:bg-black/5'}`}
                onClick={() => handleMenuClick('app')}
            >
                {activeApp}
            </div>
            {activeMenu === 'app' && (
                <div className="absolute top-8 left-0 w-48 bg-white/90 backdrop-blur-xl rounded-b-lg shadow-xl border border-gray-200/50 py-1.5 flex flex-col z-50 animate-in fade-in zoom-in-95 duration-100 origin-top-left">
                     <MenuItem label={`About ${activeApp}`} />
                     <MenuItem label="Settings..." />
                     <MenuItem label="separator" />
                     <MenuItem label={`Quit ${activeApp}`} />
                </div>
            )}
        </div>

        {/* Standard Menus */}
        {['File', 'Edit', 'View', 'Go', 'Window', 'Help'].map(menu => (
           <div key={menu} className="relative h-full flex items-center">
              <div 
                  className={`px-3 h-full flex items-center cursor-pointer rounded hidden sm:block transition-colors ${activeMenu === menu ? 'bg-black/10' : 'hover:bg-black/5'}`}
                  onClick={() => handleMenuClick(menu)}
              >
                  {menu}
              </div>
              {activeMenu === menu && (
                  <div className="absolute top-8 left-0 min-w-[12rem] bg-white/90 backdrop-blur-xl rounded-b-lg shadow-xl border border-gray-200/50 py-1.5 flex flex-col z-50 animate-in fade-in zoom-in-95 duration-100 origin-top-left">
                       {MENUS[menu as keyof typeof MENUS]?.map((item, i) => <MenuItem key={i} label={item} />)}
                  </div>
              )}
           </div>
        ))}
      </div>

      <div className="flex items-center space-x-4">
        <Battery size={18} className="cursor-pointer" />
        <Wifi size={18} className="cursor-pointer" />
        <Search size={16} className="cursor-pointer" />
        <div className="flex items-center space-x-2 cursor-default">
          <span className="hidden sm:inline-block">{formatDate(time)}</span>
          <span>{formatTime(time)}</span>
        </div>
      </div>
    </div>
  );
};