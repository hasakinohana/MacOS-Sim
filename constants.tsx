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
    icon: Bot, // Using Bot icon for AI
    defaultSize: { width: 400, height: 600 },
    color: 'bg-gradient-to-br from-blue-400 to-purple-500'
  },
  [AppID.NOTES]: {
    id: AppID.NOTES,
    title: 'Notes',
    icon: StickyNote,
    defaultSize: { width: 400, height: 500 },
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
    defaultSize: { width: 500, height: 350 },
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