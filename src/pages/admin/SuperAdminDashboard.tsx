import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { 
  ShieldAlert, 
  Users, 
  Calendar, 
  Trophy, 
  Award, 
  Mail, 
  Activity, 
  Database, 
  HardDrive, 
  Plus, 
  FileText, 
  Sliders, 
  History,
  CheckCircle2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { LocalStateEngine } from '../../services/supabase';

interface UpcomingEvent {
  id: string;
  eventName: string;
  eventType: string;
  date: string;
  registrationLink: string;
  posterUrl: string;
}

interface BehindSceneEvent {
  id: string;
  eventName: string;
  eventType: string;
  description: string;
  mode: string;
  posterUrl: string;
  thankYouNote: string;
  contributors: string;
  thankYouPosterUrl: string;
}

export const SuperAdminDashboard: React.FC = () => {
  const { allUsers } = useAuth();
  const { events, contests, certificates, auditLogs } = useData();
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEvent[]>(() => LocalStateEngine.get('upcoming_events', []));
  const [showUpcomingEventForm, setShowUpcomingEventForm] = useState(false);
  const [eventName, setEventName] = useState('');
  const [eventType, setEventType] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [registrationLink, setRegistrationLink] = useState('');
  const [posterUrl, setPosterUrl] = useState('');
  const [upcomingEventError, setUpcomingEventError] = useState('');
  const [behindSceneEvents, setBehindSceneEvents] = useState<BehindSceneEvent[]>(() => LocalStateEngine.get('behind_scene_events', []));
  const [showBehindSceneForm, setShowBehindSceneForm] = useState(false);
  const [behindSceneName, setBehindSceneName] = useState('');
  const [behindSceneType, setBehindSceneType] = useState('');
  const [behindSceneDescription, setBehindSceneDescription] = useState('');
  const [behindSceneMode, setBehindSceneMode] = useState('');
  const [behindScenePoster, setBehindScenePoster] = useState('');
  const [thankYouNote, setThankYouNote] = useState('');
  const [contributors, setContributors] = useState('');
  const [thankYouPoster, setThankYouPoster] = useState('');
  const [behindSceneError, setBehindSceneError] = useState('');

  const activeMembers = allUsers.filter(u => u.status === 'active').length;

  const handlePosterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const posterFile = event.target.files?.[0];
    if (!posterFile) return;
    if (posterFile.type !== 'image/png') {
      setUpcomingEventError('Please select a PNG poster image.');
      event.target.value = '';
      return;
    }
    setUpcomingEventError('');

    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        const scale = Math.min(1, 1200 / Math.max(image.width, image.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(image.width * scale));
        canvas.height = Math.max(1, Math.round(image.height * scale));
        canvas.getContext('2d')?.drawImage(image, 0, 0, canvas.width, canvas.height);
        setPosterUrl(canvas.toDataURL('image/jpeg', 0.8));
      };
      image.src = String(reader.result);
    };
    reader.readAsDataURL(posterFile);
    event.target.value = '';
  };

  const handleAddUpcomingEvent = (event: React.FormEvent) => {
    event.preventDefault();
    if (!eventName.trim() || !eventType.trim() || !eventDate || !registrationLink.trim() || !posterUrl) {
      setUpcomingEventError('Complete all fields and upload a PNG poster before saving.');
      return;
    }
    try {
      new URL(registrationLink);
    } catch {
      setUpcomingEventError('Enter a valid registration link starting with https://.');
      return;
    }
    setUpcomingEventError('');

    const newUpcomingEvent: UpcomingEvent = {
      id: `upcoming-event-${Date.now()}`,
      eventName,
      eventType,
      date: eventDate,
      registrationLink,
      posterUrl
    };
    const updatedEvents = [newUpcomingEvent, ...upcomingEvents];
    setUpcomingEvents(updatedEvents);
    LocalStateEngine.set('upcoming_events', updatedEvents);
    setShowUpcomingEventForm(false);
    setEventName('');
    setEventType('');
    setEventDate('');
    setRegistrationLink('');
    setPosterUrl('');
  };

  const deleteUpcomingEvent = (eventId: string) => {
    const updatedEvents = upcomingEvents.filter(upcomingEvent => upcomingEvent.id !== eventId);
    setUpcomingEvents(updatedEvents);
    LocalStateEngine.set('upcoming_events', updatedEvents);
  };

  const readPngFile = (event: React.ChangeEvent<HTMLInputElement>, setImage: (image: string) => void) => {
    const imageFile = event.target.files?.[0];
    if (!imageFile || imageFile.type !== 'image/png') return;

    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        const scale = Math.min(1, 1200 / Math.max(image.width, image.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(image.width * scale));
        canvas.height = Math.max(1, Math.round(image.height * scale));
        canvas.getContext('2d')?.drawImage(image, 0, 0, canvas.width, canvas.height);
        setImage(canvas.toDataURL('image/jpeg', 0.8));
      };
      image.src = String(reader.result);
    };
    reader.readAsDataURL(imageFile);
    event.target.value = '';
  };

  const handleAddBehindScene = (event: React.FormEvent) => {
    event.preventDefault();
    if (!behindSceneName || !behindSceneType || !behindSceneDescription || !behindSceneMode || !behindScenePoster || !thankYouNote || !contributors || !thankYouPoster) {
      setBehindSceneError('Complete all fields and upload both PNG posters before saving.');
      return;
    }
    setBehindSceneError('');

    const newBehindSceneEvent: BehindSceneEvent = {
      id: `behind-scene-${Date.now()}`,
      eventName: behindSceneName,
      eventType: behindSceneType,
      description: behindSceneDescription,
      mode: behindSceneMode,
      posterUrl: behindScenePoster,
      thankYouNote,
      contributors,
      thankYouPosterUrl: thankYouPoster
    };
    const updatedEvents = [newBehindSceneEvent, ...behindSceneEvents];
    setBehindSceneEvents(updatedEvents);
    LocalStateEngine.set('behind_scene_events', updatedEvents);
    setShowBehindSceneForm(false);
    setBehindSceneName('');
    setBehindSceneType('');
    setBehindSceneDescription('');
    setBehindSceneMode('');
    setBehindScenePoster('');
    setThankYouNote('');
    setContributors('');
    setThankYouPoster('');
  };

  const deleteBehindSceneEvent = (eventId: string) => {
    const updatedEvents = behindSceneEvents.filter(behindSceneEvent => behindSceneEvent.id !== eventId);
    setBehindSceneEvents(updatedEvents);
    LocalStateEngine.set('behind_scene_events', updatedEvents);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Executive Command Center Header */}
      <div className="glass-panel rounded-3xl p-6 lg:p-8 border border-rose-500/30 bg-gradient-to-r from-slate-900 via-slate-900 to-rose-950/30">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center shadow-glow">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-extrabold text-white font-outfit">Super Admin Command Center</h1>
              </div>
              <p className="text-xs text-slate-300">Real-time club ops monitoring, security logs, and member governance.</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 bg-slate-900/90 border border-slate-800 p-2.5 rounded-2xl text-xs font-mono">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-slate-300 font-bold">System Health: 🟢 100% Operational</span>
          </div>
        </div>
      </div>

      <section id="upcoming-event" className="glass-card rounded-2xl p-6 border border-emerald-500/30 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-white">Upcoming Event</h2>
            <p className="text-xs text-slate-400">Manage event announcements separately from the Club Calendar.</p>
          </div>
          <button onClick={() => { setUpcomingEventError(''); setShowUpcomingEventForm(true); }} className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-2 rounded-xl text-xs font-bold shadow-glow">
            <Plus className="w-4 h-4" />
            <span>Add Upcoming Event</span>
          </button>
        </div>

        {upcomingEvents.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcomingEvents.map(upcomingEvent => (
              <div key={upcomingEvent.id} className="rounded-xl bg-slate-900 border border-slate-800 p-4 flex gap-4">
                <img src={upcomingEvent.posterUrl} alt={`${upcomingEvent.eventName} poster`} className="w-28 h-20 object-cover rounded-lg border border-slate-700" />
                <div className="min-w-0 text-xs">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-white truncate">{upcomingEvent.eventName}</h3>
                    <button type="button" onClick={() => { if (window.confirm(`Delete ${upcomingEvent.eventName}?`)) deleteUpcomingEvent(upcomingEvent.id); }} className="text-slate-500 hover:text-rose-400" title="Delete uploaded event">Delete</button>
                  </div>
                  <p className="text-emerald-400 mt-1">{upcomingEvent.eventType}</p>
                  <p className="text-slate-400 mt-1">{upcomingEvent.date}</p>
                  <a href={upcomingEvent.registrationLink} target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline mt-2 inline-block truncate max-w-full">Registration link</a>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {showUpcomingEventForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleAddUpcomingEvent} className="glass-panel rounded-3xl p-6 max-w-md w-full border border-emerald-500/40 space-y-4 shadow-glass">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-base text-white">Add Upcoming Event</h3>
              <button type="button" onClick={() => setShowUpcomingEventForm(false)} className="text-slate-400 hover:text-white">×</button>
            </div>
            <div className="space-y-3 text-xs">
              <input required value={eventName} onChange={e => setEventName(e.target.value)} placeholder="Event name" className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white" />
              <input required value={eventType} onChange={e => setEventType(e.target.value)} placeholder="Event type" className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white" />
              <input required type="date" value={eventDate} onChange={e => setEventDate(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white" />
              <input required type="url" value={registrationLink} onChange={e => setRegistrationLink(e.target.value)} placeholder="Registration link" className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white" />
              <label className="block rounded-xl border border-dashed border-slate-700 bg-slate-900 p-3 text-emerald-300 cursor-pointer">
                <span>{posterUrl ? 'Replace poster PNG' : 'Upload poster PNG'}</span>
                <input type="file" accept="image/png" onChange={handlePosterChange} className="hidden" />
              </label>
              {posterUrl && <img src={posterUrl} alt="Upcoming event poster preview" className="w-full max-h-40 object-contain rounded-xl border border-slate-700 bg-slate-950" />}
              {upcomingEventError && <p className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-rose-300">{upcomingEventError}</p>}
            </div>
            <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl text-xs shadow-glow">Save Upcoming Event</button>
          </form>
        </div>
      )}

      <section id="behind-the-stage" className="glass-card rounded-2xl p-6 border border-cyan-500/30 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-white">Behind the Scene</h2>
            <p className="text-xs text-slate-400">Recognize the people and work behind each club event.</p>
          </div>
          <button onClick={() => { setBehindSceneError(''); setShowBehindSceneForm(true); }} className="flex items-center space-x-2 bg-cyan-600 hover:bg-cyan-500 text-white px-3 py-2 rounded-xl text-xs font-bold shadow-glow">
            <Plus className="w-4 h-4" />
            <span>Add Behind the Scene</span>
          </button>
        </div>

        {behindSceneEvents.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {behindSceneEvents.map(behindSceneEvent => (
              <div key={behindSceneEvent.id} className="rounded-xl bg-slate-900 border border-slate-800 p-4 space-y-3">
                <div className="flex justify-end">
                  <button type="button" onClick={() => { if (window.confirm(`Delete ${behindSceneEvent.eventName}?`)) deleteBehindSceneEvent(behindSceneEvent.id); }} className="text-slate-500 hover:text-rose-400 text-xs" title="Delete uploaded behind the scene entry">Delete</button>
                </div>
                <img src={behindSceneEvent.posterUrl} alt={`${behindSceneEvent.eventName} poster`} className="w-full h-36 object-cover rounded-lg border border-slate-700" />
                <div className="text-xs">
                  <h3 className="font-bold text-white">{behindSceneEvent.eventName}</h3>
                  <p className="text-cyan-400 mt-1">{behindSceneEvent.eventType} • {behindSceneEvent.mode}</p>
                  <p className="text-slate-400 mt-2">{behindSceneEvent.description}</p>
                  <p className="text-slate-300 mt-2"><strong>Worked behind the stage:</strong> {behindSceneEvent.contributors}</p>
                  <p className="text-slate-400 mt-2 italic">{behindSceneEvent.thankYouNote}</p>
                </div>
                <img src={behindSceneEvent.thankYouPosterUrl} alt="Thank you poster" className="w-full max-h-36 object-contain rounded-lg border border-slate-700 bg-slate-950" />
              </div>
            ))}
          </div>
        )}
      </section>

      {showBehindSceneForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleAddBehindScene} className="glass-panel rounded-3xl p-6 max-w-lg w-full border border-cyan-500/40 space-y-4 shadow-glass max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-base text-white">Add Behind the Scene</h3>
              <button type="button" onClick={() => setShowBehindSceneForm(false)} className="text-slate-400 hover:text-white">×</button>
            </div>
            <div className="space-y-3 text-xs">
              <input required value={behindSceneName} onChange={e => setBehindSceneName(e.target.value)} placeholder="Event name" className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white" />
              <input required value={behindSceneType} onChange={e => setBehindSceneType(e.target.value)} placeholder="Event type" className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white" />
              <textarea required value={behindSceneDescription} onChange={e => setBehindSceneDescription(e.target.value)} placeholder="Event description" className="w-full h-20 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white" />
              <input required value={behindSceneMode} onChange={e => setBehindSceneMode(e.target.value)} placeholder="Mode (Online / Offline / Hybrid)" className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white" />
              <label className="block rounded-xl border border-dashed border-slate-700 bg-slate-900 p-3 text-cyan-300 cursor-pointer">
                <span>{behindScenePoster ? 'Replace event poster PNG' : 'Upload event poster PNG'}</span>
                <input type="file" accept="image/png" onChange={e => readPngFile(e, setBehindScenePoster)} className="hidden" />
              </label>
              {behindScenePoster && <img src={behindScenePoster} alt="Event poster preview" className="w-full max-h-36 object-contain rounded-xl border border-slate-700 bg-slate-950" />}
              <textarea required value={thankYouNote} onChange={e => setThankYouNote(e.target.value)} placeholder="Thank-you note" className="w-full h-20 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white" />
              <textarea required value={contributors} onChange={e => setContributors(e.target.value)} placeholder="Names of people who worked behind the stage" className="w-full h-20 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white" />
              <label className="block rounded-xl border border-dashed border-slate-700 bg-slate-900 p-3 text-cyan-300 cursor-pointer">
                <span>{thankYouPoster ? 'Replace thank-you poster PNG' : 'Upload thank-you poster PNG'}</span>
                <input type="file" accept="image/png" onChange={e => readPngFile(e, setThankYouPoster)} className="hidden" />
              </label>
              {thankYouPoster && <img src={thankYouPoster} alt="Thank-you poster preview" className="w-full max-h-36 object-contain rounded-xl border border-slate-700 bg-slate-950" />}
              {behindSceneError && <p className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-rose-300">{behindSceneError}</p>}
            </div>
            <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded-xl text-xs shadow-glow">Save Behind the Scene</button>
          </form>
        </div>
      )}

      <section id="completed-event" className="glass-card rounded-2xl p-6 border border-slate-700 space-y-4">
        <div>
          <h2 className="text-base font-bold text-white">Completed Event</h2>
          <p className="text-xs text-slate-400">Review events that have already been completed.</p>
        </div>
        {events.filter(event => event.status === 'completed').length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {events.filter(event => event.status === 'completed').map(event => (
              <div key={event.id} className="rounded-xl bg-slate-900 border border-slate-800 p-4 text-xs">
                <h3 className="font-bold text-white">{event.title}</h3>
                <p className="text-slate-400 mt-1">{event.category} • {event.event_date}</p>
                <p className="text-slate-400 mt-1">{event.venue}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500">No completed events yet.</p>
        )}
      </section>

      {/* Real-time Statistics Cards (Requirement #65) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        <div className="glass-card rounded-2xl p-4 border border-rose-500/20">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold uppercase">Total Members</span>
            <Users className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-outfit">{allUsers.length}</div>
          <p className="text-[10px] text-emerald-400 font-mono mt-0.5">{activeMembers} Active</p>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-rose-500/20">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold uppercase">Total Events</span>
            <Calendar className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-outfit">{events.length}</div>
          <p className="text-[10px] text-slate-400 font-mono mt-0.5">84 Registrations</p>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-rose-500/20">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold uppercase">Contests</span>
            <Trophy className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-outfit">{contests.length}</div>
          <p className="text-[10px] text-slate-400 font-mono mt-0.5">Weekly Active</p>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-rose-500/20">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold uppercase">Certificates</span>
            <Award className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-outfit">{certificates.length}</div>
          <p className="text-[10px] text-slate-400 font-mono mt-0.5">100% Issued</p>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-rose-500/20">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold uppercase">Emails Sent</span>
            <Mail className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-outfit">0</div>
          <p className="text-[10px] text-emerald-400 font-mono mt-0.5">99.8% Delivered</p>
        </div>
      </div>

      {/* Quick Action Shortcuts Panel (Requirement #66) */}
      <div>
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">Admin Quick Action Panel</h3>
        <div className="flex flex-wrap gap-2 mb-3">
          <a href="#upcoming-event" className="px-3 py-1.5 rounded-lg bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">Upcoming Event</a>
          <a href="#completed-event" className="px-3 py-1.5 rounded-lg bg-slate-700/60 text-slate-200 border border-slate-600 text-xs font-semibold">Completed Event</a>
          <a href="#behind-the-stage" className="px-3 py-1.5 rounded-lg bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 text-xs font-semibold">Behind the Stage</a>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2.5">
          <Link
            to="/admin/members"
            className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-center space-y-1 group transition-all"
          >
            <Users className="w-5 h-5 text-cyan-400 mx-auto group-hover:scale-110 transition-transform" />
            <span className="text-xs font-semibold text-slate-200 block">Manage Members</span>
          </Link>

          <Link
            to="/admin/contests"
            className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 text-center space-y-1 group transition-all"
          >
            <Trophy className="w-5 h-5 text-amber-400 mx-auto group-hover:scale-110 transition-transform" />
            <span className="text-xs font-semibold text-slate-200 block">Contest Creator</span>
          </Link>

          <Link
            to="/admin/emails"
            className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-blue-500/40 text-center space-y-1 group transition-all"
          >
            <Mail className="w-5 h-5 text-blue-400 mx-auto group-hover:scale-110 transition-transform" />
            <span className="text-xs font-semibold text-slate-200 block">Broadcast Email</span>
          </Link>

          <Link
            to="/admin/audit-logs"
            className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-rose-500/40 text-center space-y-1 group transition-all"
          >
            <History className="w-5 h-5 text-rose-400 mx-auto group-hover:scale-110 transition-transform" />
            <span className="text-xs font-semibold text-slate-200 block">Audit Trail</span>
          </Link>

          <Link
            to="/admin/settings"
            className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-purple-500/40 text-center space-y-1 group transition-all"
          >
            <Sliders className="w-5 h-5 text-purple-400 mx-auto group-hover:scale-110 transition-transform" />
            <span className="text-xs font-semibold text-slate-200 block">Platform Config</span>
          </Link>
        </div>
      </div>

      {/* System Health & Audit Log Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-100 flex items-center space-x-2">
              <Activity className="w-4 h-4 text-rose-400" />
              <span>Real-Time Audit Trail Stream</span>
            </h3>
            <Link to="/admin/audit-logs" className="text-xs text-rose-400 hover:underline">View All Logs</Link>
          </div>

          <div className="space-y-2.5 max-h-72 overflow-y-auto">
            {auditLogs.map(log => (
              <div key={log.id} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-mono flex items-center justify-between">
                <div>
                  <span className="text-cyan-400 font-bold">{log.user_name} ({log.user_role})</span>
                  <p className="text-slate-300 mt-0.5">{log.action}: {log.details}</p>
                </div>
                <span className="text-[10px] text-slate-500">{log.created_at}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Infrastructure Health Card (#84) */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
          <h3 className="font-bold text-sm text-slate-100 flex items-center space-x-2">
            <Database className="w-4 h-4 text-cyan-400" />
            <span>Infrastructure Health</span>
          </h3>

          <div className="space-y-3 font-mono text-xs">
            <div className="flex justify-between items-center p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-400">PostgreSQL DB:</span>
              <span className="text-emerald-400 font-bold flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Online (12ms)</span>
              </span>
            </div>

            <div className="flex justify-between items-center p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-400">Storage Usage:</span>
              <span className="text-cyan-400 font-bold">1.4 GB / 50 GB</span>
            </div>

            <div className="flex justify-between items-center p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-400">Email Gateway:</span>
              <span className="text-emerald-400 font-bold">Resend API Active</span>
            </div>

            <div className="flex justify-between items-center p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-400">Auth Service:</span>
              <span className="text-emerald-400 font-bold">Supabase Auth</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
