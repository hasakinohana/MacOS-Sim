import React from 'react';
import { AppID } from '../types';
import { APPS } from '../constants';

interface DockProps {
  openApps: AppID[];
  onAppClick: (appId: AppID) => void;
}

export const Dock: React.FC<DockProps> = ({ openApps, onAppClick }) => {
  return (
    <div className="fixed bottom-2 left-1/2 transform -translate-x-1/2 z-50">
      <div className="glass flex items-end space-x-2 px-4 py-2 rounded-2xl mx-auto h-[70px] border border-white/20 shadow-2xl">
        {Object.values(APPS).map((app) => {
          const isOpen = openApps.includes(app.id);
          const Icon = app.icon;

          return (
            <div 
              key={app.id} 
              className="group relative flex flex-col items-center justify-end cursor-pointer transition-all duration-200 hover:-translate-y-2"
              onClick={() => onAppClick(app.id)}
            >
              {/* Tooltip */}
              <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gray-800/80 backdrop-blur text-white text-xs py-1 px-3 rounded shadow-lg border border-white/10 pointer-events-none whitespace-nowrap">
                {app.title}
              </div>

              {/* Icon Container */}
              <div className={`w-12 h-12 rounded-xl shadow-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${app.color}`}>
                 <Icon className="text-white w-7 h-7" />
              </div>

              {/* Dot indicator for open apps */}
              <div className={`w-1 h-1 rounded-full bg-black/60 dark:bg-white/60 mt-1 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`}></div>
            </div>
          );
        })}
      </div>
    </div>
  );
};