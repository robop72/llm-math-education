import React, { useState, useEffect } from 'react';
import ChatInterface from './components/ChatInterface';
import Sidebar from './components/Sidebar';
import ParentPin from './components/ParentPin';
import ParentDashboard from './components/ParentDashboard';
import { useTheme } from './hooks/useTheme';
import { useChat } from './hooks/useChat';
import { YearLevel, Subject, ALLOWED_YEAR_LEVELS, ALLOWED_SUBJECTS } from './lib/curriculumConfig';

type View = 'chat' | 'parent-pin' | 'parent-dashboard';

export default function App() {
  const { dark, toggle } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [yearLevel, setYearLevel] = useState<YearLevel>(9);
  const [subject, setSubject] = useState<Subject>('Maths');
  const [isNaplanMode, setIsNaplanMode] = useState(false);
  const [view, setView] = useState<View>('chat');

  useEffect(() => {
    if (view === 'parent-pin' && sessionStorage.getItem('voxii-parent-auth') === 'true') {
      setView('parent-dashboard');
    }
  }, [view]);

  const {
    sessions, currentId, messages, isLoading,
    sendMessage, startNewChat, loadSession, deleteSession,
    togglePin, renameSession, cancelMessage,
  } = useChat({ yearLevel, subject, isNaplanMode });

  if (view === 'parent-pin') return <ParentPin onSuccess={() => setView('parent-dashboard')} onBack={() => setView('chat')} />;
  if (view === 'parent-dashboard') return <ParentDashboard onBack={() => setView('chat')} />;

  return (
    <div className="flex h-screen bg-gray-950 overflow-hidden">
      <Sidebar
        sessions={sessions}
        currentId={currentId}
        onNewChat={startNewChat}
        onLoadSession={loadSession}
        onDeleteSession={deleteSession}
        onTogglePin={togglePin}
        onRenameSession={renameSession}
        dark={dark}
        onToggleTheme={toggle}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(o => !o)}
        onOpenParentPortal={() => setView('parent-pin')}
      />

      <div className="flex flex-col flex-1 min-w-0">
        {/* Top selector bar */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-800 bg-gray-950 overflow-x-auto scrollbar-none flex-shrink-0">
          <select
            value={yearLevel}
            onChange={e => setYearLevel(Number(e.target.value) as YearLevel)}
            className="flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-medium bg-gray-800 text-gray-300 outline-none cursor-pointer hover:bg-gray-700 transition-colors border border-gray-700"
          >
            {ALLOWED_YEAR_LEVELS.map(y => (
              <option key={y} value={y}>Year {y}</option>
            ))}
          </select>

          <div className="w-px h-5 bg-gray-800 flex-shrink-0" />

          {ALLOWED_SUBJECTS.map(s => (
            <button
              key={s}
              onClick={() => { setSubject(s); if (s === 'Science') setIsNaplanMode(false); }}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                subject === s
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700 border border-gray-700'
              }`}
            >
              {s}
            </button>
          ))}

          {subject !== 'Science' && (
            <>
              <div className="w-px h-5 bg-gray-800 flex-shrink-0" />
              <button
                onClick={() => setIsNaplanMode(m => !m)}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  isNaplanMode
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700 border border-gray-700'
                }`}
              >
                NAPLAN
              </button>
            </>
          )}

          <div className="ml-auto flex-shrink-0">
            <img src="/voxii-logo.png" alt="Voxii AI" className="h-8 object-contain" />
          </div>
        </div>

        <div className="flex-1 min-h-0">
          <ChatInterface
            yearLevel={yearLevel}
            subject={subject}
            isNaplanMode={isNaplanMode}
            messages={messages}
            isLoading={isLoading}
            sendMessage={sendMessage}
            cancelMessage={cancelMessage}
          />
        </div>
      </div>
    </div>
  );
}
