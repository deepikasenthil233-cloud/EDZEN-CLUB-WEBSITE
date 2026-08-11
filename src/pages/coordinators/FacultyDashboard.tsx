import React from 'react';
import { useData } from '../../context/DataContext';
import { Shield, Calendar, Award, FileText, CheckCircle2, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export const FacultyDashboard: React.FC = () => {
  const { events, certificates } = useData();

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      <div className="glass-panel rounded-3xl p-6 border border-amber-500/30 bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/30">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center shadow-glow">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white font-outfit">Faculty Coordinator Dashboard</h1>
            <p className="text-xs text-slate-300">Supervise club events, issue official certificates, and review attendance analytics.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card rounded-2xl p-5 border border-slate-800">
          <span className="text-xs text-slate-400 font-bold uppercase block mb-1">Supervised Events</span>
          <span className="text-3xl font-extrabold text-white">{events.length}</span>
        </div>
        <div className="glass-card rounded-2xl p-5 border border-slate-800">
          <span className="text-xs text-slate-400 font-bold uppercase block mb-1">Certificates Uploaded</span>
          <span className="text-3xl font-extrabold text-amber-400">{certificates.length}</span>
        </div>
        <div className="glass-card rounded-2xl p-5 border border-slate-800">
          <span className="text-xs text-slate-400 font-bold uppercase block mb-1">Student Participation</span>
          <span className="text-3xl font-extrabold text-emerald-400">94.2%</span>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
        <h3 className="font-bold text-sm text-slate-100">Supervised Events & Approval Status</h3>
        <div className="space-y-3">
          {events.map(ev => (
            <div key={ev.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs font-mono">
              <div>
                <span className="text-cyan-400 font-bold">{ev.title}</span>
                <p className="text-slate-400 text-[10px] mt-0.5">{ev.event_date} • {ev.venue}</p>
              </div>
              <span className="text-emerald-400 font-bold flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Approved & Live</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
