import React, { useState, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import ChatInterface from './components/ChatInterface';
import Sidebar from './components/Sidebar';

const YEAR_LEVELS = ['Year 7', 'Year 8', 'Year 9', 'Year 10', 'Year 11', 'Year 12'];
const SUBJECTS = ['English', 'Maths', 'Science'];

export default function App() {
  const [dark, setDark] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [yearLevel, setYearLevel] = useState('Year 9');
  const [subject, setSubject] = useState('Maths');
  const [chatKey, setChatKey] = useState(0);
  const sessionId = useRef(uuidv4()).current;

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  function handleNewChat() {
    setChatKey(k => k + 1);
  }

  return (
    <div className="flex h-screen bg-white dark:bg-gray-950 overflow-hidden">
      <Sidebar
        dark={dark}
        onToggleTheme={() => setDark(d => !d)}
        onNewChat={handleNewChat}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(o => !o)}
      />

      <div className="flex flex-col flex-1 min-w-0">
        {/* Top selector bar */}
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-x-auto scrollbar-none flex-shrink-0">
          <select
            value={yearLevel}
            onChange={e => setYearLevel(e.target.value)}
            className="flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 outline-none cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            {YEAR_LEVELS.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          <div className="w-px h-5 bg-gray-200 dark:bg-gray-700 flex-shrink-0" />
          {SUBJECTS.map(s => (
            <button
              key={s}
              onClick={() => setSubject(s)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                subject === s
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="flex-1 min-h-0">
          <ChatInterface key={chatKey} yearLevel={yearLevel} subject={subject} sessionId={sessionId} />
        </div>
      </div>
    </div>
  );
}
