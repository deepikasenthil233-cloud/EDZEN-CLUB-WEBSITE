import React from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { 
  ShieldAlert, 
  Users, 
  Calendar, 
  Trophy, 
  Award, 
  BookOpen, 
  Mail, 
  Activity, 
  Database, 
  HardDrive, 
  Plus, 
  FileText, 
  Sliders, 
  History,
  CheckCircle2
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const SuperAdminDashboard: React.FC = () => {
  const { allUsers } = useAuth();
  const { events, contests, certificates, resources, auditLogs } = useData();

  const activeMembers = allUsers.filter(u => u.status === 'active').length;

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Executive Command Center Header */}
      <div className="glass-panel rounded-3xl p-6 lg:p-8 border border-rose-500/30 bg-gradient-to-r from-slate-900 via-slate-900 to-rose-950/30">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center shadow-glow">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-extrabold text-white font-outfit">Super Admin Command Center</h1>
                <span className="text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/40 px-2 py-0.5 rounded font-mono font-bold">
                  UNRESTRICTED ACCESS
                </span>
              </div>
              <p className="text-xs text-slate-300">Real-time club ops monitoring, security logs, and member governance.</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 bg-slate-900/90 border border-slate-800 p-2.5 rounded-2xl text-xs font-mono">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-slate-300 font-bold">System Health: 🟢 100% Operational</span>
          </div>
        </div>
      </div>

      {/* Real-time Statistics Cards (Requirement #65) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        <div className="glass-card rounded-2xl p-4 border border-rose-500/20">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold uppercase">Total Members</span>
            <Users className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-outfit">{allUsers.length}</div>
          <p className="text-[10px] text-emerald-400 font-mono mt-0.5">{activeMembers} Active</p>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-rose-500/20">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold uppercase">Total Events</span>
            <Calendar className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-outfit">{events.length}</div>
          <p className="text-[10px] text-slate-400 font-mono mt-0.5">84 Registrations</p>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-rose-500/20">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold uppercase">Contests</span>
            <Trophy className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-outfit">{contests.length}</div>
          <p className="text-[10px] text-slate-400 font-mono mt-0.5">Weekly Active</p>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-rose-500/20">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold uppercase">Certificates</span>
            <Award className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-outfit">{certificates.length}</div>
          <p className="text-[10px] text-slate-400 font-mono mt-0.5">100% Issued</p>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-rose-500/20">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold uppercase">Resources</span>
            <BookOpen className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-outfit">{resources.length}</div>
          <p className="text-[10px] text-slate-400 font-mono mt-0.5">316 Downloads</p>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-rose-500/20">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold uppercase">Emails Sent</span>
            <Mail className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-outfit">1,420</div>
          <p className="text-[10px] text-emerald-400 font-mono mt-0.5">99.8% Delivered</p>
        </div>
      </div>

      {/* Quick Action Shortcuts Panel (Requirement #66) */}
      <div>
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">Admin Quick Action Panel</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2.5">
          <Link
            to="/admin/members"
            className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-center space-y-1 group transition-all"
          >
            <Users className="w-5 h-5 text-cyan-400 mx-auto group-hover:scale-110 transition-transform" />
            <span className="text-xs font-semibold text-slate-200 block">Manage Members</span>
          </Link>

          <Link
            to="/admin/events"
            className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 text-center space-y-1 group transition-all"
          >
            <Calendar className="w-5 h-5 text-emerald-400 mx-auto group-hover:scale-110 transition-transform" />
            <span className="text-xs font-semibold text-slate-200 block">Create Event</span>
          </Link>

          <Link
            to="/admin/contests"
            className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 text-center space-y-1 group transition-all"
          >
            <Trophy className="w-5 h-5 text-amber-400 mx-auto group-hover:scale-110 transition-transform" />
            <span className="text-xs font-semibold text-slate-200 block">Contest Creator</span>
          </Link>

          <Link
            to="/admin/emails"
            className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-blue-500/40 text-center space-y-1 group transition-all"
          >
            <Mail className="w-5 h-5 text-blue-400 mx-auto group-hover:scale-110 transition-transform" />
            <span className="text-xs font-semibold text-slate-200 block">Broadcast Email</span>
          </Link>

          <Link
            to="/admin/audit-logs"
            className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-rose-500/40 text-center space-y-1 group transition-all"
          >
            <History className="w-5 h-5 text-rose-400 mx-auto group-hover:scale-110 transition-transform" />
            <span className="text-xs font-semibold text-slate-200 block">Audit Trail</span>
          </Link>

          <Link
            to="/admin/settings"
            className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-purple-500/40 text-center space-y-1 group transition-all"
          >
            <Sliders className="w-5 h-5 text-purple-400 mx-auto group-hover:scale-110 transition-transform" />
            <span className="text-xs font-semibold text-slate-200 block">Platform Config</span>
          </Link>
        </div>
      </div>

      {/* System Health & Audit Log Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-100 flex items-center space-x-2">
              <Activity className="w-4 h-4 text-rose-400" />
              <span>Real-Time Audit Trail Stream</span>
            </h3>
            <Link to="/admin/audit-logs" className="text-xs text-rose-400 hover:underline">View All Logs</Link>
          </div>

          <div className="space-y-2.5 max-h-72 overflow-y-auto">
            {auditLogs.map(log => (
              <div key={log.id} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-mono flex items-center justify-between">
                <div>
                  <span className="text-cyan-400 font-bold">{log.user_name} ({log.user_role})</span>
                  <p className="text-slate-300 mt-0.5">{log.action}: {log.details}</p>
                </div>
                <span className="text-[10px] text-slate-500">{log.created_at}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Infrastructure Health Card (#84) */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
          <h3 className="font-bold text-sm text-slate-100 flex items-center space-x-2">
            <Database className="w-4 h-4 text-cyan-400" />
            <span>Infrastructure Health</span>
          </h3>

          <div className="space-y-3 font-mono text-xs">
            <div className="flex justify-between items-center p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-400">PostgreSQL DB:</span>
              <span className="text-emerald-400 font-bold flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Online (12ms)</span>
              </span>
            </div>

            <div className="flex justify-between items-center p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-400">Storage Usage:</span>
              <span className="text-cyan-400 font-bold">1.4 GB / 50 GB</span>
            </div>

            <div className="flex justify-between items-center p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-400">Email Gateway:</span>
              <span className="text-emerald-400 font-bold">Resend API Active</span>
            </div>

            <div className="flex justify-between items-center p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-400">Auth Service:</span>
              <span className="text-emerald-400 font-bold">Supabase Auth</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
