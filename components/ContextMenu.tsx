import React, { useEffect, useRef } from 'react';

export interface ContextMenuOption {
  label: string;
  action: () => void;
  disabled?: boolean;
  separator?: boolean;
}

export interface ContextMenuProps {
  x: number;
  y: number;
  options: ContextMenuOption[];
  onClose: () => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, options, onClose }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose();
      }
    };
    // Use mousedown to catch clicks before they trigger other actions
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  // Adjust position to stay within viewport
  const style: React.CSSProperties = {
    top: Math.min(y, window.innerHeight - (options.length * 30 + 20)),
    left: Math.min(x, window.innerWidth - 200),
  };

  return (
    <div 
      ref={ref}
      className="fixed z-[9999] w-48 bg-white/90 backdrop-blur-xl border border-gray-200/50 rounded-lg shadow-xl py-1.5 flex flex-col text-sm text-gray-800 animate-in fade-in zoom-in-95 duration-100 origin-top-left"
      style={style}
    >
      {options.map((opt, i) => (
        opt.separator ? (
          <div key={i} className="h-px bg-gray-200 my-1 mx-3" />
        ) : (
          <button
            key={i}
            disabled={opt.disabled}
            onClick={(e) => {
              e.stopPropagation();
              opt.action();
              onClose();
            }}
            className="text-left px-4 py-1 hover:bg-blue-500 hover:text-white disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-gray-800 transition-colors w-full cursor-default"
          >
            {opt.label}
          </button>
        )
      ))}
    </div>
  );
};