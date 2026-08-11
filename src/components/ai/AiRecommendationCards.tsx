import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, ArrowUpRight, BookOpen, Trophy, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AiRecommendationCards: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const recommendations = [
    {
      id: 'rec-1',
      title: 'Prompt Engineering & LLM Optimization Contest',
      type: 'Weekly Contest',
      reason: `Matches your skill in ${currentUser?.skills?.[0] || 'Python'} & interest in Generative AI`,
      reward: '+125 XP & Badge',
      link: '/contests',
      icon: <Trophy className="w-4 h-4 text-amber-400" />,
      color: 'border-amber-500/30 bg-amber-950/20'
    },
    {
      id: 'rec-2',
      title: 'Attention & Transformers Masterclass Notes',
      type: 'Learning Resource',
      reason: 'Recommended for Level 5 Students building AI portfolio',
      reward: 'Free PDF Download',
      link: '/resources',
      icon: <BookOpen className="w-4 h-4 text-cyan-400" />,
      color: 'border-cyan-500/30 bg-cyan-950/20'
    },
    {
      id: 'rec-3',
      title: 'Submit your LangGraph AI Agent Idea',
      type: 'Innovation Portal',
      reason: 'Earn +40 XP upon approval by Super Admin',
      reward: '+40 XP',
      link: '/ideas',
      icon: <Zap className="w-4 h-4 text-purple-400" />,
      color: 'border-purple-500/30 bg-purple-950/20'
    }
  ];

  return (
    <div className="glass-card rounded-2xl p-5 border border-cyan-500/20 relative overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-glow">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-100 flex items-center space-x-1">
              <span>AI Personalized Recommendations</span>
            </h3>
            <p className="text-[11px] text-cyan-400 font-mono">Tailored for {currentUser?.full_name.split(' ')[0]} ({currentUser?.department})</p>
          </div>
        </div>
        <span className="text-[10px] bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded-full font-mono">
          AI Engine Active
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {recommendations.map(r => (
          <div
            key={r.id}
            onClick={() => navigate(r.link)}
            className={`p-3.5 rounded-xl border ${r.color} hover:border-cyan-400/50 cursor-pointer transition-all flex flex-col justify-between group`}
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{r.type}</span>
                {r.icon}
              </div>
              <h4 className="font-semibold text-xs text-slate-100 group-hover:text-cyan-300 transition-colors leading-snug">
                {r.title}
              </h4>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                {r.reason}
              </p>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
              <span className="text-cyan-400 font-mono font-semibold">{r.reward}</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
