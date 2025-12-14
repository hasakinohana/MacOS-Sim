import React, { useState, useEffect, useRef } from 'react';
import { WindowState } from '../types';
import { Minus, X, Square } from 'lucide-react';

interface WindowProps {
  windowState: WindowState;
  onClose: (id: string) => void;
  onMinimize: (id: string) => void;
  onMaximize: (id: string) => void;
  onFocus: (id: string) => void;
  onMove: (id: string, x: number, y: number) => void;
  children: React.ReactNode;
}

export const Window: React.FC<WindowProps> = ({ 
  windowState, 
  onClose, 
  onMinimize, 
  onMaximize,
  onFocus, 
  onMove,
  children 
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);

  const handlePointerDown = (e: React.PointerEvent) => {
    // Only drag if clicking the header (which will be the first child typically, handled via event bubbling check or explicit area)
    // We'll attach this to the header element, so no check needed here really, 
    // but we need to ensure we call onFocus first.
    onFocus(windowState.id);
    
    // Prevent dragging if maximized
    if (windowState.isMaximized) return;

    if ((e.target as HTMLElement).closest('.window-controls')) return;

    setIsDragging(true);
    setDragOffset({
      x: e.clientX - windowState.position.x,
      y: e.clientY - windowState.position.y
    });
    
    // Capture pointer to track movement even if mouse leaves the div
    (e.target as Element).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    
    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;
    
    onMove(windowState.id, newX, newY);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    (e.target as Element).releasePointerCapture(e.pointerId);
  };

  // Animations styles
  const transitionClass = isDragging ? 'transition-none' : 'transition-all duration-200 ease-out';
  const scaleClass = windowState.isOpen ? 'scale-100 opacity-100' : 'scale-90 opacity-0';
  const minimizeClass = windowState.isMinimized ? 'translate-y-[200px] scale-0 opacity-0' : '';

  if (!windowState.isOpen) return null;

  return (
    <div
      ref={windowRef}
      className={`absolute flex flex-col rounded-lg shadow-2xl overflow-hidden border border-black/10 ${transitionClass} ${scaleClass} ${minimizeClass}`}
      style={{
        transform: `translate(${windowState.position.x}px, ${windowState.position.y}px)`,
        width: windowState.size.width,
        height: windowState.size.height,
        zIndex: windowState.zIndex,
      }}
      onPointerDown={() => onFocus(windowState.id)}
    >
      {/* Window Header */}
      <div 
        className="h-8 bg-[#e9e8e6] border-b border-[#d1d1d1] flex items-center justify-between px-3 select-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <div className="flex items-center space-x-2 window-controls">
          <button onClick={(e) => { e.stopPropagation(); onClose(windowState.id); }} className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E] hover:bg-[#FF5F56]/80 flex items-center justify-center group">
            <X size={8} className="text-black/50 opacity-0 group-hover:opacity-100" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); onMinimize(windowState.id); }} className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123] hover:bg-[#FFBD2E]/80 flex items-center justify-center group">
            <Minus size={8} className="text-black/50 opacity-0 group-hover:opacity-100" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); onMaximize(windowState.id); }} className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29] hover:bg-[#27C93F]/80 flex items-center justify-center group">
            <Square size={8} className="text-black/50 opacity-0 group-hover:opacity-100 transform rotate-45 scale-75" />
          </button>
        </div>
        <div className="flex-1 text-center text-xs font-semibold text-gray-500 pointer-events-none">
          {windowState.title}
        </div>
        <div className="w-14"></div> {/* Spacer for centering title */}
      </div>

      {/* Window Content */}
      <div className="flex-1 relative bg-white">
        {/* An invisible overlay to capture clicks when window is not active, bringing it to front without interacting with content immediately if desired.
            However, standard behavior allows interaction immediately. We just need to ensure clicks inside trigger focus. 
        */}
        {children}
      </div>
    </div>
  );
};