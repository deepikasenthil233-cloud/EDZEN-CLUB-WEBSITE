import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { TrendingUp, Flame, Target, History, Sparkles, Trophy, CheckCircle2 } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const MyProgress: React.FC = () => {
  const { currentUser } = useAuth();
  const { activityLogs } = useData();

  if (!currentUser) return null;

  const barData = [
    { name: 'Contests', count: 6 },
    { name: 'Events', count: 4 },
    { name: 'Certificates', count: 2 },
    { name: 'Ideas', count: 1 },
    { name: 'Volunteered', count: 2 },
  ];

  const goals = [
    { title: 'Attend 2 More Events', reward: 'Unlock Gold Explorer Badge', progress: 66 },
    { title: 'Participate in 1 Weekly Contest', reward: 'Reach Level 6 & +100 XP', progress: 80 },
    { title: 'Earn 100 XP', reward: 'Move to Overall Rank #3', progress: 45 }
  ];

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-extrabold text-white font-outfit flex items-center space-x-2">
          <TrendingUp className="w-6 h-6 text-cyan-400" />
          <span>My Progress & Growth Ecosystem</span>
        </h1>
        <p className="text-xs text-slate-400">Track your continuous learning, streak milestones, and achievements.</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card rounded-2xl p-5 border border-cyan-500/30">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Profile Completion</span>
            <Sparkles className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-extrabold text-cyan-400 font-outfit">{currentUser.profile_completion_pct}%</div>
          <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
            <div className="bg-cyan-400 h-full rounded-full" style={{ width: `${currentUser.profile_completion_pct}%` }} />
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-amber-500/30">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Participation Streak</span>
            <Flame className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-3xl font-extrabold text-amber-400 font-outfit">{currentUser.streak_weeks} Weeks 🔥</div>
          <p className="text-xs text-slate-400 mt-2 font-mono">Continuous weekly participation</p>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-purple-500/30">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Overall Tier</span>
            <Trophy className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-extrabold text-purple-400 font-outfit">EDGEZEN Elite</div>
          <p className="text-xs text-slate-400 mt-2 font-mono">Rank #4 in AI Department</p>
        </div>
      </div>

      {/* Bar Chart & Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
          <h3 className="font-bold text-sm text-slate-100">Semester Activity Breakdown</h3>
          <div className="h-60 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} />
                <Bar dataKey="count" fill="#0284c7" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Personalized Goals */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-sm text-slate-100">Personalized Milestones & Goals</h3>
          </div>

          <div className="space-y-3">
            {goals.map((g, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-200">{g.title}</span>
                  <span className="text-cyan-400 font-mono text-[11px]">{g.reward}</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full" style={{ width: `${g.progress}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activity Log */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
        <div className="flex items-center space-x-2">
          <History className="w-5 h-5 text-cyan-400" />
          <h3 className="font-bold text-sm text-slate-100">Personal Activity Log (Latest 50 Entries)</h3>
        </div>

        <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
          {activityLogs.map(log => (
            <div key={log.id} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-3">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <div>
                  <div className="font-bold text-slate-200">{log.title}</div>
                  <div className="text-slate-400">{log.description}</div>
                </div>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">{log.timestamp}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
