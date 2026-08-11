import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Trophy,
  Award,
  BookOpen,
  Calendar,
  Sparkles,
  QrCode,
  Flame,
  ShieldAlert,
  Users,
  Lightbulb,
  FileText,
  Mail,
  Sliders,
  History,
  TrendingUp,
  CreditCard,
  MessageSquare
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { currentUser } = useAuth();
  const role = currentUser?.role || 'student_member';

  return (
    <aside className="w-64 glass-panel border-r border-slate-800 flex flex-col justify-between py-4 px-3 min-h-[calc(100vh-80px)] hidden md:flex">
      <div className="space-y-6">
        {/* Student Ecosystem Navigation */}
        <div>
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Student Hub</p>
          <nav className="space-y-1">
            <NavLink
              to="/student/hub"
              className={({ isActive }) =>
                `flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  isActive ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold shadow-glow' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`
              }
            >
              <LayoutDashboard className="w-4 h-4 text-cyan-400" />
              <span>EDGEZEN Hub</span>
            </NavLink>

            <NavLink
              to="/student/progress"
              className={({ isActive }) =>
                `flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  isActive ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold shadow-glow' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`
              }
            >
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <span>My Progress & Analytics</span>
            </NavLink>

            <NavLink
              to="/student/membership-card"
              className={({ isActive }) =>
                `flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  isActive ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold shadow-glow' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`
              }
            >
              <CreditCard className="w-4 h-4 text-cyan-400" />
              <span>Digital ID & Pass</span>
            </NavLink>

            <NavLink
              to="/contests"
              className={({ isActive }) =>
                `flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  isActive ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold shadow-glow' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`
              }
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Weekly Contests</span>
            </NavLink>

            <NavLink
              to="/resources"
              className={({ isActive }) =>
                `flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  isActive ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold shadow-glow' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`
              }
            >
              <BookOpen className="w-4 h-4 text-blue-400" />
              <span>Resource Library</span>
            </NavLink>

            <NavLink
              to="/certificates"
              className={({ isActive }) =>
                `flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  isActive ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold shadow-glow' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`
              }
            >
              <Award className="w-4 h-4 text-emerald-400" />
              <span>Certificate Vault</span>
            </NavLink>

            <NavLink
              to="/calendar"
              className={({ isActive }) =>
                `flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  isActive ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold shadow-glow' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`
              }
            >
              <Calendar className="w-4 h-4 text-purple-400" />
              <span>Club Calendar</span>
            </NavLink>

            <NavLink
              to="/hall-of-fame"
              className={({ isActive }) =>
                `flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  isActive ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold shadow-glow' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`
              }
            >
              <Flame className="w-4 h-4 text-rose-400" />
              <span>Hall of Fame & Wall</span>
            </NavLink>

            <NavLink
              to="/ideas"
              className={({ isActive }) =>
                `flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  isActive ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold shadow-glow' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`
              }
            >
              <Lightbulb className="w-4 h-4 text-yellow-400" />
              <span>Idea Submission</span>
            </NavLink>

            <NavLink
              to="/discussions"
              className={({ isActive }) =>
                `flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  isActive ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold shadow-glow' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`
              }
            >
              <MessageSquare className="w-4 h-4 text-indigo-400" />
              <span>Discussion Forums</span>
            </NavLink>
          </nav>
        </div>

        {/* Administration Navigation (Super Admin / Faculty / Student Coordinator) */}
        {(role === 'super_admin' || role === 'faculty_coordinator' || role === 'student_coordinator') && (
          <div>
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-rose-400 mb-2">Management Center</p>
            <nav className="space-y-1">
              {role === 'super_admin' && (
                <NavLink
                  to="/admin/dashboard"
                  className={({ isActive }) =>
                    `flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      isActive ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 font-semibold' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                    }`
                  }
                >
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                  <span>Super Admin Dashboard</span>
                </NavLink>
              )}

              {role === 'faculty_coordinator' && (
                <NavLink
                  to="/faculty/dashboard"
                  className={({ isActive }) =>
                    `flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      isActive ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                    }`
                  }
                >
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                  <span>Faculty Dashboard</span>
                </NavLink>
              )}

              {role === 'student_coordinator' && (
                <NavLink
                  to="/coordinator/dashboard"
                  className={({ isActive }) =>
                    `flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      isActive ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                    }`
                  }
                >
                  <Users className="w-4 h-4 text-emerald-400" />
                  <span>Coordinator Dashboard</span>
                </NavLink>
              )}

              {(role === 'super_admin' || role === 'faculty_coordinator') && (
                <NavLink
                  to="/admin/members"
                  className={({ isActive }) =>
                    `flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      isActive ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 font-semibold' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                    }`
                  }
                >
                  <Users className="w-4 h-4 text-cyan-400" />
                  <span>Member Directory</span>
                </NavLink>
              )}

              <NavLink
                to="/admin/events"
                className={({ isActive }) =>
                  `flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    isActive ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 font-semibold' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`
                }
              >
                <Calendar className="w-4 h-4 text-emerald-400" />
                <span>Event Ops & Pass</span>
              </NavLink>

              <NavLink
                to="/qr-scanner"
                className={({ isActive }) =>
                  `flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    isActive ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 font-semibold' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`
                }
              >
                <QrCode className="w-4 h-4 text-purple-400" />
                <span>QR Attendance Scanner</span>
              </NavLink>

              <NavLink
                to="/admin/contests"
                className={({ isActive }) =>
                  `flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    isActive ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 font-semibold' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`
                }
              >
                <FileText className="w-4 h-4 text-amber-400" />
                <span>Contest Creator & Bank</span>
              </NavLink>

              {role === 'super_admin' && (
                <>
                  <NavLink
                    to="/admin/emails"
                    className={({ isActive }) =>
                      `flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                        isActive ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 font-semibold' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                      }`
                    }
                  >
                    <Mail className="w-4 h-4 text-blue-400" />
                    <span>Email Broadcasts</span>
                  </NavLink>

                  <NavLink
                    to="/admin/audit-logs"
                    className={({ isActive }) =>
                      `flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                        isActive ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 font-semibold' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                      }`
                    }
                  >
                    <History className="w-4 h-4 text-rose-400" />
                    <span>Audit Logs</span>
                  </NavLink>

                  <NavLink
                    to="/admin/settings"
                    className={({ isActive }) =>
                      `flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                        isActive ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 font-semibold' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                      }`
                    }
                  >
                    <Sliders className="w-4 h-4 text-slate-400" />
                    <span>Platform Settings</span>
                  </NavLink>
                </>
              )}
            </nav>
          </div>
        )}
      </div>

      {/* Footer info inside sidebar */}
      <div className="p-3 bg-slate-900/80 rounded-2xl border border-slate-800 text-[11px] text-slate-400">
        <div className="flex items-center space-x-1 text-cyan-400 font-semibold mb-1">
          <Sparkles className="w-3 h-3" />
          <span>EDGEZEN Engine v2.4</span>
        </div>
        <p className="text-[10px] leading-tight">Private Invitation-Only SaaS Protocol.</p>
      </div>
    </aside>
  );
};
