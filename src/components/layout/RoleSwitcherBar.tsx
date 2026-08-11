import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { Shield, ShieldAlert, Award, UserCheck, Sparkles } from 'lucide-react';

export const RoleSwitcherBar: React.FC = () => {
  const { currentUser, switchRole } = useAuth();

  const roles: { role: UserRole; label: string; icon: React.ReactNode; color: string }[] = [
    { role: 'super_admin', label: 'Super Admin', icon: <ShieldAlert className="w-3.5 h-3.5" />, color: 'bg-rose-500/20 text-rose-300 border-rose-500/40 hover:bg-rose-500/30' },
    { role: 'faculty_coordinator', label: 'Faculty Coordinator', icon: <Shield className="w-3.5 h-3.5" />, color: 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30' },
    { role: 'student_coordinator', label: 'Student Coordinator', icon: <UserCheck className="w-3.5 h-3.5" />, color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30' },
    { role: 'student_member', label: 'Student Member', icon: <Award className="w-3.5 h-3.5" />, color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 hover:bg-cyan-500/30' }
  ];

  return (
    <div className="bg-slate-900/90 border-b border-cyan-500/20 px-4 py-2 flex flex-wrap items-center justify-between text-xs backdrop-blur-md z-50 sticky top-0">
      <div className="flex items-center space-x-2">
        <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
        <span className="font-bold tracking-wider uppercase text-slate-300">EDGEZEN Role Demonstrator:</span>
        <span className="text-slate-400 hidden sm:inline">Active persona:</span>
        <span className="font-semibold text-cyan-300">{currentUser?.full_name} ({currentUser?.role})</span>
      </div>

      <div className="flex items-center space-x-1.5 overflow-x-auto py-1">
        {roles.map(r => {
          const isActive = currentUser?.role === r.role;
          return (
            <button
              key={r.role}
              onClick={() => switchRole(r.role)}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-full border transition-all ${r.color} ${
                isActive ? 'ring-2 ring-cyan-400 font-bold scale-105 shadow-glow' : 'opacity-70 hover:opacity-100'
              }`}
              title={`Switch role view to ${r.label}`}
            >
              {r.icon}
              <span>{r.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
