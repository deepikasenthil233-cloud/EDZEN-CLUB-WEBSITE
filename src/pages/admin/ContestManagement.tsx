import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Trophy, Plus, Sparkles, HelpCircle, FileText, Check, X } from 'lucide-react';
import { ContestItem, QuestionItem } from '../../types';

export const ContestManagement: React.FC = () => {
  const { contests, questions, addContest } = useData();

  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ContestItem['category']>('Artificial Intelligence');
  const [durationMinutes, setDurationMinutes] = useState(30);

  // AI Assistant Question Generator State (#163)
  const [aiTopic, setAiTopic] = useState('Deep Learning Loss Functions');
  const [generatedDraft, setGeneratedDraft] = useState<QuestionItem | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateAiQuestion = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setGeneratedDraft({
        id: `q-ai-${Date.now()}`,
        contest_id: 'draft',
        question_text: `Which loss function is specifically designed to address class imbalance in deep learning object detection models?`,
        question_type: 'mcq',
        options: ['Cross-Entropy Loss', 'Focal Loss', 'Mean Squared Error', 'Hinge Loss'],
        correct_answer: 'Focal Loss',
        marks: 25,
        explanation: 'Focal Loss down-weights easy examples during training to focus model capacity on hard negative samples.'
      });
      setIsGenerating(false);
    }, 600);
  };

  const handleCreateContest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    const newContest: ContestItem = {
      id: `contest-${Date.now()}`,
      title,
      description,
      category,
      difficulty: 'Intermediate',
      duration_minutes: durationMinutes,
      total_marks: 100,
      passing_marks: 50,
      xp_reward: 25,
      winner_xp_bonus: 100,
      start_time: new Date().toISOString(),
      end_time: new Date(Date.now() + 7 * 86400000).toISOString(),
      poster_url: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&q=80&w=800',
      status: 'live',
      instructions: ['30 minutes timer', 'Auto-save active'],
      allowed_attempts: 1,
      created_at: new Date().toISOString().split('T')[0]
    };

    const qList: QuestionItem[] = generatedDraft ? [generatedDraft] : [
      {
        id: `q-${Date.now()}`,
        contest_id: newContest.id,
        question_text: 'What is the primary advantage of Self-Attention over Recurrent Neural Networks?',
        question_type: 'mcq',
        options: ['Parallelizable Computation', 'Fewer Parameters', 'Zero Memory Overhead', 'No Hyperparameters'],
        correct_answer: 'Parallelizable Computation',
        marks: 50
      }
    ];

    addContest(newContest, qList);
    setShowAddModal(false);
    setTitle('');
    setDescription('');
    setGeneratedDraft(null);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white font-outfit flex items-center space-x-2">
            <Trophy className="w-6 h-6 text-amber-400" />
            <span>Weekly Contest & Question Bank Ops</span>
          </h1>
          <p className="text-xs text-slate-400">Design weekly challenges, manage question banks, and leverage EDGEZEN AI for question drafting.</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-black font-extrabold px-4 py-2 rounded-xl text-xs shadow-glow transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Create Weekly Contest</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {contests.map(c => {
          const qList = questions[c.id] || [];
          return (
            <div key={c.id} className="glass-card rounded-2xl p-5 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-amber-400 bg-amber-950/40 border border-amber-500/30 px-2 py-0.5 rounded font-bold">
                  {c.category}
                </span>
                <span className="text-xs text-slate-400 font-mono">{qList.length} Questions</span>
              </div>

              <h3 className="font-extrabold text-base text-white">{c.title}</h3>
              <p className="text-xs text-slate-400 line-clamp-2">{c.description}</p>

              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs font-mono flex justify-between">
                <span className="text-slate-400">Duration: <strong className="text-white">{c.duration_minutes}m</strong></span>
                <span className="text-slate-400">Status: <strong className="text-amber-400 uppercase">{c.status}</strong></span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Contest & AI Question Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleCreateContest} className="glass-panel rounded-3xl p-6 max-w-lg w-full border border-amber-500/40 space-y-4 shadow-glass max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Trophy className="w-5 h-5 text-amber-400" />
                <h3 className="font-extrabold text-base text-white">Create Contest & AI Questions</h3>
              </div>
              <button type="button" onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1 font-semibold">Contest Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Weekly AI Contest #43: Neural Architecture Search"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-semibold">Description *</label>
                <textarea
                  required
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Contest rules & guidelines..."
                  className="w-full h-20 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              {/* AI Contest Question Assistant (#163) */}
              <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-cyan-300 flex items-center space-x-1.5">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span>EDGEZEN AI Question Draft Generator</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleGenerateAiQuestion}
                    className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 px-3 py-1 rounded-xl font-mono text-[11px]"
                  >
                    {isGenerating ? 'Generating...' : 'Generate AI MCQ'}
                  </button>
                </div>

                {generatedDraft && (
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1 font-mono text-[11px]">
                    <div className="text-cyan-400 font-bold">Draft Question: {generatedDraft.question_text}</div>
                    <div className="text-slate-300">Answer: {generatedDraft.correct_answer}</div>
                    <div className="text-slate-400 text-[10px]">{generatedDraft.explanation}</div>
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-black font-extrabold py-3 rounded-xl text-xs shadow-glow transition-all"
            >
              Publish Weekly Contest
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
