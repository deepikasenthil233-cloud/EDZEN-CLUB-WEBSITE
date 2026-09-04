import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, Plus, X } from 'lucide-react';
import { EventItem } from '../../types';

export const ClubCalendarView: React.FC = () => {
  const { events, contests, addEvent } = useData();
  const { currentUser } = useAuth();
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('10:00 AM - 04:00 PM');
  const [venue, setVenue] = useState('');

  const handleCreateEvent = (event: React.FormEvent) => {
    event.preventDefault();
    if (!currentUser || !title || !description || !eventDate || !venue) return;

    const newEvent: EventItem = {
      id: `event-${Date.now()}`,
      title,
      description,
      category: 'Workshop',
      event_date: eventDate,
      event_time: eventTime,
      venue,
      max_participants: 120,
      registration_deadline: `${eventDate}T23:59:59Z`,
      organizer_id: currentUser.id,
      organizer_name: currentUser.full_name,
      poster_url: '',
      status: 'upcoming',
      xp_reward: 15,
      registered_count: 0,
      created_at: new Date().toISOString().split('T')[0],
      qr_code_secret: `PASS-${Date.now()}`
    };

    addEvent(newEvent);
    setShowAddModal(false);
    setTitle('');
    setDescription('');
    setEventDate('');
    setVenue('');
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white font-outfit flex items-center space-x-2">
            <CalendarIcon className="w-6 h-6 text-purple-400" />
            <span>Interactive Club Calendar</span>
          </h1>
          <p className="text-xs text-slate-400">Track upcoming workshops, contest deadlines, hackathons, and release dates.</p>
        </div>

        <div className="flex items-center space-x-1.5 bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs font-mono">
          {(['month', 'week', 'day'] as const).map(mode => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-3 py-1 rounded-lg capitalize transition-all ${
                viewMode === mode ? 'bg-purple-600 text-white font-bold shadow-glow' : 'text-slate-400 hover:text-white'
              }`}
            >
              {mode} View
            </button>
          ))}
        </div>
        {currentUser?.id === 'super-admin-deepika' && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-3 py-2 rounded-xl text-xs font-bold shadow-glow"
          >
            <Plus className="w-4 h-4" />
            <span>Add Club Event</span>
          </button>
        )}
      </div>

      <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between font-mono text-xs border-b border-slate-800 pb-3">
          <span className="text-white font-bold text-sm">August 2026</span>
          <div className="flex space-x-1">
            <button className="p-1 rounded bg-slate-900 border border-slate-800 text-slate-300"><ChevronLeft className="w-4 h-4" /></button>
            <button className="p-1 rounded bg-slate-900 border border-slate-800 text-slate-300"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>

        <div className="space-y-3">
          {events.map(e => (
            <div key={e.id} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex flex-col items-center justify-center shrink-0">
                  <span className="text-[10px] uppercase font-bold">AUG</span>
                  <span className="text-sm font-extrabold">{e.event_date.split('-')[2] || '10'}</span>
                </div>
                <div>
                  <div className="font-bold text-slate-200">{e.title}</div>
                  <div className="text-slate-400 text-[11px]">{e.venue} ({e.event_time})</div>
                </div>
              </div>
              <span className="text-cyan-400 font-bold">+{e.xp_reward} XP</span>
            </div>
          ))}

          {contests.map(c => (
            <div key={c.id} className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/30 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex flex-col items-center justify-center shrink-0">
                  <span className="text-[10px] uppercase font-bold">LIVE</span>
                  <span className="text-sm font-extrabold">🏆</span>
                </div>
                <div>
                  <div className="font-bold text-amber-300">{c.title}</div>
                  <div className="text-slate-400 text-[11px]">Weekly Contest • {c.duration_minutes} Mins</div>
                </div>
              </div>
              <span className="text-amber-400 font-bold">+{c.xp_reward} XP</span>
            </div>
          ))}
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleCreateEvent} className="glass-panel rounded-3xl p-6 max-w-md w-full border border-emerald-500/40 space-y-4 shadow-glass">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-base text-white">Add Club Event</h3>
              <button type="button" onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <input required value={title} onChange={e => setTitle(e.target.value)} placeholder="Event title" className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white" />
              <textarea required value={description} onChange={e => setDescription(e.target.value)} placeholder="Event description" className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white" />
              <div className="grid grid-cols-2 gap-2">
                <input required type="date" value={eventDate} onChange={e => setEventDate(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white" />
                <input required value={eventTime} onChange={e => setEventTime(e.target.value)} placeholder="10:00 AM - 04:00 PM" className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white" />
              </div>
              <input required value={venue} onChange={e => setVenue(e.target.value)} placeholder="Venue" className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white" />
            </div>

            <button type="submit" className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-3 rounded-xl text-xs shadow-glow">
              Add Event to Calendar
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
