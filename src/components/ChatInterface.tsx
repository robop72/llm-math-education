import React, { useRef, useEffect, useState } from 'react';
import { Mic, Send } from 'lucide-react';
import ExpertMessage from './ExpertMessage';
import { Message, useChat } from '../hooks/useChat';

interface Props {
  yearLevel: string;
  subject: string;
  isNaplanMode?: boolean;
  sessionId?: string;
}

const TOPIC_CARDS: Record<string, { emoji: string; title: string; desc: string }[]> = {
  Maths: [
    { emoji: '📐', title: 'Algebra', desc: 'Equations, expressions, functions' },
    { emoji: '📊', title: 'Statistics', desc: 'Data, probability, distributions' },
    { emoji: '📏', title: 'Geometry', desc: 'Shapes, proofs, measurement' },
  ],
  English: [
    { emoji: '✍️', title: 'Language', desc: 'Text structure, vocabulary, grammar' },
    { emoji: '📗', title: 'Literature', desc: 'Examining contexts, responding to texts' },
    { emoji: '📕', title: 'Literacy', desc: 'Interacting, reading, writing, creating' },
  ],
  Science: [
    { emoji: '⚗️', title: 'Chemistry', desc: 'Matter, reactions, periodic table' },
    { emoji: '⚡', title: 'Physics', desc: 'Forces, energy, waves, electricity' },
    { emoji: '🧬', title: 'Biology', desc: 'Cells, genetics, ecosystems' },
  ],
};

function ThinkingBubble() {
  return (
    <div className="voxii-thinking-bubble">
      {[0, 150, 300].map(delay => (
        <span key={delay} className="w-2 h-2 bg-gray-400 rounded-full" style={{ animation: `thinking-dot 1.2s ease-in-out ${delay}ms infinite` }} />
      ))}
    </div>
  );
}

function WelcomeScreen({ yearLevel, subject, onPrompt }: { yearLevel: string; subject: string; onPrompt: (t: string) => void }) {
  const cards = TOPIC_CARDS[subject] ?? TOPIC_CARDS['Maths'];
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 max-w-3xl mx-auto w-full">
      <p className="text-gray-400 text-lg mb-1">Hello,</p>
      <h1 className="text-3xl font-bold text-white mb-1">I'm your {subject} study friend</h1>
      <p className="text-gray-500 text-sm mb-8">Secondary School · {yearLevel} · Victorian Curriculum 2.0</p>

      <div className="grid grid-cols-3 gap-3 w-full mb-6">
        {cards.map(c => (
          <button
            key={c.title}
            onClick={() => onPrompt(`Tell me about ${c.title} in ${subject}`)}
            className="text-left p-4 rounded-2xl bg-gray-800/60 hover:bg-gray-700/60 border border-gray-700/50 transition-colors"
          >
            <div className="text-xl mb-2">{c.emoji} <span className="text-sm font-semibold text-white ml-1">{c.title}</span></div>
            <p className="text-xs text-gray-400">{c.desc}</p>
          </button>
        ))}
      </div>

      <div className="w-full flex items-start gap-3 p-4 rounded-2xl border border-blue-700/50 bg-blue-900/20">
        <span className="text-blue-400 mt-0.5">🔒</span>
        <p className="text-sm text-gray-300">
          <span className="font-semibold text-white">Stay safe:</span> Don't share your full name, school, phone number, or address in this chat. Voxii is here for {subject.toLowerCase()} only.
        </p>
      </div>
    </div>
  );
}

export default function ChatInterface({ yearLevel, subject, isNaplanMode = false }: Props) {
  const { messages, isLoading, sendMessage, cancelMessage } = useChat({ yearLevel, subject, isNaplanMode });
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isLoading]);

  async function handleSend() {
    const text = input.trim();
    if (!text || isLoading) return;
    setInput('');
    await sendMessage(text);
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  }

  const hasMessages = messages.length > 0;

  return (
    <div className="flex flex-col h-full bg-gray-950">
      {/* Messages or welcome */}
      {hasMessages ? (
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-6 flex flex-col scrollbar-none">
          {messages.map((msg: Message) => (
            <div key={msg.id} className={msg.role === 'user' ? 'voxii-bubble-user' : 'voxii-bubble-tutor'}>
              {msg.role === 'tutor' ? <ExpertMessage text={msg.text} /> : <p className="whitespace-pre-wrap text-sm">{msg.text}</p>}
            </div>
          ))}
          {isLoading && <ThinkingBubble />}
        </div>
      ) : (
        <WelcomeScreen yearLevel={yearLevel} subject={subject} onPrompt={text => { setInput(text); textareaRef.current?.focus(); }} />
      )}

      {/* Input bar */}
      <div className="px-6 pb-4 pt-2 bg-gray-950">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-end gap-2 bg-gray-800/80 border border-gray-700 rounded-3xl px-4 py-3 focus-within:border-gray-600 transition-colors">
            {/* Read Aloud pill */}
            <button className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-700 text-gray-300 text-xs font-medium hover:bg-gray-600 transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
              </svg>
              Read Aloud
            </button>

            <textarea
              ref={textareaRef}
              rows={1}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder={`Ask Voxii a ${subject} question...`}
              className="flex-1 bg-transparent outline-none resize-none text-sm text-gray-100 placeholder-gray-500 max-h-32 scrollbar-none"
              style={{ scrollbarWidth: 'none' }}
              disabled={isLoading}
            />

            <div className="flex items-center gap-2 flex-shrink-0">
              <button className="p-1.5 text-gray-500 hover:text-gray-300 transition-colors" title="Voice input">
                <Mic size={18} />
              </button>
              <button
                onClick={isLoading ? cancelMessage : handleSend}
                disabled={!isLoading && !input.trim()}
                className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <Send size={14} className="text-gray-900" />
              </button>
            </div>
          </div>
          <p className="text-[10px] text-gray-600 text-center mt-2">Enter to send · Shift+Enter for new line</p>
        </div>
      </div>
    </div>
  );
}
