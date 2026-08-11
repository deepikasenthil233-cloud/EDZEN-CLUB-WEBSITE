import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { ContestItem } from '../../types';
import { Clock, ShieldAlert, CheckCircle2, Trophy, ArrowLeft, Save, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ContestTakingViewProps {
  contest: ContestItem;
  onBack: () => void;
}

export const ContestTakingView: React.FC<ContestTakingViewProps> = ({ contest, onBack }) => {
  const { questions, submitContestAnswers } = useData();
  const contestQuestions = questions[contest.id] || [];

  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeftSec, setTimeLeftSec] = useState(contest.duration_minutes * 60);
  const [autoSaveText, setAutoSaveText] = useState('All progress auto-saved');
  const [tabWarnings, setTabWarnings] = useState(0);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [finalResult, setFinalResult] = useState<{ score: number; totalMarks: number; xpEarned: number } | null>(null);

  // Live Timer
  useEffect(() => {
    if (isFinished) return;
    const timer = setInterval(() => {
      setTimeLeftSec(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinalSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isFinished]);

  // Auto-Save simulation every 10s
  useEffect(() => {
    if (isFinished) return;
    const autoSaveInterval = setInterval(() => {
      setAutoSaveText(`Auto-saved at ${new Date().toLocaleTimeString()}`);
    }, 10000);
    return () => clearInterval(autoSaveInterval);
  }, [isFinished]);

  // Tab switching anti-cheat detection
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && !isFinished) {
        setTabWarnings(prev => prev + 1);
        setShowWarningModal(true);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isFinished]);

  const handleAnswerChange = (qId: string, val: string) => {
    setAnswers(prev => ({ ...prev, [qId]: val }));
  };

  const handleFinalSubmit = () => {
    if (isFinished) return;
    setIsFinished(true);
    const timeTaken = contest.duration_minutes * 60 - timeLeftSec;
    const result = submitContestAnswers(contest.id, answers, timeTaken);
    setFinalResult(result);

    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.5 }
    });
  };

  const minutes = Math.floor(timeLeftSec / 60);
  const seconds = timeLeftSec % 60;
  const currentQ = contestQuestions[currentIdx];

  if (isFinished && finalResult) {
    return (
      <div className="max-w-xl mx-auto py-12 space-y-6 animate-in zoom-in-95 duration-300">
        <div className="glass-panel rounded-3xl p-8 border border-cyan-500/40 text-center space-y-6 shadow-glass">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 text-black flex items-center justify-center mx-auto shadow-glow">
            <Trophy className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-2xl font-extrabold text-white">Contest Completed & Evaluated!</h2>
            <p className="text-xs text-slate-400 mt-1">{contest.title}</p>
          </div>

          <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-3 font-mono">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-400">Total Score:</span>
              <span className="text-2xl font-extrabold text-cyan-400">{finalResult.score} / {finalResult.totalMarks}</span>
            </div>
            <div className="flex justify-between items-center text-xs text-slate-300">
              <span>XP Credited to Profile:</span>
              <span className="text-emerald-400 font-bold">+{finalResult.xpEarned} XP</span>
            </div>
            <div className="flex justify-between items-center text-xs text-slate-300">
              <span>Evaluation Status:</span>
              <span className="text-cyan-300">Instant Verified</span>
            </div>
          </div>

          <button
            onClick={onBack}
            className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-3 rounded-xl text-xs shadow-glow transition-all"
          >
            Return to Contest Arena
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="glass-card rounded-2xl p-4 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <button onClick={onBack} className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="font-bold text-base text-white">{contest.title}</h2>
            <div className="flex items-center space-x-2 text-xs text-slate-400 font-mono">
              <span className="flex items-center space-x-1 text-cyan-400">
                <Save className="w-3 h-3" />
                <span>{autoSaveText}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Live Timer Counter */}
        <div className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-mono font-bold text-sm border ${
          timeLeftSec < 300 ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse' : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
        }`}>
          <Clock className="w-4 h-4" />
          <span>{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</span>
        </div>
      </div>

      {/* Main Question Arena */}
      {currentQ && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 glass-panel rounded-2xl p-6 border border-slate-800 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-mono text-cyan-400 font-semibold">
                Question {currentIdx + 1} of {contestQuestions.length}
              </span>
              <span className="text-xs font-mono text-amber-400 font-bold">
                {currentQ.marks} Marks
              </span>
            </div>

            <div className="space-y-4">
              <h3 className="font-extrabold text-base text-white leading-snug">{currentQ.question_text}</h3>

              {/* MCQ Options */}
              {currentQ.question_type === 'mcq' && currentQ.options && (
                <div className="space-y-2.5 pt-2">
                  {currentQ.options.map((opt, oIdx) => {
                    const isSelected = answers[currentQ.id] === opt;
                    return (
                      <button
                        key={oIdx}
                        onClick={() => handleAnswerChange(currentQ.id, opt)}
                        className={`w-full text-left p-3.5 rounded-xl border text-xs font-medium transition-all ${
                          isSelected
                            ? 'bg-cyan-500/20 text-cyan-200 border-cyan-500/50 shadow-glow font-bold'
                            : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <span className="font-mono text-cyan-400 mr-2">{String.fromCharCode(65 + oIdx)}.</span>
                        {opt}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Descriptive / Text Answer */}
              {currentQ.question_type !== 'mcq' && (
                <textarea
                  value={answers[currentQ.id] || ''}
                  onChange={e => handleAnswerChange(currentQ.id, e.target.value)}
                  placeholder="Type your detailed solution / code explanation here..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs font-mono text-slate-100 h-40 focus:outline-none focus:border-cyan-500"
                />
              )}
            </div>

            {/* Bottom Nav */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <button
                onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
                disabled={currentIdx === 0}
                className="bg-slate-900 text-slate-300 border border-slate-800 px-4 py-2 rounded-xl text-xs disabled:opacity-40"
              >
                Previous Question
              </button>

              {currentIdx < contestQuestions.length - 1 ? (
                <button
                  onClick={() => setCurrentIdx(prev => Math.min(contestQuestions.length - 1, prev + 1))}
                  className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-5 py-2 rounded-xl text-xs"
                >
                  Next Question
                </button>
              ) : (
                <button
                  onClick={handleFinalSubmit}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-2 rounded-xl text-xs shadow-glow"
                >
                  Finish & Submit Contest
                </button>
              )}
            </div>
          </div>

          {/* Question Navigator Drawer */}
          <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-4">
            <h4 className="font-bold text-xs text-slate-300 uppercase tracking-wider">Question Navigator</h4>
            <div className="grid grid-cols-4 gap-2">
              {contestQuestions.map((q, idx) => {
                const isAnswered = !!answers[q.id];
                const isCurrent = idx === currentIdx;
                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIdx(idx)}
                    className={`p-2.5 rounded-xl font-mono text-xs font-bold border transition-all ${
                      isCurrent
                        ? 'ring-2 ring-cyan-400 bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                        : isAnswered
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <div className="pt-4 border-t border-slate-800 space-y-2">
              <button
                onClick={handleFinalSubmit}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-2.5 rounded-xl text-xs shadow-glow"
              >
                Submit All Answers
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab Warning Anti-Cheat Modal */}
      {showWarningModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-panel rounded-3xl p-6 max-w-md w-full border border-rose-500/40 text-center space-y-4 shadow-glass">
            <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto animate-bounce" />
            <h3 className="font-bold text-lg text-white">Anti-Cheat Warning Triggered!</h3>
            <p className="text-xs text-slate-300">
              Browser tab switching was detected ({tabWarnings} warning). Please keep the contest tab active until final submission.
            </p>
            <button
              onClick={() => setShowWarningModal(false)}
              className="w-full bg-rose-600 hover:bg-rose-500 text-white font-bold py-2.5 rounded-xl text-xs"
            >
              I Understand, Continue Contest
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
