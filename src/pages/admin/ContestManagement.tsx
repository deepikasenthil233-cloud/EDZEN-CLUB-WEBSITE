import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Trophy, Plus, X } from 'lucide-react';
import { ContestItem, QuestionItem } from '../../types';

interface ManualQuestion {
  questionText: string;
  options: string[];
  correctAnswer: string;
  marks: number;
}

export const ContestManagement: React.FC = () => {
  const { contests, questions, addContest } = useData();

  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ContestItem['category']>('Artificial Intelligence');
  const [durationMinutes, setDurationMinutes] = useState(30);

  const [manualQuestions, setManualQuestions] = useState<ManualQuestion[]>([
    { questionText: '', options: ['', '', '', ''], correctAnswer: '', marks: 100 }
  ]);

  const updateQuestion = (questionIndex: number, changes: Partial<ManualQuestion>) => {
    setManualQuestions(prev => prev.map((question, index) => index === questionIndex ? { ...question, ...changes } : question));
  };

  const updateQuestionOption = (questionIndex: number, optionIndex: number, value: string) => {
    setManualQuestions(prev => prev.map((question, index) => index === questionIndex
      ? { ...question, options: question.options.map((option, index) => index === optionIndex ? value : option) }
      : question));
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
      total_marks: manualQuestions.reduce((total, question) => total + question.marks, 0),
      passing_marks: Math.ceil(manualQuestions.reduce((total, question) => total + question.marks, 0) / 2),
      xp_reward: 25,
      winner_xp_bonus: 100,
      start_time: new Date().toISOString(),
      end_time: new Date(Date.now() + 7 * 86400000).toISOString(),
      poster_url: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&q=80&w=800',
      status: 'live',
      instructions: [`${durationMinutes} minutes timer`, 'Auto-save active'],
      allowed_attempts: 1,
      created_at: new Date().toISOString().split('T')[0]
    };

    const qList: QuestionItem[] = manualQuestions.map((question, index) => ({
      id: `q-${Date.now()}-${index}`,
      contest_id: newContest.id,
      question_text: question.questionText,
      question_type: 'mcq',
      options: question.options,
      correct_answer: question.correctAnswer,
      marks: question.marks
    }));

    addContest(newContest, qList);
    setShowAddModal(false);
    setTitle('');
    setDescription('');
    setManualQuestions([{ questionText: '', options: ['', '', '', ''], correctAnswer: '', marks: 100 }]);
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

      {/* Create Contest & Manual Question Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleCreateContest} className="glass-panel rounded-3xl p-6 max-w-lg w-full border border-amber-500/40 space-y-4 shadow-glass max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Trophy className="w-5 h-5 text-amber-400" />
                <h3 className="font-extrabold text-base text-white">Create Contest & Add Question</h3>
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

              <div>
                <label className="text-slate-400 block mb-1 font-semibold">Contest Timer (minutes) *</label>
                <input
                  type="number"
                  required
                  min="1"
                  max="240"
                  value={durationMinutes}
                  onChange={e => setDurationMinutes(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                />
                <p className="text-[10px] text-slate-500 mt-1">Participants will have this much time to complete the contest.</p>
              </div>

              {manualQuestions.map((question, questionIndex) => (
                <div key={questionIndex} className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200">Manual MCQ {questionIndex + 1}</span>
                    {manualQuestions.length > 1 && (
                      <button type="button" onClick={() => setManualQuestions(prev => prev.filter((_, index) => index !== questionIndex))} className="text-rose-400 hover:text-rose-300 text-[11px] font-semibold">Remove</button>
                    )}
                  </div>
                  <textarea
                    required
                    value={question.questionText}
                    onChange={e => updateQuestion(questionIndex, { questionText: e.target.value })}
                    placeholder="Enter the question"
                    className="w-full h-20 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                  {question.options.map((option, optionIndex) => (
                    <input
                      key={optionIndex}
                      required
                      value={option}
                      onChange={e => updateQuestionOption(questionIndex, optionIndex, e.target.value)}
                      placeholder={`Option ${optionIndex + 1}`}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    />
                  ))}
                  <div className="grid grid-cols-2 gap-2">
                    <select required value={question.correctAnswer} onChange={e => updateQuestion(questionIndex, { correctAnswer: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white">
                      <option value="">Correct answer</option>
                      {question.options.filter(option => option.trim()).map(option => <option key={option} value={option}>{option}</option>)}
                    </select>
                    <input required type="number" min="1" value={question.marks} onChange={e => updateQuestion(questionIndex, { marks: Number(e.target.value) })} placeholder="Marks" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white" />
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setManualQuestions(prev => [...prev, { questionText: '', options: ['', '', '', ''], correctAnswer: '', marks: 100 }])}
                className="w-full border border-dashed border-amber-500/40 text-amber-300 hover:bg-amber-500/10 py-2.5 rounded-xl text-xs font-bold"
              >
                + Add Another Question
              </button>
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
