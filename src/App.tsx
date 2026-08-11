import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { ThemeProvider } from './context/ThemeContext';
import { RoleSwitcherBar } from './components/layout/RoleSwitcherBar';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { EDGEZENAiDrawer } from './components/ai/EDGEZENAiDrawer';

// Pages
import { LoginView } from './pages/auth/LoginView';
import { EDGEZENHub } from './pages/student/EDGEZENHub';
import { MyProgress } from './pages/student/MyProgress';
import { DigitalMembershipCard } from './pages/student/DigitalMembershipCard';
import { ResourceLibrary } from './pages/resources/ResourceLibrary';
import { WeeklyContestList } from './pages/contests/WeeklyContestList';
import { CertificateVault } from './pages/certificates/CertificateVault';
import { SuperAdminDashboard } from './pages/admin/SuperAdminDashboard';
import { MemberManagement } from './pages/admin/MemberManagement';
import { EventManagement } from './pages/admin/EventManagement';
import { ContestManagement } from './pages/admin/ContestManagement';
import { EmailBroadcastCenter } from './pages/admin/EmailBroadcastCenter';
import { AuditLogsView } from './pages/admin/AuditLogsView';
import { SystemSettingsView } from './pages/admin/SystemSettingsView';
import { FacultyDashboard } from './pages/coordinators/FacultyDashboard';
import { StudentCoordinatorDashboard } from './pages/coordinators/StudentCoordinatorDashboard';
import { HallOfFame } from './pages/common/HallOfFame';
import { ClubCalendarView } from './pages/common/ClubCalendarView';
import { IdeasPortal } from './pages/common/IdeasPortal';
import { DiscussionForum } from './pages/common/DiscussionForum';
import { QrScannerView } from './pages/qr/QrScannerView';
import { Search, X } from 'lucide-react';

const AppLayout: React.FC = () => {
  const { currentUser } = useAuth();
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-black">
      {/* Top Role Switcher Bar */}
      <RoleSwitcherBar />

      {/* Main Navbar */}
      <Navbar
        onToggleAi={() => setIsAiOpen(!isAiOpen)}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Main Body Layout */}
      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-4 lg:p-8 max-w-7xl mx-auto w-full">
          <Routes>
            <Route path="/" element={<Navigate to="/student/hub" replace />} />
            <Route path="/student/hub" element={<EDGEZENHub />} />
            <Route path="/student/progress" element={<MyProgress />} />
            <Route path="/student/membership-card" element={<DigitalMembershipCard />} />
            <Route path="/resources" element={<ResourceLibrary />} />
            <Route path="/contests" element={<WeeklyContestList />} />
            <Route path="/certificates" element={<CertificateVault />} />
            <Route path="/calendar" element={<ClubCalendarView />} />
            <Route path="/hall-of-fame" element={<HallOfFame />} />
            <Route path="/ideas" element={<IdeasPortal />} />
            <Route path="/discussions" element={<DiscussionForum />} />
            <Route path="/qr-scanner" element={<QrScannerView />} />

            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={<SuperAdminDashboard />} />
            <Route path="/admin/members" element={<MemberManagement />} />
            <Route path="/admin/events" element={<EventManagement />} />
            <Route path="/admin/contests" element={<ContestManagement />} />
            <Route path="/admin/emails" element={<EmailBroadcastCenter />} />
            <Route path="/admin/audit-logs" element={<AuditLogsView />} />
            <Route path="/admin/settings" element={<SystemSettingsView />} />

            {/* Coordinator Routes */}
            <Route path="/faculty/dashboard" element={<FacultyDashboard />} />
            <Route path="/coordinator/dashboard" element={<StudentCoordinatorDashboard />} />

            <Route path="*" element={<Navigate to="/student/hub" replace />} />
          </Routes>
        </main>
      </div>

      {/* Floating EDGEZEN AI Copilot Drawer */}
      <EDGEZENAiDrawer isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} />

      {/* Global Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-start justify-center pt-20 p-4">
          <div className="glass-panel rounded-3xl p-6 max-w-xl w-full border border-cyan-500/40 space-y-4 shadow-glass animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2 flex-1">
                <Search className="w-4 h-4 text-cyan-400" />
                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Global search across events, contests, certificates, resources..."
                  className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none font-mono"
                />
              </div>
              <button onClick={() => setIsSearchOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto text-xs">
              <p className="text-[10px] text-slate-500 font-mono">Top Results:</p>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-cyan-300 font-mono">
                📅 Generative AI & Agentic Workflows Masterclass (Event)
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-amber-300 font-mono">
                🏆 Weekly AI Contest #42: Prompt Engineering (Live Contest)
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-emerald-300 font-mono">
                📜 AI Hackathon Winner Certificate (Certificate Vault)
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DataProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<LoginView />} />
              <Route path="/*" element={<AppLayout />} />
            </Routes>
          </BrowserRouter>
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
