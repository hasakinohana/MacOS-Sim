import React, { useState, useEffect, useRef } from 'react';

const WELCOME_MSG = `Last login: ${new Date().toUTCString()} on ttys000
MacOS Web [Version 14.2.1]
(c) 2024 Apple Inc. All rights reserved.

Type 'help' for a list of commands.
`;

export const TerminalApp: React.FC = () => {
  const [history, setHistory] = useState<string[]>([WELCOME_MSG]);
  const [currentLine, setCurrentLine] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const executeCommand = (cmd: string) => {
    const args = cmd.trim().split(' ');
    const command = args[0].toLowerCase();
    
    let response = '';

    switch (command) {
      case 'help':
        response = `Available commands:
  help     - Show this help message
  clear    - Clear the terminal screen
  date     - Show current date
  echo     - Print arguments
  whoami   - Print current user
  ls       - List directory contents
  gemini   - Tip: Use the 'Gemini Assistant' app for AI chat!`;
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
      case 'ls':
        response = 'Documents  Downloads  Projects  Desktop  Public';
        break;
      case '':
        break;
      default:
        response = `zsh: command not found: ${command}`;
    }

    if (response) {
      setHistory(prev => [...prev, `guest_user@macbook ~ % ${cmd}`, response]);
    } else {
      setHistory(prev => [...prev, `guest_user@macbook ~ % ${cmd}`]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      executeCommand(currentLine);
      setCurrentLine('');
    }
  };

  return (
    <div className="h-full w-full bg-[#1e1e1e] text-white p-2 font-mono text-sm overflow-auto rounded-b-lg">
      <div className="whitespace-pre-wrap text-gray-300">
        {history.map((line, i) => (
          <div key={i} className="mb-1">{line}</div>
        ))}
      </div>
      <div className="flex items-center">
        <span className="text-green-400 mr-2">guest_user@macbook ~ %</span>
        <input
          type="text"
          value={currentLine}
          onChange={(e) => setCurrentLine(e.target.value)}
          onKeyDown={handleKeyDown}
          className="bg-transparent border-none outline-none flex-grow text-white caret-gray-400"
          autoFocus
        />
      </div>
      <div ref={bottomRef} />
    </div>
  );
};