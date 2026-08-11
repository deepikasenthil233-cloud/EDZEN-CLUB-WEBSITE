import React from 'react';
import { Flame, Trophy, Award, Crown, Sparkles, HeartHandshake } from 'lucide-react';

export const HallOfFame: React.FC = () => {
  const honorees = [
    {
      name: 'Deepika Ramanathan',
      title: 'Student of the Month — July 2026',
      award: 'AI Excellence Award',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
      reason: '1st Place in AI Hackathon 2026 & Perfect Weekly Contest Streak.',
      dept: 'AI & Data Science (III Year)',
      badge: 'EDGEZEN Elite'
    },
    {
      name: 'Karthik Varma',
      title: 'Contest Champion',
      award: 'Cyber Warrior Master',
      avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=300',
      reason: 'Created 10+ cybersecurity challenges and led hands-on bootcamps.',
      dept: 'Cyber Security (IV Year)',
      badge: 'Coding Master'
    },
    {
      name: 'Dr. Aris Thorne',
      title: 'Faculty Advisor of the Year',
      award: 'Visionary Mentor',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
      reason: 'Architected the EDGEZEN AI platform and mentored student researchers.',
      dept: 'Computer Science',
      badge: 'Super Admin'
    }
  ];

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-extrabold text-white font-outfit flex items-center space-x-2">
          <Flame className="w-6 h-6 text-rose-500" />
          <span>EDGEZEN Hall of Fame & Celebration Wall</span>
        </h1>
        <p className="text-xs text-slate-400">Honoring top student performers, contest champions, and exceptional mentors.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {honorees.map((h, idx) => (
          <div
            key={idx}
            className="glass-card rounded-3xl p-6 border border-rose-500/30 text-center space-y-4 relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-rose-950/20"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center justify-center mx-auto">
              {idx === 0 ? <Crown className="w-6 h-6 text-amber-400" /> : <Trophy className="w-5 h-5 text-rose-400" />}
            </div>

            <img
              src={h.avatar}
              alt={h.name}
              className="w-24 h-24 rounded-2xl object-cover mx-auto ring-4 ring-rose-500/40 shadow-glow"
            />

            <div>
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/40 border border-cyan-500/30 px-2.5 py-0.5 rounded uppercase font-bold">
                {h.award}
              </span>
              <h3 className="font-extrabold text-lg text-white mt-1">{h.name}</h3>
              <p className="text-xs text-rose-400 font-mono font-semibold">{h.title}</p>
              <p className="text-[11px] text-slate-400 mt-2 line-clamp-2 leading-relaxed">{h.reason}</p>
            </div>

            <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 font-mono">
              {h.dept}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
