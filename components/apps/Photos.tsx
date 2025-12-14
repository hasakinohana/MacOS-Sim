import React, { useState } from 'react';
import { Heart, Image as ImageIcon, Clock, LayoutGrid, ChevronLeft } from 'lucide-react';

const PHOTOS_DATA = [
  { id: 1, url: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?q=80&w=1000&auto=format&fit=crop', title: 'Mountains' },
  { id: 2, url: 'https://images.unsplash.com/photo-1682687220063-4742bd7fd538?q=80&w=1000&auto=format&fit=crop', title: 'Ocean' },
  { id: 3, url: 'https://images.unsplash.com/photo-1682695796954-bad25145f022?q=80&w=1000&auto=format&fit=crop', title: 'Desert' },
  { id: 4, url: 'https://images.unsplash.com/photo-1682686581854-5e71f58e7e3f?q=80&w=1000&auto=format&fit=crop', title: 'Canyon' },
  { id: 5, url: 'https://images.unsplash.com/photo-1682687982501-1e58ab814714?q=80&w=1000&auto=format&fit=crop', title: 'Forest' },
  { id: 6, url: 'https://images.unsplash.com/photo-1682687220198-88e9bdea9931?q=80&w=1000&auto=format&fit=crop', title: 'City' },
  { id: 7, url: 'https://images.unsplash.com/photo-1682685797818-c9dc151d241e?q=80&w=1000&auto=format&fit=crop', title: 'River' },
  { id: 8, url: 'https://images.unsplash.com/photo-1682687220509-61b8a906ca19?q=80&w=1000&auto=format&fit=crop', title: 'Night' },
  { id: 9, url: 'https://images.unsplash.com/photo-1682687221175-91348141193d?q=80&w=1000&auto=format&fit=crop', title: 'Sky' },
];

export const PhotosApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'library' | 'favorites'>('library');
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const SidebarItem = ({ icon: Icon, label, id, active = false }: { icon: any, label: string, id: string, active?: boolean }) => (
    <div 
      onClick={() => {
        setActiveTab(id as any);
        setSelectedPhoto(null);
      }}
      className={`flex items-center space-x-3 px-3 py-2 rounded-md cursor-pointer text-sm mb-1 ${active ? 'bg-gray-200 font-medium text-black' : 'text-gray-600 hover:bg-gray-100'}`}
    >
      <Icon size={18} className={active ? 'text-pink-600' : 'text-gray-500'} />
      <span>{label}</span>
    </div>
  );

  return (
    <div className="flex h-full w-full bg-white text-gray-900 rounded-b-lg overflow-hidden">
      {/* Sidebar */}
      <div className="w-48 bg-gray-50/80 backdrop-blur border-r border-gray-200 p-4 pt-6 flex flex-col">
        <h3 className="text-xs font-semibold text-gray-400 uppercase mb-3 px-2">Photos</h3>
        <SidebarItem icon={ImageIcon} label="Library" id="library" active={activeTab === 'library'} />
        <SidebarItem icon={Heart} label="Favorites" id="favorites" active={activeTab === 'favorites'} />
        <SidebarItem icon={Clock} label="Recents" id="recents" />
        
        <h3 className="text-xs font-semibold text-gray-400 uppercase mb-3 mt-6 px-2">Albums</h3>
        <SidebarItem icon={LayoutGrid} label="Vacation" id="album1" />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-white overflow-hidden relative">
        {/* Header */}
        <div className="h-12 border-b border-gray-100 flex items-center justify-between px-6 bg-white z-10">
          <span className="font-bold text-lg">{activeTab === 'library' ? 'Library' : 'Favorites'}</span>
          <div className="flex space-x-2">
            <button className="px-3 py-1 text-xs bg-gray-100 rounded-full font-medium hover:bg-gray-200">Select</button>
          </div>
        </div>

        {/* Grid or Single View */}
        {selectedPhoto ? (
          <div className="flex-1 flex items-center justify-center bg-black relative animate-in fade-in duration-200">
             <button 
               onClick={() => setSelectedPhoto(null)} 
               className="absolute top-4 left-4 z-20 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 backdrop-blur-sm"
             >
               <ChevronLeft size={24} />
             </button>
             <img src={selectedPhoto} alt="Selected" className="max-h-full max-w-full object-contain" />
          </div>
        ) : (
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="grid grid-cols-3 gap-1 auto-rows-[120px]">
              {PHOTOS_DATA.map((photo) => (
                <div 
                  key={photo.id} 
                  onClick={() => setSelectedPhoto(photo.url)}
                  className="relative group cursor-pointer overflow-hidden bg-gray-100"
                >
                  <img 
                    src={photo.url} 
                    alt={photo.title} 
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};