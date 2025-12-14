import { useState, useCallback } from 'react';
import { FILE_SYSTEM as INITIAL_FS } from '../constants';
import { FileItem } from '../types';

export interface FileSystemContextType {
  fileSystem: Record<string, FileItem[]>;
  addFile: (path: string, file: FileItem) => void;
  createFolder: (path: string, folderName: string) => void;
}

export const useFileSystem = (): FileSystemContextType => {
  const [fileSystem, setFileSystem] = useState<Record<string, FileItem[]>>(INITIAL_FS);

  const addFile = useCallback((path: string, file: FileItem) => {
    setFileSystem(prev => {
      const currentFiles = prev[path] || [];
      // Prevent duplicates
      if (currentFiles.find(f => f.name === file.name)) return prev;
      
      const newFS = { ...prev, [path]: [...currentFiles, file] };
      
      // If it's a folder, initialize its content entry if it doesn't exist
      // Note: This simulation uses a flat structure where folder names are unique keys
      if (file.type === 'folder' && !newFS[file.name]) {
         newFS[file.name] = [];
      }
      return newFS;
    });
  }, []);

  const createFolder = useCallback((path: string, folderName: string) => {
      addFile(path, { name: folderName, type: 'folder', date: 'Today' });
  }, [addFile]);

  return { fileSystem, addFile, createFolder };
};