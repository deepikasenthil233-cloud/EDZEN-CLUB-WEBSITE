import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { AiRecommendationCards } from '../../components/ai/AiRecommendationCards';
import { 
  Trophy, 
  Award, 
  BookOpen, 
  Calendar, 
  Flame, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight, 
  Sparkles, 
  QrCode, 
  Zap, 
  Target, 
  ChevronRight,
  TrendingUp,
  PartyPopper
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import confetti from 'canvas-confetti';

export const EDGEZENHub: React.FC = () => {
  const { currentUser } = useAuth();
  const { events, contests, certificates, eventRegistrations, registerForEvent } = useData();
  const navigate = useNavigate();

  const [selectedPassQr, setSelectedPassQr] = useState<string | null>(null);

  if (!currentUser) return null;

  const xpProgress = currentUser.xp % 100;
  const nextLevelXp = 100 - xpProgress;

  const myRegistrations = eventRegistrations.filter(r => r.student_id === currentUser.id);
  const myCertificates = certificates.filter(c => c.student_id === currentUser.id);

  const upcomingEvent = events.find(e => e.status === 'upcoming');
  const liveContest = contests.find(c => c.status === 'live');

  const isRegisteredForUpcoming = upcomingEvent 
    ? myRegistrations.some(r => r.event_id === upcomingEvent.id)
    : false;

  const myPassCode = upcomingEvent && isRegisteredForUpcoming
    ? myRegistrations.find(r => r.event_id === upcomingEvent.id)?.qr_pass_code
    : null;

  const analyticsData = [
    { month: 'Mar', XP: 120, Contests: 2, Events: 1 },
    { month: 'Apr', XP: 210, Contests: 4, Events: 2 },
    { month: 'May', XP: 340, Contests: 6, Events: 3 },
    { month: 'Jun', XP: 410, Contests: 8, Events: 4 },
    { month: 'Jul', XP: 480, Contests: 10, Events: 5 },
  ];

  const triggerCelebration = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* 1. Welcome Card (Requirement #19) */}
      <div className="glass-panel rounded-3xl p-6 lg:p-8 border border-cyan-500/20 relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-900/90 to-cyan-950/40">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center space-x-5">
            <div className="relative group">
              <img
                src={currentUser.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'}
                alt={currentUser.full_name}
                className="w-20 h-20 rounded-2xl object-cover ring-2 ring-cyan-500/50 shadow-glow"
              />
              <span className="absolute -bottom-1 -right-1 bg-cyan-500 text-black font-mono text-[10px] font-extrabold px-1.5 py-0.5 rounded-md shadow">
                Lvl {currentUser.level}
              </span>
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl lg:text-3xl font-extrabold text-white font-outfit">
                  Good Morning, {currentUser.full_name.split(' ')[0]} 👋
                </h1>
                <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
              </div>
              <p className="text-xs text-slate-300 font-medium mt-0.5">Welcome back to your personalized EDGEZEN Hub</p>
              
              <div className="flex flex-wrap items-center gap-2 mt-3 text-xs">
                <span className="bg-slate-800 text-slate-300 border border-slate-700 px-2.5 py-1 rounded-lg font-mono">
                  {currentUser.department} • {currentUser.year}
                </span>
                <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2.5 py-1 rounded-lg font-mono">
                  ID: {currentUser.member_id}
                </span>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-1 rounded-lg font-mono">
                  Active Member
                </span>
              </div>
            </div>
          </div>

          <div className="w-full md:w-auto bg-slate-900/90 border border-slate-800 p-4 rounded-2xl space-y-2 min-w-[240px]">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 font-semibold">XP Progress</span>
              <span className="text-cyan-400 font-mono font-bold">{currentUser.xp} / {(currentUser.level) * 100} XP</span>
            </div>
            <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden p-0.5">
              <div
                className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full transition-all duration-500 shadow-glow"
                style={{ width: `${xpProgress}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-400 text-right font-mono">
              {nextLevelXp} XP until Level {currentUser.level + 1} 🚀
            </p>
          </div>
        </div>
      </div>

      {/* 2. Animated Dashboard Statistics Cards (Requirement #19) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 lg:gap-4">
        <div className="glass-card rounded-2xl p-4 border border-cyan-500/20">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Current Rank</span>
            <Trophy className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-outfit">#4</div>
          <p className="text-[10px] text-cyan-400 font-mono mt-1">Top 5% in AI Dept</p>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-cyan-500/20">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total XP</span>
            <Zap className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-extrabold text-cyan-400 font-outfit">{currentUser.xp}</div>
          <p className="text-[10px] text-slate-400 font-mono mt-1">+65 XP this week</p>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-cyan-500/20">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Current Level</span>
            <Sparkles className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-extrabold text-purple-400 font-outfit">Lvl {currentUser.level}</div>
          <p className="text-[10px] text-slate-400 font-mono mt-1">Master Tier</p>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-cyan-500/20">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Certificates</span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-400 font-outfit">{myCertificates.length}</div>
          <p className="text-[10px] text-slate-400 font-mono mt-1">100% Verified</p>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-cyan-500/20 col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Streak</span>
            <Flame className="w-4 h-4 text-rose-500 animate-bounce" />
          </div>
          <div className="text-2xl font-extrabold text-rose-400 font-outfit">{currentUser.streak_weeks} Weeks 🔥</div>
          <p className="text-[10px] text-slate-400 font-mono mt-1">3 weeks to Badge reward</p>
        </div>
      </div>

      {/* 3. AI Personalized Recommendation Engine Cards (Requirement #52 & #162) */}
      <AiRecommendationCards />

      {/* 4. Quick Actions Panel (Requirement #20) */}
      <div>
        <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
          <Link
            to="/student/hub"
            className="glass-card rounded-xl p-3 text-center border border-slate-800 hover:border-cyan-500/40 group"
          >
            <Calendar className="w-5 h-5 text-cyan-400 mx-auto mb-1 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-semibold text-slate-200 block">Register Event</span>
          </Link>

          <Link
            to="/contests"
            className="glass-card rounded-xl p-3 text-center border border-slate-800 hover:border-amber-500/40 group"
          >
            <Trophy className="w-5 h-5 text-amber-400 mx-auto mb-1 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-semibold text-slate-200 block">Weekly Contest</span>
          </Link>

          <Link
            to="/certificates"
            className="glass-card rounded-xl p-3 text-center border border-slate-800 hover:border-emerald-500/40 group"
          >
            <Award className="w-5 h-5 text-emerald-400 mx-auto mb-1 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-semibold text-slate-200 block">Certificates</span>
          </Link>

          <Link
            to="/hall-of-fame"
            className="glass-card rounded-xl p-3 text-center border border-slate-800 hover:border-purple-500/40 group"
          >
            <Flame className="w-5 h-5 text-purple-400 mx-auto mb-1 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-semibold text-slate-200 block">Leaderboard</span>
          </Link>

          <Link
            to="/resources"
            className="glass-card rounded-xl p-3 text-center border border-slate-800 hover:border-blue-500/40 group"
          >
            <BookOpen className="w-5 h-5 text-blue-400 mx-auto mb-1 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-semibold text-slate-200 block">Resources</span>
          </Link>

          <Link
            to="/ideas"
            className="glass-card rounded-xl p-3 text-center border border-slate-800 hover:border-yellow-500/40 group"
          >
            <Sparkles className="w-5 h-5 text-yellow-400 mx-auto mb-1 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-semibold text-slate-200 block">Submit Idea</span>
          </Link>

          <button
            onClick={triggerCelebration}
            className="glass-card rounded-xl p-3 text-center border border-slate-800 hover:border-rose-500/40 group col-span-2 sm:col-span-1"
          >
            <PartyPopper className="w-5 h-5 text-rose-400 mx-auto mb-1 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-semibold text-slate-200 block">Celebrate</span>
          </button>
        </div>
      </div>

      {/* 5. Main Widgets Grid (Upcoming Event & Live Contest) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Event Widget (#36) */}
        {upcomingEvent && (
          <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-slate-800 relative overflow-hidden flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-base text-slate-100">Featured Upcoming Event</h3>
              </div>
              <span className="text-xs bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2.5 py-1 rounded-full font-mono font-semibold">
                +{upcomingEvent.xp_reward} XP Reward
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <img
                src={upcomingEvent.poster_url}
                alt={upcomingEvent.title}
                className="rounded-xl object-cover h-40 w-full md:w-auto ring-1 ring-slate-800"
              />
              <div className="md:col-span-2 space-y-2">
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider bg-cyan-950/40 border border-cyan-500/30 px-2 py-0.5 rounded">
                  {upcomingEvent.category}
                </span>
                <h4 className="font-extrabold text-lg text-white leading-snug">{upcomingEvent.title}</h4>
                <p className="text-xs text-slate-400 line-clamp-2">{upcomingEvent.description}</p>

                <div className="flex flex-wrap gap-3 text-xs text-slate-300 font-mono py-1">
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{upcomingEvent.event_date} ({upcomingEvent.event_time})</span>
                  </span>
                  <span>📍 {upcomingEvent.venue}</span>
                </div>

                <div className="pt-2 flex items-center gap-3">
                  {isRegisteredForUpcoming ? (
                    <button
                      onClick={() => setSelectedPassQr(myPassCode || 'PASS-GENAI-DEEPIKA')}
                      className="flex items-center space-x-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-4 py-2 rounded-xl text-xs font-bold hover:bg-emerald-500/30 transition-all"
                    >
                      <QrCode className="w-4 h-4" />
                      <span>View QR Event Pass</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => registerForEvent(upcomingEvent.id)}
                      className="flex items-center space-x-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-5 py-2 rounded-xl text-xs font-bold shadow-glow transition-all"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Register Now (+{upcomingEvent.xp_reward} XP)</span>
                    </button>
                  )}
                  <span className="text-xs text-slate-400 font-mono">{upcomingEvent.registered_count} / {upcomingEvent.max_participants} registered</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Live Contest Widget (#37) */}
        {liveContest && (
          <div className="glass-card rounded-2xl p-6 border border-amber-500/30 flex flex-col justify-between bg-gradient-to-b from-amber-950/20 to-slate-900/90">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center space-x-1">
                  <Trophy className="w-4 h-4" />
                  <span>Weekly Contest Live</span>
                </span>
                <span className="text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2 py-0.5 rounded-full font-mono animate-pulse">
                  Ends Soon
                </span>
              </div>

              <h4 className="font-extrabold text-base text-white leading-snug">{liveContest.title}</h4>
              <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">{liveContest.description}</p>

              <div className="mt-4 p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1.5 font-mono text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Duration:</span>
                  <span className="text-amber-400 font-bold">{liveContest.duration_minutes} Mins</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Reward:</span>
                  <span className="text-cyan-400 font-bold">+{liveContest.xp_reward} XP (+100 Winner)</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Difficulty:</span>
                  <span className="text-purple-400 font-bold">{liveContest.difficulty}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate('/contests')}
              className="mt-5 w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-black font-extrabold py-2.5 rounded-xl text-xs shadow-glow transition-all"
            >
              <span>Take Contest Challenge</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* 6. Personal Analytics Chart (#21) */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-slate-100 flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              <span>Personal Analytics & XP Growth Trend</span>
            </h3>
            <p className="text-xs text-slate-400">Monthly progress across weekly contests and events</p>
          </div>
          <Link to="/student/progress" className="text-xs text-cyan-400 hover:underline flex items-center space-x-1 font-semibold">
            <span>Detailed Reports</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="h-64 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={analyticsData}>
              <defs>
                <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0284c7" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#0284c7" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
              />
              <Area type="monotone" dataKey="XP" stroke="#38bdf8" fillOpacity={1} fill="url(#colorXp)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* QR Event Pass Modal */}
      {selectedPassQr && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-panel rounded-3xl p-6 max-w-sm w-full border border-cyan-500/40 text-center space-y-4 shadow-glass animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center mx-auto text-cyan-400">
              <QrCode className="w-6 h-6" />
            </div>

            <div>
              <h3 className="font-extrabold text-lg text-white">EDGEZEN Official QR Pass</h3>
              <p className="text-xs text-slate-400">Scan at venue door for automated attendance check-in</p>
            </div>

            <div className="bg-white p-4 rounded-2xl inline-block shadow-lg border-2 border-cyan-500">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(selectedPassQr)}`}
                alt="QR Event Pass"
                className="w-44 h-44 mx-auto"
              />
            </div>

            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-xs font-mono text-left space-y-1">
              <div className="flex justify-between"><span className="text-slate-400">Student:</span><span className="text-slate-200 font-semibold">{currentUser.full_name}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Member ID:</span><span className="text-cyan-400 font-semibold">{currentUser.member_id}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Pass Hash:</span><span className="text-emerald-400 font-semibold">{selectedPassQr}</span></div>
            </div>

            <button
              onClick={() => setSelectedPassQr(null)}
              className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 py-2.5 rounded-xl text-xs font-bold transition-all"
            >
              Close Pass
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
