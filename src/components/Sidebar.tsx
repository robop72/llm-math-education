import React, { useState, useRef, useEffect } from 'react';
import { ChatSession } from '../hooks/useChat';

interface Props {
  sessions: ChatSession[];
  currentId: string;
  onNewChat: () => void;
  onLoadSession: (id: string) => void;
  onDeleteSession: (id: string) => void;
  onTogglePin: (id: string) => void;
  dark: boolean;
  onToggleTheme: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

function timeLabel(ts: number) {
  const diff = Date.now() - ts;
  const day = 86400000;
  if (diff < day) return 'Today';
  if (diff < 2 * day) return 'Yesterday';
  if (diff < 7 * day) return 'This week';
  return 'Earlier';
}

function SessionRow({ s, currentId, onLoadSession, onDeleteSession, onTogglePin }: {
  s: ChatSession; currentId: string;
  onLoadSession: (id: string) => void;
  onDeleteSession: (id: string) => void;
  onTogglePin: (id: string) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function close(e: MouseEvent) { if (ref.current && !ref.current.contains(e.target as Node)) setMenuOpen(false); }
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  return (
    <div ref={ref} className={`group relative flex items-center rounded-lg transition-colors cursor-pointer ${s.id === currentId ? 'bg-gray-700/60' : 'hover:bg-gray-800/60'}`}>
      <button onClick={() => onLoadSession(s.id)} className="flex-1 text-left px-3 py-2 text-sm truncate text-gray-300">
        {s.title}
      </button>
      <button
        onClick={e => { e.stopPropagation(); setMenuOpen(o => !o); }}
        className="opacity-0 group-hover:opacity-100 p-1.5 mr-1 rounded text-gray-500 hover:text-gray-300 transition-colors"
      >
        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
          <circle cx="5" cy="12" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="19" cy="12" r="2" />
        </svg>
      </button>
      {menuOpen && (
        <div className="absolute right-0 top-full mt-1 z-50 bg-gray-800 border border-gray-700 rounded-lg shadow-xl py-1 min-w-[130px]">
          <button onClick={() => { onTogglePin(s.id); setMenuOpen(false); }} className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700">
            {s.pinned ? 'Unpin' : 'Pin'}
          </button>
          <button onClick={() => { onDeleteSession(s.id); setMenuOpen(false); }} className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-gray-700">
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

export default function Sidebar({ sessions, currentId, onNewChat, onLoadSession, onDeleteSession, onTogglePin, dark, onToggleTheme, isOpen, onToggle }: Props) {
  const [settingsOpen, setSettingsOpen] = useState(false);

  const withMessages = sessions.filter(s => s.messages.length > 0);
  const pinned = withMessages.filter(s => s.pinned);
  const unpinned = withMessages.filter(s => !s.pinned);
  const groups: Record<string, ChatSession[]> = {};
  for (const s of unpinned) {
    const label = timeLabel(s.createdAt);
    if (!groups[label]) groups[label] = [];
    groups[label].push(s);
  }
  const groupOrder = ['Today', 'Yesterday', 'This week', 'Earlier'];

  return (
    <aside className={`flex-shrink-0 flex flex-col h-full bg-[#0f1117] border-r border-gray-800 transition-all duration-300 ${isOpen ? 'w-[280px]' : 'w-14'}`}>

      {/* Logo row */}
      <div className={`flex items-center px-4 pt-5 pb-3 ${isOpen ? 'justify-between' : 'justify-center'}`}>
        {isOpen && (
          <div className="flex items-center gap-2">
            {/* Voxii globe icon */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center shadow-lg">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 2a10 10 0 100 20A10 10 0 0012 2z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2 12h20M12 2c-2.5 3-4 6.5-4 10s1.5 7 4 10M12 2c2.5 3 4 6.5 4 10s-1.5 7-4 10" />
              </svg>
            </div>
            <span className="text-white font-semibold text-base tracking-tight">voxii <span className="text-blue-400">AI</span></span>
          </div>
        )}
        <div className="flex items-center gap-1">
          <button onClick={onToggle} className="p-1.5 rounded-full hover:bg-gray-800 text-gray-500 hover:text-gray-300 transition-colors" title={isOpen ? 'Collapse' : 'Expand'}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? 'M15 19l-7-7 7-7' : 'M9 5l7 7-7 7'} />
            </svg>
          </button>
          {isOpen && (
            <button className="p-1.5 rounded-full hover:bg-gray-800 text-gray-500 hover:text-gray-300 transition-colors" title="Search">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* New Chat */}
      <div className="px-3 mb-3">
        <button onClick={onNewChat} className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-200 hover:bg-gray-800 transition-colors ${!isOpen ? 'justify-center' : ''}`} title="New Chat">
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {isOpen && <span>New Chat</span>}
        </button>
      </div>

      {/* Chat history */}
      {isOpen && (
        <>
          <div className="px-4 mb-1">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Chat History</p>
          </div>
          <div className="flex-1 overflow-y-auto px-3 space-y-3 scrollbar-none pb-2">
            {pinned.length > 0 && (
              <div>
                <p className="text-xs text-gray-600 px-2 mb-1">Pinned</p>
                {pinned.map(s => <SessionRow key={s.id} s={s} currentId={currentId} onLoadSession={onLoadSession} onDeleteSession={onDeleteSession} onTogglePin={onTogglePin} />)}
              </div>
            )}
            {groupOrder.map(label => {
              const group = groups[label];
              if (!group?.length) return null;
              return (
                <div key={label}>
                  <p className="text-xs text-gray-600 px-2 mb-1">{label}</p>
                  {group.map(s => <SessionRow key={s.id} s={s} currentId={currentId} onLoadSession={onLoadSession} onDeleteSession={onDeleteSession} onTogglePin={onTogglePin} />)}
                </div>
              );
            })}
            {withMessages.length === 0 && <p className="text-xs text-gray-600 px-2 italic">No chats yet</p>}
          </div>
        </>
      )}
      {!isOpen && <div className="flex-1" />}

      {/* Bottom: Parent Portal + Settings */}
      {isOpen && (
        <div className="border-t border-gray-800 px-3 py-3 space-y-1">
          <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-gray-400 hover:bg-gray-800 transition-colors">
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Parent Portal
          </button>
          <button onClick={() => setSettingsOpen(o => !o)} className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm text-gray-400 hover:bg-gray-800 transition-colors">
            <span className="flex items-center gap-2.5">
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Settings
            </span>
            <svg className={`w-3.5 h-3.5 transition-transform ${settingsOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {settingsOpen && (
            <div className="px-3 py-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">{dark ? 'Dark mode' : 'Light mode'}</span>
                <button onClick={onToggleTheme} className={`relative w-9 h-5 rounded-full transition-colors ${dark ? 'bg-blue-500' : 'bg-gray-600'}`}>
                  <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${dark ? 'translate-x-4' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </aside>
  );
}
