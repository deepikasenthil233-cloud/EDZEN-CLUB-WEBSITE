import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Calendar, Plus, QrCode, CheckCircle2, X, Trash2 } from 'lucide-react';
import { EventItem, EventCategory } from '../../types';

export const EventManagement: React.FC = () => {
  const { events, eventRegistrations, addEvent, deleteEvent } = useData();
  const { currentUser } = useAuth();

  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<EventCategory>('AI & ML');
  const [eventDate, setEventDate] = useState('2026-08-25');
  const [eventTime, setEventTime] = useState('10:00 AM - 04:00 PM');
  const [venue, setVenue] = useState('Alan Turing Hall');
  const [maxParticipants, setMaxParticipants] = useState(120);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    const newEv: EventItem = {
      id: `event-${Date.now()}`,
      title,
      description,
      category,
      event_date: eventDate,
      event_time: eventTime,
      venue,
      max_participants: maxParticipants,
      registration_deadline: `${eventDate}T23:59:59Z`,
      organizer_id: currentUser?.id || 'admin',
      organizer_name: currentUser?.full_name || 'Super Admin',
      poster_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800',
      status: 'upcoming',
      xp_reward: 15,
      registered_count: 0,
      created_at: new Date().toISOString().split('T')[0],
      qr_code_secret: `PASS-${Date.now()}`
    };

    addEvent(newEv);
    setShowAddModal(false);
    setTitle('');
    setDescription('');
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white font-outfit flex items-center space-x-2">
            <Calendar className="w-6 h-6 text-emerald-400" />
            <span>Event Operations & Attendance Registry</span>
          </h1>
          <p className="text-xs text-slate-400">Schedule workshops, generate event passes, and manage participant registrations.</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-glow transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Event</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {events.map(ev => (
          <div key={ev.id} className="glass-card rounded-2xl p-5 border border-slate-800 space-y-4">
            <div className="flex items-start justify-between gap-2">
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2.5 py-0.5 rounded uppercase font-bold">
                {ev.category}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-cyan-400">+{ev.xp_reward} XP Reward</span>
                {currentUser?.role === 'super_admin' && (
                  <button onClick={() => deleteEvent(ev.id)} className="p-1 text-slate-400 hover:text-rose-400 transition-colors bg-slate-900 rounded-md border border-slate-700 hover:border-rose-500/50" title="Delete Event">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            <h3 className="font-extrabold text-base text-white">{ev.title}</h3>
            <p className="text-xs text-slate-400 line-clamp-2">{ev.description}</p>

            <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 text-xs font-mono space-y-1">
              <div className="flex justify-between"><span className="text-slate-500">Date & Time:</span><span className="text-slate-200">{ev.event_date} ({ev.event_time})</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Venue:</span><span className="text-slate-200">{ev.venue}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Registered:</span><span className="text-cyan-400 font-bold">{ev.registered_count} / {ev.max_participants}</span></div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Event Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleCreate} className="glass-panel rounded-3xl p-6 max-w-md w-full border border-emerald-500/40 space-y-4 shadow-glass">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-base text-white">Create Club Event</h3>
              <button type="button" onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1 font-semibold">Event Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Autonomous AI Agents Workshop"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-semibold">Description *</label>
                <textarea
                  required
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Event details..."
                  className="w-full h-24 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Date</label>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={e => setEventDate(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Venue</label>
                  <input
                    type="text"
                    value={venue}
                    onChange={e => setVenue(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-3 rounded-xl text-xs shadow-glow transition-all"
            >
              Publish Event & Generate QR Secret Pass
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
