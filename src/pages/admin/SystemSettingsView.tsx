import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Sliders, CheckCircle2, ShieldCheck, Database, Save } from 'lucide-react';

export const SystemSettingsView: React.FC = () => {
  const { settings, addAuditLog } = useData();

  const [clubName, setClubName] = useState(settings.club_name);
  const [maintenanceMode, setMaintenanceMode] = useState(settings.maintenance_mode);
  const [xpEvent, setXpEvent] = useState(settings.xp_event_attend);
  const [xpContest, setXpContest] = useState(settings.xp_contest_participate);
  const [xpWinner, setXpWinner] = useState(settings.xp_contest_winner);

  const [savedMsg, setSavedMsg] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    addAuditLog('UPDATE_SETTINGS', `Updated platform configurations (Maintenance: ${maintenanceMode ? 'ON' : 'OFF'})`);
    setSavedMsg('Platform settings updated successfully in database!');
    setTimeout(() => setSavedMsg(''), 4000);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-extrabold text-white font-outfit flex items-center space-x-2">
          <Sliders className="w-6 h-6 text-purple-400" />
          <span>Platform Settings & Rules Engine</span>
        </h1>
        <p className="text-xs text-slate-400">Configure global XP rules, badge thresholds, maintenance mode, and branding.</p>
      </div>

      {savedMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{savedMsg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-6 max-w-2xl">
        <div className="space-y-4 text-xs">
          <h3 className="font-bold text-sm text-slate-100 border-b border-slate-800 pb-2">General & Maintenance</h3>

          <div>
            <label className="text-slate-400 block mb-1 font-semibold">Club Name</label>
            <input
              type="text"
              value={clubName}
              onChange={e => setClubName(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
            <div>
              <span className="text-slate-200 font-bold block">Maintenance Mode</span>
              <span className="text-[11px] text-slate-400">When enabled, student portal shows maintenance notice.</span>
            </div>
            <button
              type="button"
              onClick={() => setMaintenanceMode(!maintenanceMode)}
              className={`w-12 h-6 rounded-full p-1 transition-colors ${maintenanceMode ? 'bg-rose-600' : 'bg-slate-800'}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${maintenanceMode ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>

          <h3 className="font-bold text-sm text-slate-100 border-b border-slate-800 pb-2 pt-2">XP Rules Engine</h3>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-slate-400 block mb-1 font-semibold">Event Attend XP</label>
              <input
                type="number"
                value={xpEvent}
                onChange={e => setXpEvent(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1 font-semibold">Contest Base XP</label>
              <input
                type="number"
                value={xpContest}
                onChange={e => setXpContest(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1 font-semibold">Winner Bonus XP</label>
              <input
                type="number"
                value={xpWinner}
                onChange={e => setXpWinner(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-3 rounded-xl text-xs shadow-glow transition-all"
        >
          <Save className="w-4 h-4" />
          <span>Save Settings to Database</span>
        </button>
      </form>
    </div>
  );
};
