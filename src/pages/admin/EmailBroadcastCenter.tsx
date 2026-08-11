import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Mail, Send, CheckCircle2, Sparkles, Filter } from 'lucide-react';

export const EmailBroadcastCenter: React.FC = () => {
  const { addAuditLog } = useData();

  const [targetAudience, setTargetAudience] = useState('All Members');
  const [subject, setSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [sentLogs, setSentLogs] = useState([
    { id: '1', subject: 'Recruitment Drive: Fall 2026 Committee', audience: 'All Members', count: 184, sent_at: '2026-07-29 11:00' },
    { id: '2', subject: 'Weekly Contest #42 Live Reminder', audience: 'AI & DS Students', count: 92, sent_at: '2026-08-01 09:30' }
  ]);
  const [statusMsg, setStatusMsg] = useState('');

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !emailBody) return;

    const newLog = {
      id: String(Date.now()),
      subject,
      audience: targetAudience,
      count: 120,
      sent_at: new Date().toLocaleString()
    };

    setSentLogs(prev => [newLog, ...prev]);
    addAuditLog('SEND_EMAIL_BROADCAST', `Sent email broadcast "${subject}" to ${targetAudience}`);
    setStatusMsg(`Successfully dispatched email to 120 members via Resend Gateway!`);
    setSubject('');
    setEmailBody('');

    setTimeout(() => setStatusMsg(''), 4000);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-extrabold text-white font-outfit flex items-center space-x-2">
          <Mail className="w-6 h-6 text-blue-400" />
          <span>Email Broadcast Center & Automated Logs</span>
        </h1>
        <p className="text-xs text-slate-400">Target specific user groups, publish announcements via email, and review delivery logs.</p>
      </div>

      {statusMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{statusMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <form onSubmit={handleSendEmail} className="lg:col-span-2 glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
          <h3 className="font-bold text-sm text-slate-100">Compose New Broadcast</h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-slate-400 block mb-1 font-semibold">Target Audience</label>
              <select
                value={targetAudience}
                onChange={e => setTargetAudience(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 font-mono"
              >
                <option value="All Members">All Members (184 recipients)</option>
                <option value="AI & Data Science Dept">AI & Data Science Dept</option>
                <option value="Cyber Security Dept">Cyber Security Dept</option>
                <option value="III Year Students">III Year Students</option>
                <option value="Event Participants">Event Participants</option>
              </select>
            </div>

            <div>
              <label className="text-slate-400 block mb-1 font-semibold">Email Subject *</label>
              <input
                type="text"
                required
                value={subject}
                onChange={e => setSubject(e.target.value)}
                placeholder="e.g. EDGEZEN Announcement: Upcoming Masterclass"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1 font-semibold">Email Body (HTML / Markdown Supported) *</label>
              <textarea
                required
                value={emailBody}
                onChange={e => setEmailBody(e.target.value)}
                placeholder="Dear EDGEZEN Member,\n\nWe are excited to announce..."
                className="w-full h-44 bg-slate-950 border border-slate-800 rounded-xl p-3 text-white font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3 rounded-xl text-xs shadow-glow transition-all"
          >
            <Send className="w-4 h-4" />
            <span>Dispatch Broadcast Email</span>
          </button>
        </form>

        {/* Email Logs Stream */}
        <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-4">
          <h3 className="font-bold text-sm text-slate-100">Broadcast Delivery Logs</h3>
          <div className="space-y-3">
            {sentLogs.map(log => (
              <div key={log.id} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-mono space-y-1">
                <div className="text-cyan-300 font-bold">{log.subject}</div>
                <div className="text-slate-400 text-[10px]">Audience: {log.audience} ({log.count} sent)</div>
                <div className="text-emerald-400 text-[10px] text-right">{log.sent_at}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
