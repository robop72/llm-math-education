import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2, Sparkles } from 'lucide-react';
import ExpertMessage from './ExpertMessage';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface Props {
  yearLevel: string;
  subject: string;
  sessionId: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'https://voxii-tutor-backend-919882895306.australia-southeast1.run.app';

export default function ChatInterface({ yearLevel, subject, sessionId }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Hello! I'm your Expert ${yearLevel} ${subject} tutor. I've reviewed the VCAA curriculum for our session — what would you like to master today?`,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          message: text,
          year_level: yearLevel,
          subject,
        }),
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      const reply = data.response ?? data.message ?? data.content ?? JSON.stringify(data);
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: "I'm having a quick look at my textbooks. Please try sending that again in a second!" },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-screen max-w-5xl mx-auto bg-slate-50 shadow-2xl">
      {/* Header */}
      <div className="p-5 border-b bg-white flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Sparkles className="text-white" size={20} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 leading-none">Voxii Master Tutor</h1>
            <p className="text-xs text-slate-500 mt-1 font-medium uppercase tracking-tighter">
              {yearLevel} • {subject} • VCAA Aligned
            </p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full border border-green-100">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-[10px] font-bold text-green-700 uppercase">Live Pipeline Connected</span>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-8 scroll-smooth">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
              msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-600'
            }`}>
              {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
            </div>
            <div className={`max-w-[85%] sm:max-w-[70%] rounded-2xl p-5 shadow-sm ${
              msg.role === 'user'
                ? 'bg-blue-600 text-white rounded-tr-none'
                : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'
            }`}>
              {msg.role === 'assistant' ? (
                <ExpertMessage text={msg.content} />
              ) : (
                <p className="whitespace-pre-wrap font-medium">{msg.content}</p>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center">
              <Bot size={20} className="text-blue-500" />
            </div>
            <div className="bg-white border border-slate-100 rounded-2xl p-5 rounded-tl-none flex items-center gap-3 text-slate-400 italic">
              <Loader2 size={18} className="animate-spin text-blue-500" />
              <span>Analyzing curriculum data...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-6 bg-white border-t">
        <form onSubmit={sendMessage} className="relative max-w-4xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={`Ask your ${subject} question...`}
            className="w-full p-4 pr-16 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-slate-50/50"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="absolute right-2 top-2 bg-blue-600 text-white p-2.5 rounded-xl hover:bg-blue-700 disabled:opacity-30 transition-all shadow-lg shadow-blue-500/20"
          >
            <Send size={20} />
          </button>
        </form>
        <div className="mt-3 flex justify-center">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Expert Reasoning v2.0</p>
        </div>
      </div>
    </div>
  );
}
