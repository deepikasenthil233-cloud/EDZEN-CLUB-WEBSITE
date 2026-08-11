import React from 'react';
import { useData } from '../../context/DataContext';
import { History, ShieldCheck } from 'lucide-react';

export const AuditLogsView: React.FC = () => {
  const { auditLogs } = useData();

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-extrabold text-white font-outfit flex items-center space-x-2">
          <History className="w-6 h-6 text-rose-400" />
          <span>Immutable Audit Logs & Governance Trail</span>
        </h1>
        <p className="text-xs text-slate-400">Complete immutable record of all administrative actions, role changes, and security events.</p>
      </div>

      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
        <div className="p-4 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between text-xs font-mono text-slate-300">
          <span className="flex items-center space-x-1.5 text-rose-400 font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>Audit Trail Integrity: Cryptographically Logged</span>
          </span>
          <span>{auditLogs.length} Log Entries Recorded</span>
        </div>

        <div className="divide-y divide-slate-800/80">
          {auditLogs.map(log => (
            <div key={log.id} className="p-4 hover:bg-slate-900/40 transition-colors text-xs font-mono">
              <div className="flex items-center justify-between mb-1">
                <span className="text-cyan-400 font-bold">{log.user_name} ({log.user_role})</span>
                <span className="text-[10px] text-slate-500">{log.created_at}</span>
              </div>
              <div className="text-slate-200"><span className="text-rose-400 font-bold">[{log.action}]</span> {log.details}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
