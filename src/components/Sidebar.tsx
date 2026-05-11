import React, { useState } from 'react';
import { PlusCircle, Moon, Sun, ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  dark: boolean;
  onToggleTheme: () => void;
  onNewChat: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

export default function Sidebar({ dark, onToggleTheme, onNewChat, isOpen, onToggle }: Props) {
  return (
    <aside className={`
      flex-shrink-0 flex flex-col h-full
      bg-[#f0f4f9] dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800
      transition-all duration-300
      ${isOpen ? 'w-60' : 'w-14'}
    `}>
      {/* Toggle button */}
      <div className={`flex pt-5 pb-3 px-3 ${isOpen ? 'justify-between items-center' : 'justify-center'}`}>
        {isOpen && (
          <span className="text-base font-bold text-gray-800 dark:text-gray-100 tracking-tight pl-1">Voxii</span>
        )}
        <button
          onClick={onToggle}
          className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors"
          title={isOpen ? 'Collapse' : 'Expand'}
        >
          {isOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>
      </div>

      {/* New Chat */}
      <div className="px-3 mb-4">
        <button
          onClick={onNewChat}
          className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium
            text-gray-700 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-800 transition-colors
            ${!isOpen ? 'justify-center' : ''}`}
          title="New Chat"
        >
          <PlusCircle size={16} className="shrink-0" />
          {isOpen && <span>New Chat</span>}
        </button>
      </div>

      {isOpen && (
        <div className="px-5 mb-2">
          <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
            Chat History
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-600 italic mt-2">No chats yet</p>
        </div>
      )}

      {/* Spacer */}
      <div className="flex-1" />

      {/* Theme toggle */}
      <div className="border-t border-gray-200 dark:border-gray-800 px-3 py-4">
        <button
          onClick={onToggleTheme}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm
            text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800 transition-colors
            ${!isOpen ? 'justify-center' : ''}`}
          title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {dark ? <Sun size={16} className="shrink-0" /> : <Moon size={16} className="shrink-0" />}
          {isOpen && <span>{dark ? 'Light mode' : 'Dark mode'}</span>}
        </button>
      </div>
    </aside>
  );
}
