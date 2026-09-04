import React from 'react';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { LocalStateEngine } from '../../services/supabase';
import { Plus, Trophy, X } from 'lucide-react';

interface HallOfFameWinner {
  id: string;
  eventName: string;
  eventType: string;
  memberName: string;
  winningPosition: string;
  certificateUrl: string;
}

export const HallOfFame: React.FC = () => {
  const { currentUser } = useAuth();
  const [winners, setWinners] = useState<HallOfFameWinner[]>(() => LocalStateEngine.get('hall_of_fame_winners', []));
  const [showAddForm, setShowAddForm] = useState(false);
  const [eventName, setEventName] = useState('');
  const [eventType, setEventType] = useState('');
  const [memberName, setMemberName] = useState('');
  const [winningPosition, setWinningPosition] = useState('');
  const [certificateUrl, setCertificateUrl] = useState('');
  const [formError, setFormError] = useState('');

  const handleCertificateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const certificateFile = event.target.files?.[0];
    if (!certificateFile) return;
    if (certificateFile.type !== 'image/png') {
      setFormError('Please select a PNG certificate.');
      event.target.value = '';
      return;
    }
    setFormError('');

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') setCertificateUrl(reader.result);
    };
    reader.readAsDataURL(certificateFile);
    event.target.value = '';
  };

  const handleAddWinner = (event: React.FormEvent) => {
    event.preventDefault();
    if (!eventName.trim() || !eventType.trim() || !memberName.trim() || !winningPosition.trim() || !certificateUrl) {
      setFormError('Complete all fields and upload a PNG certificate before saving.');
      return;
    }
    setFormError('');

    const winner: HallOfFameWinner = {
      id: `winner-${Date.now()}`,
      eventName,
      eventType,
      memberName,
      winningPosition,
      certificateUrl
    };
    const updatedWinners = [...winners, winner];
    setWinners(updatedWinners);
    LocalStateEngine.set('hall_of_fame_winners', updatedWinners);
    setShowAddForm(false);
    setEventName('');
    setEventType('');
    setMemberName('');
    setWinningPosition('');
    setCertificateUrl('');
  };

  const deleteWinner = (winnerId: string) => {
    const updatedWinners = winners.filter(winner => winner.id !== winnerId);
    setWinners(updatedWinners);
    LocalStateEngine.set('hall_of_fame_winners', updatedWinners);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {currentUser?.id === 'super-admin-deepika' && (
        <div className="flex justify-end">
          <button onClick={() => { setFormError(''); setShowAddForm(true); }} className="flex items-center space-x-2 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-glow">
            <Plus className="w-4 h-4" />
            <span>Add Winner</span>
          </button>
        </div>
      )}

      {winners.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {winners.map(winner => (
            <div key={winner.id} className="glass-card rounded-3xl p-6 border border-rose-500/30 space-y-4 bg-gradient-to-b from-slate-900 via-slate-900 to-rose-950/20">
              {currentUser?.id === 'super-admin-deepika' && (
                <div className="flex justify-end">
                  <button type="button" onClick={() => { if (window.confirm(`Delete ${winner.memberName} from the Hall of Fame?`)) deleteWinner(winner.id); }} className="text-slate-500 hover:text-rose-400 text-xs" title="Delete uploaded winner">Delete</button>
                </div>
              )}
              <Trophy className="w-8 h-8 text-amber-400" />
              <div className="text-xs text-slate-400">{winner.eventType}</div>
              <div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold">{winner.eventName}</span>
                <h3 className="font-extrabold text-lg text-white mt-1">{winner.memberName}</h3>
                <p className="text-xs text-rose-400 font-mono font-semibold">{winner.winningPosition}</p>
              </div>
              <img src={winner.certificateUrl} alt={`${winner.memberName} certificate`} className="w-full max-h-48 object-contain rounded-xl border border-slate-700 bg-slate-950" />
            </div>
          ))}
        </div>
      )}

      {showAddForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleAddWinner} className="glass-panel rounded-3xl p-6 max-w-md w-full border border-rose-500/40 space-y-4 shadow-glass">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-base text-white">Add Hall of Fame Winner</h3>
              <button type="button" onClick={() => setShowAddForm(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3 text-xs">
              <input required value={eventName} onChange={e => setEventName(e.target.value)} placeholder="Event name" className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white" />
              <input required value={eventType} onChange={e => setEventType(e.target.value)} placeholder="Event type" className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white" />
              <input required value={memberName} onChange={e => setMemberName(e.target.value)} placeholder="Member name" className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white" />
              <input required value={winningPosition} onChange={e => setWinningPosition(e.target.value)} placeholder="Winning position" className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white" />
              <label className="block rounded-xl border border-dashed border-slate-700 bg-slate-900 p-3 text-cyan-300 cursor-pointer">
                <span>{certificateUrl ? 'Replace certificate PNG' : 'Upload certificate PNG'}</span>
                <input type="file" accept="image/png" onChange={handleCertificateChange} className="hidden" />
              </label>
              {certificateUrl && <img src={certificateUrl} alt="Certificate preview" className="w-full max-h-32 object-contain rounded-xl border border-slate-700 bg-slate-950" />}
              {formError && <p className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-rose-300">{formError}</p>}
            </div>
            <button type="submit" className="w-full bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold py-3 rounded-xl text-xs shadow-glow">Add Winner</button>
          </form>
        </div>
      )}
    </div>
  );
};
