import React, { useState, useEffect, useRef } from 'react';
import { FileSystemContextType } from '../../hooks/useFileSystem';

interface TerminalAppProps {
  fs: FileSystemContextType;
}

const WELCOME_MSG = `Last login: ${new Date().toUTCString()} on ttys000
MacOS Web [Version 14.2.1]
(c) 2024 Apple Inc. All rights reserved.

Type 'help' for a list of commands.
`;

export const TerminalApp: React.FC<TerminalAppProps> = ({ fs }) => {
  const [history, setHistory] = useState<string[]>([WELCOME_MSG]);
  const [currentLine, setCurrentLine] = useState('');
  const [cwd, setCwd] = useState<string>('~'); // Current Working Directory
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const executeCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim();
    if (!trimmedCmd) {
        setHistory(prev => [...prev, `guest_user@macbook ${cwd} %`]);
        return;
    }
    
    const args = trimmedCmd.split(' ');
    const command = args[0].toLowerCase();
    
    let response = '';

    switch (command) {
      case 'help':
        response = `Available commands:
  help     - Show this help message
  clear    - Clear the terminal screen
  ls       - List directory contents
  cd       - Change directory
  pwd      - Print working directory
  mkdir    - Create a directory
  touch    - Create a file
  whoami   - Print current user
  echo     - Print arguments
  date     - Show current date`;
        break;
      case 'clear':
        setHistory([]);
        return;
      case 'date':
        response = new Date().toString();
        break;
      case 'whoami':
        response = 'guest_user';
        break;
      case 'echo':
        response = args.slice(1).join(' ');
        break;
      case 'pwd':
        response = cwd === '~' ? '/Users/guest_user' : `/Users/guest_user/${cwd.replace('~/', '')}`;
        break;
      case 'ls':
        const files = fs.fileSystem[cwd] || [];
        if (files.length > 0) {
            // Simple column formatting
            response = files.map(f => f.type === 'folder' ? f.name + '/' : f.name).join('  ');
        } else {
            response = ''; // Empty directory
        }
        break;
      case 'cd':
        const target = args[1];
        if (!target || target === '~') {
            setCwd('~');
        } else if (target === '..') {
            if (cwd !== '~') {
                setCwd('~'); 
            }
        } else {
            const currentFiles = fs.fileSystem[cwd] || [];
            const folderExists = currentFiles.find(f => f.name === target && f.type === 'folder');
            
            if (folderExists) {
                // Check if the folder key exists in the shared FS
                if (fs.fileSystem[target]) {
                    setCwd(target);
                } else {
                    response = `cd: permission denied: ${target} (simulation limitation)`;
                }
            } else {
                response = `cd: no such file or directory: ${target}`;
            }
        }
        break;
      case 'mkdir':
        const dirName = args[1];
        if (dirName) {
            fs.createFolder(cwd, dirName);
            response = '';
        } else {
            response = 'mkdir: missing operand';
        }
        break;
      case 'touch':
        const fileName = args[1];
        if (fileName) {
            fs.addFile(cwd, { name: fileName, type: 'file', size: '0 KB', date: 'Today' });
            response = '';
        } else {
            response = 'touch: missing operand';
        }
        break;
      default:
        response = `zsh: command not found: ${command}`;
    }

    setHistory(prev => {
        const newHistory = [...prev, `guest_user@macbook ${cwd} % ${cmd}`];
        if (response) newHistory.push(response);
        return newHistory;
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      executeCommand(currentLine);
      setCurrentLine('');
    }
  };

  return (
    <div className="h-full w-full bg-[#1e1e1e] text-white p-2 font-mono text-sm overflow-auto rounded-b-lg shadow-inner" onClick={() => document.getElementById('term-input')?.focus()}>
      <div className="whitespace-pre-wrap text-gray-300">
        {history.map((line, i) => (
          <div key={i} className="mb-1 leading-snug">{line}</div>
        ))}
      </div>
      <div className="flex items-center">
        <span className="text-green-400 mr-2 shrink-0">guest_user@macbook {cwd} %</span>
        <input
          id="term-input"
          type="text"
          value={currentLine}
          onChange={(e) => setCurrentLine(e.target.value)}
          onKeyDown={handleKeyDown}
          className="bg-transparent border-none outline-none flex-grow text-white caret-gray-400"
          autoFocus
          autoComplete="off"
        />
      </div>
      <div ref={bottomRef} />
    </div>
  );
};