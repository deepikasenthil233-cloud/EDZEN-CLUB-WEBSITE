import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Lightbulb, Send, CheckCircle2, Clock, Sparkles } from 'lucide-react';

export const IdeasPortal: React.FC = () => {
  const { ideas, submitIdea } = useData();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('AI Workshop');
  const [submittedMsg, setSubmittedMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    submitIdea(title, description, category);
    setSubmittedMsg('Idea submitted to Super Admin! +10 XP awarded.');
    setTitle('');
    setDescription('');
    setTimeout(() => setSubmittedMsg(''), 4000);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-extrabold text-white font-outfit flex items-center space-x-2">
          <Lightbulb className="w-6 h-6 text-yellow-400" />
          <span>Student Innovation & Idea Submission Portal</span>
        </h1>
        <p className="text-xs text-slate-400">Propose new workshop ideas, hackathon themes, or project proposals to earning +40 XP upon approval.</p>
      </div>

      {submittedMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{submittedMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <form onSubmit={handleSubmit} className="lg:col-span-1 glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
          <h3 className="font-bold text-sm text-slate-100">Submit New Proposal</h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-slate-400 block mb-1 font-semibold">Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. LangChain Multi-Agent Bootcamp"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1 font-semibold">Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
              >
                <option value="AI Workshop">AI Workshop</option>
                <option value="Hackathon Theme">Hackathon Theme</option>
                <option value="Research Group">Research Group</option>
                <option value="Club Feature">Club Improvement</option>
              </select>
            </div>

            <div>
              <label className="text-slate-400 block mb-1 font-semibold">Detailed Description *</label>
              <textarea
                required
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Explain the proposed agenda, objectives, and prerequisites..."
                className="w-full h-32 bg-slate-950 border border-slate-800 rounded-xl p-3 text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-black font-extrabold py-3 rounded-xl text-xs shadow-glow transition-all"
          >
            <Send className="w-4 h-4" />
            <span>Submit Proposal (+10 XP)</span>
          </button>
        </form>

        {/* Ideas Feed */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
          <h3 className="font-bold text-sm text-slate-100">Community Idea Stream</h3>
          <div className="space-y-3">
            {ideas.map(i => (
              <div key={i.id} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/40 border border-cyan-500/30 px-2 py-0.5 rounded font-bold">
                    {i.category}
                  </span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold ${
                    i.status === 'approved' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                  }`}>
                    {i.status}
                  </span>
                </div>

                <h4 className="font-bold text-sm text-white">{i.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{i.description}</p>

                {i.admin_comment && (
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-cyan-300 font-mono">
                    💬 Admin Feedback: {i.admin_comment}
                  </div>
                )}
                <div className="text-[10px] text-slate-500 font-mono text-right">By {i.student_name} • {i.created_at}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
