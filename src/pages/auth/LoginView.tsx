import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, ShieldCheck, Lock, Mail, ArrowRight, UserCheck, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const LoginView: React.FC = () => {
  const { login, switchRole } = useAuth();
  const navigate = useNavigate();

  const [emailOrId, setEmailOrId] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleFormLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const success = login(emailOrId, password);
    if (success) {
      navigate('/student/hub');
    } else {
      setErrorMsg('Invalid username or password.');
    }
  };



  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Ambient glowing background */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 flex items-center justify-center mx-auto shadow-glow">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-wider font-outfit">EDGEZEN</h1>
          <p className="text-xs text-cyan-400 font-mono">Private Invitation-Only SaaS Platform</p>
        </div>

        {/* Login Box */}
        <div className="glass-panel rounded-3xl p-6 lg:p-8 border border-slate-800 space-y-6 shadow-glass">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 text-xs">
            <span className="text-slate-300 font-semibold flex items-center space-x-1">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>Secure Authentication</span>
            </span>
            <span className="text-[10px] text-rose-400 bg-rose-500/10 border border-rose-500/30 px-2 py-0.5 rounded font-mono font-bold">
              NO PUBLIC SIGNUP
            </span>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleFormLogin} className="space-y-4 text-xs">
            <div>
              <label className="text-slate-300 block mb-1.5 font-semibold">Username *</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={emailOrId}
                  onChange={e => setEmailOrId(e.target.value)}
                  placeholder="EDZEN_YOURNAME"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-300 block mb-1.5 font-semibold">Password *</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="8208E........"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <p className="text-[11px] text-cyan-300 bg-cyan-950/20 border border-cyan-500/20 rounded-xl p-3 font-mono">
              Member login: USERNAME: EDZEN_YOURNAME | PASSWORD: ERP NUMBER
            </p>

            <button
              type="submit"
              className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-3 rounded-xl text-xs shadow-glow transition-all"
            >
              <span>Authenticate & Enter Platform</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        <p className="text-[11px] text-slate-500 text-center font-mono">
          EDGEZEN Private Invitation Protocol • All rights reserved
        </p>
      </div>
    </div>
  );
};
