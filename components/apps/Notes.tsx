import React, { useState } from 'react';
import { Plus, Trash2, Search, List } from 'lucide-react';

interface Note {
  id: string;
  title: string;
  content: string;
  date: string;
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

export const NotesApp: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>(INITIAL_NOTES);
  const [selectedNoteId, setSelectedNoteId] = useState<string>(INITIAL_NOTES[0].id);
  const [searchQuery, setSearchQuery] = useState('');

  const selectedNote = notes.find(n => n.id === selectedNoteId);

  const handleUpdateNote = (content: string) => {
    setNotes(prev => prev.map(note => {
      if (note.id === selectedNoteId) {
        // Simple heuristic: First line is title
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
           <button onClick={handleDeleteNote} className="p-1.5 hover:bg-gray-200 rounded text-gray-500 disabled:opacity-30" disabled={!selectedNoteId}>
             <Trash2 size={18} />
           </button>
           <button onClick={handleAddNote} className="p-1.5 hover:bg-gray-200 rounded text-gray-500">
             <Plus size={18} />
           </button>
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
            <div className="text-xs text-gray-400 text-center py-3 select-none">
              {selectedNote.date}
            </div>
            <textarea
              value={selectedNote.content}
              onChange={(e) => handleUpdateNote(e.target.value)}
              className="flex-1 w-full p-6 pt-2 resize-none outline-none border-none text-base leading-relaxed text-gray-800 placeholder-gray-300"
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