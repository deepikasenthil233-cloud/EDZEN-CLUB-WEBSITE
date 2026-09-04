import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import { 
  Bell, 
  Search, 
  Bot, 
  Sun, 
  Moon, 
  LogOut, 
  User, 
  ShieldCheck, 
  Camera,
  Sparkles,
  CheckCheck,
  X
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface NavbarProps {
  onToggleAi: () => void;
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleAi, onOpenSearch }) => {
  const { currentUser, updateProfile, logout } = useAuth();
  const { notifications, markAllNotificationsAsRead, markNotificationAsRead } = useData();
  const { theme, toggleTheme } = useTheme();

  const [showNotifDrawer, setShowNotifDrawer] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const handleProfileImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const imageFile = event.target.files?.[0];
    if (!imageFile || !imageFile.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        updateProfile({ avatar_url: reader.result });
      }
    };
    reader.readAsDataURL(imageFile);
    event.target.value = '';
  };

  return (
    <nav className="glass-panel sticky top-[37px] z-40 px-4 lg:px-6 py-3 flex items-center justify-between border-b border-slate-800">
      {/* Brand & Search */}
      <div className="flex items-center space-x-4">
        <Link to="/" className="flex items-center space-x-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 flex items-center justify-center shadow-glow group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-white animate-spin-slow" />
          </div>
          <div>
            <div className="font-extrabold text-lg tracking-wider text-white font-outfit flex items-center space-x-1">
              <span>EDGEZEN</span>
              <span className="text-xs bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 px-1.5 py-0.5 rounded font-mono">AI</span>
            </div>
            <p className="text-[10px] text-slate-400 tracking-tight font-medium">Enterprise Student SaaS Platform</p>
          </div>
        </Link>

        {/* Global Search Button */}
        <button
          onClick={onOpenSearch}
          className="hidden md:flex items-center space-x-2 bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 text-slate-400 hover:text-slate-200 px-3.5 py-1.5 rounded-xl text-xs transition-all w-64 shadow-inner"
        >
          <Search className="w-3.5 h-3.5 text-cyan-400" />
          <span>Search events, contests, resources...</span>
          <kbd className="ml-auto text-[10px] bg-slate-800 border border-slate-700 px-1.5 py-0.5 rounded text-slate-400 font-mono">⌘K</kbd>
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* EDGEZEN AI Assistant Drawer Toggle */}
        <button
          onClick={onToggleAi}
          className="flex items-center space-x-1.5 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white px-3 py-1.5 rounded-xl text-xs font-semibold shadow-glow-purple hover:scale-105 transition-all"
          title="Open EDGEZEN AI Assistant"
        >
          <Bot className="w-4 h-4 animate-bounce" />
          <span className="hidden sm:inline">EDGEZEN AI</span>
        </button>

        {/* Search Mobile Icon */}
        <button
          onClick={onOpenSearch}
          className="md:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400 transition-colors"
          title="Toggle Dark / Light Mode"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-cyan-400" />}
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifDrawer(!showNotifDrawer)}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400 transition-colors relative"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-cyan-500 text-black font-extrabold text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow-glow">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifDrawer && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 glass-panel rounded-2xl p-4 shadow-glass border border-slate-800 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center space-x-2">
                  <Bell className="w-4 h-4 text-cyan-400" />
                  <h4 className="font-bold text-sm text-slate-100">Notification Center</h4>
                </div>
                <div className="flex items-center space-x-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllNotificationsAsRead}
                      className="text-[11px] text-cyan-400 hover:underline flex items-center space-x-1"
                    >
                      <CheckCheck className="w-3 h-3" />
                      <span>Mark all read</span>
                    </button>
                  )}
                  <button onClick={() => setShowNotifDrawer(false)} className="text-slate-400 hover:text-slate-200">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="max-h-80 overflow-y-auto py-2 space-y-2">
                {notifications.length === 0 ? (
                  <p className="text-xs text-slate-500 py-4 text-center">No notifications right now.</p>
                ) : (
                  notifications.map(n => (
                    <div
                      key={n.id}
                      onClick={() => markNotificationAsRead(n.id)}
                      className={`p-3 rounded-xl border text-xs cursor-pointer transition-colors ${
                        n.is_read
                          ? 'bg-slate-900/40 border-slate-800 text-slate-400'
                          : 'bg-cyan-950/30 border-cyan-500/30 text-slate-200 hover:bg-cyan-900/40'
                      }`}
                    >
                      <div className="flex items-center justify-between font-semibold mb-1">
                        <span className="text-cyan-300">{n.title}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{n.created_at}</span>
                      </div>
                      <p className="text-slate-300 leading-relaxed">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Badge & Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center space-x-2 pl-2 pr-3 py-1 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 transition-all"
          >
            {currentUser?.avatar_url ? (
              <img
                src={currentUser.avatar_url}
                alt={currentUser.full_name}
                className="w-7 h-7 rounded-lg object-cover ring-1 ring-cyan-500/40"
              />
            ) : (
              <span className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-300 ring-1 ring-cyan-500/40 flex items-center justify-center text-[10px] font-bold">
                {currentUser?.full_name.slice(0, 2).toUpperCase()}
              </span>
            )}
            <div className="text-left hidden lg:block">
              <div className="text-xs font-bold text-slate-200 leading-tight">{currentUser?.full_name.split(' ')[0]}</div>
              <div className="text-[10px] text-cyan-400 font-mono">Lvl {currentUser?.level} • {currentUser?.xp} XP</div>
            </div>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-60 glass-panel rounded-2xl p-3 shadow-glass border border-slate-800 z-50">
              <div className="p-2 border-b border-slate-800 mb-2">
                <div className="font-bold text-sm text-slate-100">{currentUser?.full_name}</div>
                <div className="text-xs text-slate-400">{currentUser?.college_email}</div>
                <div className="mt-1.5 flex items-center justify-between text-[11px] bg-slate-900 p-1.5 rounded-lg font-mono">
                  <span className="text-slate-400">ID: {currentUser?.member_id}</span>
                  <span className="text-cyan-400 capitalize">{currentUser?.role.replace('_', ' ')}</span>
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <Link
                  to="/student/hub"
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white"
                >
                  <User className="w-3.5 h-3.5 text-cyan-400" />
                  <span>My EDGEZEN Hub</span>
                </Link>
                <label className="flex items-center space-x-2 p-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white cursor-pointer">
                  <Camera className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Change Profile Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfileImageChange}
                    className="hidden"
                  />
                </label>

                {currentUser?.role === 'super_admin' && (
                  <Link
                    to="/admin/dashboard"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center space-x-2 p-2 rounded-lg bg-rose-500/10 text-rose-300 border border-rose-500/20"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
                    <span>Admin Command Center</span>
                  </Link>
                )}

                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    logout();
                  }}
                  className="w-full flex items-center space-x-2 p-2 rounded-lg hover:bg-rose-500/20 text-rose-400 transition-colors mt-2 border-t border-slate-800"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
