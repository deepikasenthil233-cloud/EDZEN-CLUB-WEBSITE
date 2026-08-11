import React from 'react';
import { useData } from '../../context/DataContext';
import { UserCheck, Calendar, Trophy, MessageSquare, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

export const StudentCoordinatorDashboard: React.FC = () => {
  const { events, contests } = useData();

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      <div className="glass-panel rounded-3xl p-6 border border-emerald-500/30 bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/30">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shadow-glow">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white font-outfit">Student Coordinator Operations</h1>
            <p className="text-xs text-slate-300">Coordinate student registrations, weekly contest questions, and discussion moderation.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card rounded-2xl p-5 border border-slate-800">
          <span className="text-xs text-slate-400 font-bold uppercase block mb-1">Assigned Events</span>
          <span className="text-3xl font-extrabold text-white">{events.length}</span>
        </div>
        <div className="glass-card rounded-2xl p-5 border border-slate-800">
          <span className="text-xs text-slate-400 font-bold uppercase block mb-1">Weekly Contests Setup</span>
          <span className="text-3xl font-extrabold text-amber-400">{contests.length}</span>
        </div>
        <div className="glass-card rounded-2xl p-5 border border-slate-800">
          <span className="text-xs text-slate-400 font-bold uppercase block mb-1">Registrations Handled</span>
          <span className="text-3xl font-extrabold text-cyan-400">84</span>
        </div>
      </div>

      <div className="flex gap-3">
        <Link
          to="/admin/events"
          className="flex-1 p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 text-center font-bold text-xs text-emerald-400 transition-all"
        >
          ➕ Create / Edit Assigned Event
        </Link>
        <Link
          to="/admin/contests"
          className="flex-1 p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 text-center font-bold text-xs text-amber-400 transition-all"
        >
          🏆 Add Contest Questions
        </Link>
      </div>
    </div>
  );
};
