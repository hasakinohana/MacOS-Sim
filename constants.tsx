import { AppID, AppConfig, FileItem } from './types';
import { 
  Terminal, 
  Folder, 
  StickyNote, 
  Calculator, 
  Bot, 
  Settings, 
  Image,
  Cpu
} from 'lucide-react';

export const WALLPAPER_URL = "https://images.unsplash.com/photo-1477346611705-65d1883cee1e?q=80&w=2070&auto=format&fit=crop";

export const WALLPAPERS = [
  { name: "Monterey", url: "https://images.unsplash.com/photo-1477346611705-65d1883cee1e?q=80&w=2070&auto=format&fit=crop" },
  { name: "Big Sur", url: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?q=80&w=2070&auto=format&fit=crop" },
  { name: "Yosemite", url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2070&auto=format&fit=crop" },
  { name: "Sierra", url: "https://images.unsplash.com/photo-1536431311719-398b670a9473?q=80&w=2070&auto=format&fit=crop" },
  { name: "Mojave", url: "https://images.unsplash.com/photo-1502481851512-e9e2529bfbf9?q=80&w=2069&auto=format&fit=crop" },
  { name: "Abstract", url: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop" }
];

export const APPS: Record<AppID, AppConfig> = {
  [AppID.FINDER]: {
    id: AppID.FINDER,
    title: 'Finder',
    icon: Folder,
    defaultSize: { width: 640, height: 400 },
    color: 'bg-blue-500'
  },
  [AppID.TERMINAL]: {
    id: AppID.TERMINAL,
    title: 'Terminal',
    icon: Terminal,
    defaultSize: { width: 580, height: 360 },
    color: 'bg-gray-800'
  },
  [AppID.GEMINI]: {
    id: AppID.GEMINI,
    title: 'Gemini Assistant',
    icon: Bot, 
    defaultSize: { width: 400, height: 600 },
    color: 'bg-gradient-to-br from-blue-400 to-purple-500'
  },
  [AppID.NOTES]: {
    id: AppID.NOTES,
    title: 'Notes',
    icon: StickyNote,
    defaultSize: { width: 550, height: 400 },
    color: 'bg-yellow-400'
  },
  [AppID.CALCULATOR]: {
    id: AppID.CALCULATOR,
    title: 'Calculator',
    icon: Calculator,
    defaultSize: { width: 260, height: 380 },
    color: 'bg-orange-500'
  },
  [AppID.PHOTOS]: {
    id: AppID.PHOTOS,
    title: 'Photos',
    icon: Image,
    defaultSize: { width: 700, height: 500 },
    color: 'bg-pink-500'
  },
  [AppID.SETTINGS]: {
    id: AppID.SETTINGS,
    title: 'Settings',
    icon: Settings,
    defaultSize: { width: 600, height: 400 },
    color: 'bg-gray-500'
  },
};

export const INITIAL_FILES: FileItem[] = [
  { name: 'Projects', type: 'folder', date: 'Today, 10:23 AM' },
  { name: 'Documents', type: 'folder', date: 'Yesterday, 4:12 PM' },
  { name: 'Downloads', type: 'folder', date: 'Oct 24, 2023' },
  { name: 'Resume.pdf', type: 'file', size: '1.2 MB', date: 'Aug 15, 2023' },
  { name: 'Budget.xlsx', type: 'file', size: '24 KB', date: 'Sep 01, 2023' },
  { name: 'vacation_photo.jpg', type: 'file', size: '4.5 MB', date: 'Jul 20, 2023' },
];

export const FILE_SYSTEM: Record<string, FileItem[]> = {
  '~': INITIAL_FILES, // Root mapped to ~ for Terminal
  'root': INITIAL_FILES, // Internal root for Finder
  'Documents': [
     { name: 'Work', type: 'folder', date: 'Oct 2' },
     { name: 'Personal', type: 'folder', date: 'Sep 15' },
     { name: 'Resume_v2.pdf', type: 'file', size: '1.4 MB', date: 'Today' }
  ],
  'Downloads': [
     { name: 'installer.dmg', type: 'file', size: '150 MB', date: 'Today' },
     { name: 'image_4.png', type: 'file', size: '2.1 MB', date: 'Yesterday' }
  ],
  'Projects': [
     { name: 'Website', type: 'folder', date: 'Aug 10' },
     { name: 'App Design', type: 'folder', date: 'Oct 1' }
  ],
  'Desktop': [
    { name: 'Work Projects', type: 'folder', date: 'Today' },
    { name: 'Screenshot_1.png', type: 'file', size: '2.4 MB', date: 'Today' },
    { name: 'Notes.txt', type: 'file', size: '1 KB', date: 'Yesterday' }
  ],
  'Work': [
     { name: 'Q4_Plan.docx', type: 'file', size: '45 KB', date: 'Oct 2' }
  ],
  'Personal': [
     { name: 'Diary.txt', type: 'file', size: '12 KB', date: 'Sep 15' }
  ],
  'Work Projects': [
      { name: 'Design Specs', type: 'folder', date: 'Oct 20' }
  ]
};