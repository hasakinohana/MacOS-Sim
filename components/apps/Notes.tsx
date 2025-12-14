import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Search, List, Save } from 'lucide-react';
import { FileSystemContextType } from '../../hooks/useFileSystem';

interface Note {
  id: string;
  title: string;
  content: string;
  date: string;
  originPath?: string; // Path where this note is saved as a file
  originName?: string; // Filename if saved
}

interface NotesAppProps {
  launchProps?: { 
    initialNote?: { title: string, content: string },
    filePath?: string
  };
  fs?: FileSystemContextType;
}

const INITIAL_NOTES: Note[] = [
  { 
    id: '1', 
    title: 'Welcome to Notes', 
    content: 'This is a simple notes app simulation.\n\nYou can create new notes, edit existing ones, and delete them.',
    date: 'Today'
  },
  { 
    id: '2', 
    title: 'Project Ideas', 
    content: '- Build a macOS clone in React\n- Integrate Gemini AI\n- Create a simulated file system\n- Add drag and drop support',
    date: 'Yesterday'
  },
  {
    id: '3',
    title: 'Shopping List',
    content: 'Milk\nEggs\nCoffee beans\nAvocados\nSourdough bread',
    date: 'Oct 20'
  }
];

export const NotesApp: React.FC<NotesAppProps> = ({ launchProps, fs }) => {
  const [notes, setNotes] = useState<Note[]>(INITIAL_NOTES);
  const [selectedNoteId, setSelectedNoteId] = useState<string>(INITIAL_NOTES[0].id);
  const [searchQuery, setSearchQuery] = useState('');

  // Handle opening files from Finder/Desktop
  useEffect(() => {
    if (launchProps?.initialNote) {
       const { title, content } = launchProps.initialNote;
       const path = launchProps.filePath;

       setNotes(prev => {
         // Check if this file is already open to avoid duplicates
         const existingNoteIndex = prev.findIndex(n => 
           n.originPath === path && n.originName === title
         );

         const newNote: Note = {
           id: existingNoteIndex >= 0 ? prev[existingNoteIndex].id : `imported-${Date.now()}`,
           title: title,
           content: content,
           date: 'Imported',
           originPath: path,
           originName: title
         };

         if (existingNoteIndex >= 0) {
           // Update existing note with fresh content from file system
           const updatedNotes = [...prev];
           updatedNotes[existingNoteIndex] = newNote;
           // We need to defer setting ID to ensure render cycle catches up? 
           // Actually setting state here is fine.
           return updatedNotes;
         }

         return [newNote, ...prev];
       });

       // Find the ID we just used/created
       // Since setNotes is async, we can't rely on 'notes' state immediately.
       // However, we know the logic we just used.
       setNotes(currentNotes => {
          const targetNote = currentNotes.find(n => n.originPath === path && n.originName === title);
          if (targetNote) setSelectedNoteId(targetNote.id);
          return currentNotes;
       });
    }
  }, [launchProps]);

  const selectedNote = notes.find(n => n.id === selectedNoteId);

  const handleUpdateNote = (content: string) => {
    setNotes(prev => prev.map(note => {
      if (note.id === selectedNoteId) {
        // Simple heuristic: First line is title
        // We only update the display title, not the originName (filename)
        const title = content.split('\n')[0] || 'New Note';
        return { ...note, content, title };
      }
      return note;
    }));
  };

  const handleAddNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'New Note',
      content: '',
      date: 'Today'
    };
    setNotes([newNote, ...notes]);
    setSelectedNoteId(newNote.id);
  };

  const handleDeleteNote = () => {
    const newNotes = notes.filter(n => n.id !== selectedNoteId);
    setNotes(newNotes);
    if (newNotes.length > 0) {
      setSelectedNoteId(newNotes[0].id);
    } else {
      setSelectedNoteId('');
    }
  };

  const handleSave = () => {
    if (!selectedNote || !fs) return;

    if (selectedNote.originPath && selectedNote.originName) {
      // Update existing file
      fs.updateFile(selectedNote.originPath, {
        name: selectedNote.originName,
        content: selectedNote.content,
        type: 'file',
        date: 'Today',
        size: `${selectedNote.content.length} B`
      });
      // Visual feedback
      const originalTitle = selectedNote.title;
      setNotes(prev => prev.map(n => n.id === selectedNoteId ? { ...n, title: 'Saved!' } : n));
      setTimeout(() => {
         setNotes(prev => prev.map(n => n.id === selectedNoteId ? { ...n, title: originalTitle } : n));
      }, 1000);
    } else {
      // Save as new file in Documents
      // Sanitize filename
      const safeTitle = selectedNote.title.replace(/[^a-z0-9]/gi, '_').substring(0, 20) || 'Untitled';
      const fileName = `${safeTitle}.txt`;
      const targetPath = 'Documents';
      
      fs.addFile(targetPath, {
        name: fileName,
        content: selectedNote.content,
        type: 'file',
        date: 'Today',
        size: `${selectedNote.content.length} B`
      });
      
      // Update local note to link to this new file
      setNotes(prev => prev.map(n => n.id === selectedNoteId ? { ...n, originPath: targetPath, originName: fileName } : n));
      
      alert(`Saved to ${targetPath}/${fileName}`);
    }
  };

  const filteredNotes = notes.filter(n => 
    n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    n.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-full w-full bg-white text-gray-800 rounded-b-lg overflow-hidden">
      {/* Sidebar */}
      <div className="w-56 bg-gray-50 border-r border-gray-200 flex flex-col">
        {/* Toolbar */}
        <div className="h-12 border-b border-gray-200 flex items-center justify-between px-3 space-x-2 bg-gray-100/50">
           <div className="flex space-x-1">
             <button className="p-1.5 hover:bg-gray-200 rounded text-gray-500" title="View">
               <List size={18} />
             </button>
           </div>
           <div className="flex items-center space-x-1">
             <button onClick={handleDeleteNote} className="p-1.5 hover:bg-gray-200 rounded text-gray-500 disabled:opacity-30" disabled={!selectedNoteId} title="Delete">
               <Trash2 size={18} />
             </button>
             <button onClick={handleSave} className="p-1.5 hover:bg-gray-200 rounded text-gray-500 disabled:opacity-30" disabled={!selectedNoteId} title="Save">
               <Save size={18} />
             </button>
             <button onClick={handleAddNote} className="p-1.5 hover:bg-gray-200 rounded text-gray-500" title="New Note">
               <Plus size={18} />
             </button>
           </div>
        </div>

        {/* Search */}
        <div className="p-2 border-b border-gray-200 bg-white">
           <div className="relative">
             <Search size={14} className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400" />
             <input 
               type="text" 
               placeholder="Search" 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="w-full pl-8 pr-2 py-1 bg-gray-100 border-none rounded-md text-sm focus:ring-1 focus:ring-yellow-400 focus:outline-none"
             />
           </div>
        </div>

        {/* Note List */}
        <div className="flex-1 overflow-y-auto">
          {filteredNotes.map(note => (
            <div 
              key={note.id}
              onClick={() => setSelectedNoteId(note.id)}
              className={`p-3 border-b border-gray-100 cursor-default group ${
                selectedNoteId === note.id ? 'bg-yellow-100' : 'hover:bg-gray-100'
              }`}
            >
              <h4 className={`font-semibold text-sm truncate mb-0.5 ${selectedNoteId === note.id ? 'text-yellow-800' : 'text-gray-900'}`}>
                {note.title || 'New Note'}
              </h4>
              <div className="flex space-x-2 text-xs text-gray-500">
                <span>{note.date}</span>
                <span className="truncate flex-1 text-gray-400">{note.content.replace(/\n/g, ' ').substring(0, 30)}</span>
              </div>
            </div>
          ))}
          {filteredNotes.length === 0 && (
            <div className="p-4 text-center text-sm text-gray-400">
              No notes found
            </div>
          )}
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 flex flex-col bg-white">
        {selectedNote ? (
          <div className="flex-1 flex flex-col h-full relative">
            <div className="text-xs text-gray-400 text-center py-3 select-none flex justify-center items-center space-x-2">
              <span>{selectedNote.date}</span>
              {selectedNote.originName && <span className="bg-gray-100 px-1.5 rounded text-gray-500">{selectedNote.originName}</span>}
            </div>
            <textarea
              value={selectedNote.content}
              onChange={(e) => handleUpdateNote(e.target.value)}
              className="flex-1 w-full p-6 pt-2 resize-none outline-none border-none text-base leading-relaxed text-gray-800 placeholder-gray-300 font-sans"
              placeholder="Type your note here..."
            />
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400 text-sm select-none">
            No note selected
          </div>
        )}
      </div>
    </div>
  );
};