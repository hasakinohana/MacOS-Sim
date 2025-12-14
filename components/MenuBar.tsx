import React, { useState, useEffect } from 'react';
import { Apple, Wifi, Search, Battery } from 'lucide-react';

interface MenuBarProps {
  activeApp: string;
}

export const MenuBar: React.FC<MenuBarProps> = ({ activeApp }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 60000); // Update every minute
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  return (
    <div className="h-8 w-full bg-white/40 backdrop-blur-md shadow-sm fixed top-0 left-0 z-50 flex items-center justify-between px-4 text-sm select-none text-gray-800 dark:text-white dark:bg-black/30 transition-colors">
      <div className="flex items-center space-x-4 font-medium">
        <Apple size={18} className="cursor-pointer hover:opacity-70" />
        <span className="font-bold cursor-pointer hidden sm:block">{activeApp}</span>
        <span className="cursor-pointer hover:opacity-70 hidden sm:block">File</span>
        <span className="cursor-pointer hover:opacity-70 hidden sm:block">Edit</span>
        <span className="cursor-pointer hover:opacity-70 hidden sm:block">View</span>
        <span className="cursor-pointer hover:opacity-70 hidden sm:block">Go</span>
        <span className="cursor-pointer hover:opacity-70 hidden sm:block">Window</span>
        <span className="cursor-pointer hover:opacity-70 hidden sm:block">Help</span>
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