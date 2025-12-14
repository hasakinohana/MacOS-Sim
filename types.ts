import React, { ReactNode } from 'react';

export enum AppID {
  FINDER = 'finder',
  TERMINAL = 'terminal',
  NOTES = 'notes',
  CALCULATOR = 'calculator',
  GEMINI = 'gemini',
  PHOTOS = 'photos',
  SETTINGS = 'settings'
}

export interface WindowSize {
  width: number;
  height: number;
}

export interface WindowPosition {
  x: number;
  y: number;
}

export interface WindowState {
  id: string; // Unique instance ID
  appId: AppID;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  position: WindowPosition;
  size: WindowSize;
  zIndex: number;
  content?: ReactNode; // Optional custom content if needed dynamically
}

export interface AppConfig {
  id: AppID;
  title: string;
  icon: React.ElementType; // Icon component
  defaultSize: WindowSize;
  color: string;
}

export interface FileItem {
  name: string;
  type: 'folder' | 'file';
  size?: string;
  date?: string;
}