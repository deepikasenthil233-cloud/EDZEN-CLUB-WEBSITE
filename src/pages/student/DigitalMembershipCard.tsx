import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { CreditCard, Download, Printer, ShieldCheck, Sparkles } from 'lucide-react';

export const DigitalMembershipCard: React.FC = () => {
  const { currentUser } = useAuth();
  if (!currentUser) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white font-outfit flex items-center space-x-2">
            <CreditCard className="w-6 h-6 text-cyan-400" />
            <span>EDGEZEN Digital Membership Card</span>
          </h1>
          <p className="text-xs text-slate-400">Official verified digital pass for club access and event check-in.</p>
        </div>

        <div className="flex items-center space-x-2 no-print">
          <button
            onClick={handlePrint}
            className="flex items-center space-x-2 bg-slate-900 border border-slate-800 hover:border-cyan-500/50 text-slate-200 px-4 py-2 rounded-xl text-xs font-semibold transition-all"
          >
            <Printer className="w-4 h-4 text-cyan-400" />
            <span>Print Pass</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center space-x-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-glow transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF Card</span>
          </button>
        </div>
      </div>

      {/* Card Visual Container */}
      <div className="flex justify-center py-6">
        <div className="w-full max-w-md bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/80 border-2 border-cyan-500/40 rounded-3xl p-6 shadow-glass relative overflow-hidden space-y-6">
          {/* Glowing backdrop */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
            <div className="flex items-center space-x-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-glow">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-white tracking-wider font-outfit">EDGEZEN</h3>
                <p className="text-[9px] text-cyan-400 font-mono tracking-tight">AI & DATA SCIENCE CLUB</p>
              </div>
            </div>

            <span className="flex items-center space-x-1 text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2.5 py-1 rounded-full font-mono font-bold">
              <ShieldCheck className="w-3 h-3" />
              <span>ACTIVE MEMBER</span>
            </span>
          </div>

          {/* Student Info & QR Code */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <img
                src={currentUser.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'}
                alt={currentUser.full_name}
                className="w-20 h-20 rounded-2xl object-cover ring-2 ring-cyan-500/50 shadow-glow"
              />
              <div className="space-y-1">
                <h4 className="font-extrabold text-base text-white">{currentUser.full_name}</h4>
                <p className="text-xs text-cyan-300 font-medium">{currentUser.department}</p>
                <p className="text-xs text-slate-400">{currentUser.year} • Reg: {currentUser.register_number}</p>
                <div className="text-[10px] text-slate-400 font-mono pt-1">
                  Joined: {currentUser.joined_date}
                </div>
              </div>
            </div>

            <div className="bg-white p-2 rounded-xl shadow border border-cyan-400 shrink-0">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(currentUser.member_id)}`}
                alt="Member QR"
                className="w-20 h-20"
              />
            </div>
          </div>

          {/* Footer Bar */}
          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
            <div>
              <span className="text-slate-500 text-[10px] uppercase block">Member ID</span>
              <span className="text-cyan-400 font-bold tracking-wider">{currentUser.member_id}</span>
            </div>
            <div className="text-right">
              <span className="text-slate-500 text-[10px] uppercase block">Role</span>
              <span className="text-slate-200 capitalize font-bold">{currentUser.role.replace('_', ' ')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
