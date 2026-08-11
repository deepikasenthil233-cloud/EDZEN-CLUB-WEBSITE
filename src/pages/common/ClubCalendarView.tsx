import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight } from 'lucide-react';

export const ClubCalendarView: React.FC = () => {
  const { events, contests } = useData();
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white font-outfit flex items-center space-x-2">
            <CalendarIcon className="w-6 h-6 text-purple-400" />
            <span>Interactive Club Calendar</span>
          </h1>
          <p className="text-xs text-slate-400">Track upcoming workshops, contest deadlines, hackathons, and release dates.</p>
        </div>

        <div className="flex items-center space-x-1.5 bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs font-mono">
          {(['month', 'week', 'day'] as const).map(mode => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-3 py-1 rounded-lg capitalize transition-all ${
                viewMode === mode ? 'bg-purple-600 text-white font-bold shadow-glow' : 'text-slate-400 hover:text-white'
              }`}
            >
              {mode} View
            </button>
          ))}
        </div>
      </div>

      <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between font-mono text-xs border-b border-slate-800 pb-3">
          <span className="text-white font-bold text-sm">August 2026</span>
          <div className="flex space-x-1">
            <button className="p-1 rounded bg-slate-900 border border-slate-800 text-slate-300"><ChevronLeft className="w-4 h-4" /></button>
            <button className="p-1 rounded bg-slate-900 border border-slate-800 text-slate-300"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>

        <div className="space-y-3">
          {events.map(e => (
            <div key={e.id} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex flex-col items-center justify-center shrink-0">
                  <span className="text-[10px] uppercase font-bold">AUG</span>
                  <span className="text-sm font-extrabold">{e.event_date.split('-')[2] || '10'}</span>
                </div>
                <div>
                  <div className="font-bold text-slate-200">{e.title}</div>
                  <div className="text-slate-400 text-[11px]">{e.venue} ({e.event_time})</div>
                </div>
              </div>
              <span className="text-cyan-400 font-bold">+{e.xp_reward} XP</span>
            </div>
          ))}

          {contests.map(c => (
            <div key={c.id} className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/30 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex flex-col items-center justify-center shrink-0">
                  <span className="text-[10px] uppercase font-bold">LIVE</span>
                  <span className="text-sm font-extrabold">🏆</span>
                </div>
                <div>
                  <div className="font-bold text-amber-300">{c.title}</div>
                  <div className="text-slate-400 text-[11px]">Weekly Contest • {c.duration_minutes} Mins</div>
                </div>
              </div>
              <span className="text-amber-400 font-bold">+{c.xp_reward} XP</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
