import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Bot, Send, X, Sparkles, User, RefreshCw, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  actionButton?: { label: string; link: string };
}

interface EDGEZENAiDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EDGEZENAiDrawer: React.FC<EDGEZENAiDrawerProps> = ({ isOpen, onClose }) => {
  const { currentUser } = useAuth();
  const { events, contests } = useData();
  const navigate = useNavigate();

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-1',
      sender: 'ai',
      text: `Hello ${currentUser?.full_name.split(' ')[0]} 👋! I am EDGEZEN AI, your personal club copilot. How can I help you excel today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!isOpen) return null;

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    setTimeout(() => {
      let aiResponseText = '';
      let actionBtn: { label: string; link: string } | undefined = undefined;
      const lower = query.toLowerCase();

      if (lower.includes('next event') || lower.includes('upcoming event')) {
        const next = events.find(e => e.status === 'upcoming');
        if (next) {
          aiResponseText = `The next scheduled club event is "${next.title}" on ${next.event_date} at ${next.venue}. ${next.registered_count} members registered.`;
          actionBtn = { label: 'View Event & Pass', link: '/student/hub' };
        } else {
          aiResponseText = 'There are no upcoming events listed right now.';
        }
      } else if (lower.includes('xp') || lower.includes('level') || lower.includes('rank')) {
        aiResponseText = `You have ${currentUser?.xp} XP and are currently Level ${currentUser?.level} (${currentUser?.streak_weeks} week participation streak). Attend events or submit weekly contests to level up!`;
      } else if (lower.includes('contest') || lower.includes('competition')) {
        const live = contests.find(c => c.status === 'live');
        if (live) {
          aiResponseText = `Weekly Contest #${live.title} is currently LIVE! Earn up to +125 XP by participating before the deadline.`;
          actionBtn = { label: 'Take Contest Now', link: '/contests' };
        } else {
          aiResponseText = 'No contest is live at this exact moment. Check back soon!';
        }
      } else if (lower.includes('admin') || lower.includes('registered') || lower.includes('analytics')) {
        if (currentUser?.role === 'super_admin' || currentUser?.role === 'faculty_coordinator') {
          aiResponseText = `Platform Statistics: 4 Active Members, 3 Events Conducted, 84 Event Registrations, 2 Contests Completed, 100% System Health.`;
          actionBtn = { label: 'Open Admin Dashboard', link: '/admin/dashboard' };
        } else {
          aiResponseText = 'Administrative insights are reserved for Super Admins and Faculty Coordinators.';
        }
      } else {
        aiResponseText = `I understand you asked: "${query}". I am tuned specifically for EDGEZEN AI Club operations! You can ask me about events, weekly contests, or XP calculations.`;
      }

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiResponseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionButton: actionBtn
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 800);
  };

  const samplePrompts = [
    'When is the next event?',
    'Show my certificates',
    'How many XP do I have?',
    'What contests are available?',
    'Recommend what I should learn next'
  ];

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-96 glass-panel z-50 shadow-glass border-l border-cyan-500/30 flex flex-col justify-between animate-in slide-in-from-right duration-300">
      {/* Drawer Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-glow">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-100 flex items-center space-x-1">
              <span>EDGEZEN AI Assistant</span>
              <Sparkles className="w-3 h-3 text-cyan-400" />
            </h3>
            <p className="text-[10px] text-cyan-400 font-mono">Autonomous Club Copilot</p>
          </div>
        </div>

        <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(m => (
          <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className="flex items-start space-x-2 max-w-[85%]">
              {m.sender === 'ai' && (
                <div className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}

              <div>
                <div
                  className={`p-3 rounded-2xl text-xs leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-cyan-600 text-white rounded-tr-none'
                      : 'bg-slate-900/90 text-slate-200 border border-slate-800 rounded-tl-none'
                  }`}
                >
                  {m.text}

                  {m.actionButton && (
                    <button
                      onClick={() => {
                        navigate(m.actionButton!.link);
                        onClose();
                      }}
                      className="mt-2.5 w-full flex items-center justify-between bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 px-3 py-1.5 rounded-xl font-semibold transition-all"
                    >
                      <span>{m.actionButton.label}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="text-[9px] text-slate-500 mt-1 font-mono px-1">
                  {m.timestamp}
                </div>
              </div>

              {m.sender === 'user' && (
                <div className="w-6 h-6 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center space-x-2 text-xs text-cyan-400 font-mono">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span>EDGEZEN AI is reasoning...</span>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="px-4 py-2 bg-slate-950/60 border-t border-slate-800">
        <p className="text-[10px] text-slate-500 mb-1.5 font-semibold">Suggested Questions:</p>
        <div className="flex flex-wrap gap-1.5">
          {samplePrompts.slice(0, 3).map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              className="text-[10px] bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 px-2 py-1 rounded-lg transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Input Box */}
      <div className="p-3 border-t border-slate-800 bg-slate-900/90 flex items-center space-x-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Ask EDGEZEN AI..."
          className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
        />
        <button
          onClick={() => handleSend()}
          disabled={!input.trim()}
          className="p-2 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white disabled:opacity-50 transition-all shadow-glow"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
