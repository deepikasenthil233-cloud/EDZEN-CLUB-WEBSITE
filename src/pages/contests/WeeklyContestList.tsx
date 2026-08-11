import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { ContestTakingView } from './ContestTakingView';
import { Trophy, Clock, Zap, CheckCircle2, ChevronRight, AlertTriangle } from 'lucide-react';
import { ContestItem } from '../../types';

export const WeeklyContestList: React.FC = () => {
  const { contests, submissions } = useData();
  const [activeContest, setActiveContest] = useState<ContestItem | null>(null);

  if (activeContest) {
    return <ContestTakingView contest={activeContest} onBack={() => setActiveContest(null)} />;
  }

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-extrabold text-white font-outfit flex items-center space-x-2">
          <Trophy className="w-6 h-6 text-amber-400" />
          <span>Weekly AI Contest Arena</span>
        </h1>
        <p className="text-xs text-slate-400">Compete in weekly AI challenges, test technical knowledge, earn XP, and climb the leaderboard.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {contests.map(c => {
          const isSubmitted = submissions.some(s => s.contest_id === c.id);
          const isLive = c.status === 'live';

          return (
            <div
              key={c.id}
              className={`glass-card rounded-2xl p-6 border flex flex-col justify-between space-y-4 relative overflow-hidden ${
                isLive ? 'border-amber-500/40 bg-amber-950/10' : 'border-slate-800'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full uppercase font-bold border ${
                    isLive ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse' : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}>
                    {c.status === 'live' ? '🔥 LIVE CONTEST' : 'COMPLETED'}
                  </span>

                  <span className="text-xs font-mono text-cyan-400 font-bold">
                    +{c.xp_reward} XP (+{c.winner_xp_bonus} Winner Bonus)
                  </span>
                </div>

                <h3 className="font-extrabold text-lg text-white leading-snug">{c.title}</h3>
                <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">{c.description}</p>

                <div className="mt-4 p-3 bg-slate-900/90 rounded-xl border border-slate-800/80 grid grid-cols-3 gap-2 text-center text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase">Duration</span>
                    <span className="text-amber-400 font-bold">{c.duration_minutes} Mins</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase">Difficulty</span>
                    <span className="text-purple-400 font-bold">{c.difficulty}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase">Pass Mark</span>
                    <span className="text-emerald-400 font-bold">{c.passing_marks}/100</span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                {isSubmitted ? (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
                    <span className="flex items-center space-x-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Contest Submitted & Evaluated</span>
                    </span>
                    <span className="font-mono text-cyan-400">XP Credited</span>
                  </div>
                ) : isLive ? (
                  <button
                    onClick={() => setActiveContest(c)}
                    className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-black font-extrabold py-3 rounded-xl text-xs shadow-glow transition-all"
                  >
                    <span>Enter Contest Challenge</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full bg-slate-800 text-slate-500 font-bold py-2.5 rounded-xl text-xs cursor-not-allowed"
                  >
                    Contest Ended
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
