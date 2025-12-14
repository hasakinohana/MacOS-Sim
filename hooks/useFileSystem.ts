import { useState, useCallback, useEffect } from 'react';
import { FILE_SYSTEM as INITIAL_FS } from '../constants';
import { FileItem } from '../types';

export interface FileSystemContextType {
  fileSystem: Record<string, FileItem[]>;
  addFile: (path: string, file: FileItem) => void;
  createFolder: (path: string, folderName: string) => void;
  deleteFile: (path: string, fileName: string) => void;
  updateFile: (path: string, file: FileItem) => void;
  emptyTrash: () => void;
}

const STORAGE_KEY = 'macos-web-filesystem-v1';

export const useFileSystem = (): FileSystemContextType => {
  // Initialize state from localStorage if available, otherwise use default
  const [fileSystem, setFileSystem] = useState<Record<string, FileItem[]>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_FS;
    } catch (e) {
      console.error("Failed to load filesystem from storage", e);
      return INITIAL_FS;
    }
  });

  // Persist to localStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fileSystem));
    } catch (e) {
      console.error("Failed to save filesystem to storage", e);
    }
  }, [fileSystem]);

  const addFile = useCallback((path: string, file: FileItem) => {
    setFileSystem(prev => {
      const currentFiles = prev[path] || [];
      // Prevent duplicates
      if (currentFiles.find(f => f.name === file.name)) return prev;
      
      const newFS = { ...prev, [path]: [...currentFiles, file] };
      
      // If it's a folder, initialize its content entry if it doesn't exist
      if (file.type === 'folder' && !newFS[file.name]) {
         newFS[file.name] = [];
      }
      return newFS;
    });
  }, []);

  const createFolder = useCallback((path: string, folderName: string) => {
      addFile(path, { name: folderName, type: 'folder', date: 'Today' });
  }, [addFile]);

  const deleteFile = useCallback((path: string, fileName: string) => {
    setFileSystem(prev => ({
      ...prev,
      [path]: prev[path]?.filter(f => f.name !== fileName) || []
    }));
  }, []);

  const updateFile = useCallback((path: string, file: FileItem) => {
    setFileSystem(prev => {
      const currentFiles = prev[path] || [];
      const index = currentFiles.findIndex(f => f.name === file.name);
      
      if (index === -1) return prev; // File not found

      const newFiles = [...currentFiles];
      newFiles[index] = { ...newFiles[index], ...file };
      
      return { ...prev, [path]: newFiles };
    });
  }, []);

  const emptyTrash = useCallback(() => {
    setFileSystem(prev => ({
      ...prev,
      'Trash': []
    }));
  }, []);

  return { fileSystem, addFile, createFolder, deleteFile, updateFile, emptyTrash };
};