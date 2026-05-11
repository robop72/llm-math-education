import React, { useState } from 'react';
import ChatInterface from './components/ChatInterface';
import Sidebar from './components/Sidebar';
import { useTheme } from './hooks/useTheme';
import { useChat } from './hooks/useChat';

const YEAR_LEVELS = ['Year 7', 'Year 8', 'Year 9', 'Year 10', 'Year 11', 'Year 12'];
const SUBJECTS = ['English', 'Maths', 'Science'];

export default function App() {
  const { dark, toggle } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [yearLevel, setYearLevel] = useState('Year 9');
  const [subject, setSubject] = useState('Maths');

  const { sessions, currentId, messages, isLoading, sendMessage, startNewChat, loadSession, deleteSession, togglePin, cancelMessage } = useChat({ yearLevel, subject });

  return (
    <div className="flex h-screen bg-gray-950 overflow-hidden">
      <Sidebar
        sessions={sessions}
        currentId={currentId}
        onNewChat={startNewChat}
        onLoadSession={loadSession}
        onDeleteSession={deleteSession}
        onTogglePin={togglePin}
        dark={dark}
        onToggleTheme={toggle}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(o => !o)}
      />

      <div className="flex flex-col flex-1 min-w-0">
        {/* Top selector bar */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-800 bg-gray-950 overflow-x-auto scrollbar-none flex-shrink-0">
          <select
            value={yearLevel}
            onChange={e => setYearLevel(e.target.value)}
            className="flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-medium bg-gray-800 text-gray-300 outline-none cursor-pointer hover:bg-gray-700 transition-colors border border-gray-700"
          >
            {YEAR_LEVELS.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          <div className="w-px h-5 bg-gray-800 flex-shrink-0" />
          {SUBJECTS.map(s => (
            <button
              key={s}
              onClick={() => setSubject(s)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                subject === s
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700 border border-gray-700'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="flex-1 min-h-0">
          <ChatInterface
            yearLevel={yearLevel}
            subject={subject}
          />
        </div>
      </div>
    </div>
  );
}
