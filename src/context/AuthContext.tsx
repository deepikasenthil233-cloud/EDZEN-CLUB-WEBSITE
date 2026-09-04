import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';
import { MOCK_USERS, LocalStateEngine } from '../services/supabase';

interface AuthContextType {
  currentUser: UserProfile | null;
  login: (emailOrMemberId: string, pass: string) => boolean;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  updateProfile: (updated: Partial<UserProfile>) => void;
  allUsers: UserProfile[];
  addUser: (user: UserProfile) => void;
  updateUserAvatar: (userId: string, avatarUrl: string) => void;
  deleteUser: (userId: string) => void;
  updateUserRole: (userId: string, newRole: UserRole) => void;
  updateUserStatus: (userId: string, status: UserProfile['status']) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SUPER_ADMIN_ID = 'super-admin-deepika';
const SUPER_ADMIN_USERNAME = 'admin_deepika';
const SUPER_ADMIN_PASSWORD = 'deepika_2006';
const LEGACY_SUPER_ADMIN_AVATAR = 'photo-1507003211169';

const createSuperAdminProfile = (): UserProfile => ({
  id: SUPER_ADMIN_ID,
  full_name: 'Deepika',
  register_number: 'ADMIN-001',
  department: 'Administration',
  year: 'System Admin',
  college_email: 'admin_deepika@edgezen.local',
  member_id: SUPER_ADMIN_USERNAME,
  role: 'super_admin',
  status: 'active',
  bio: 'Platform Super Admin',
  skills: ['System Administration'],
  xp: 0,
  level: 1,
  streak_weeks: 0,
  profile_completion_pct: 100,
  joined_date: new Date().toISOString().split('T')[0],
  notification_preferences: { email: true, in_app: true, contests: true, events: true }
});

const normalizeSuperAdmin = (user: UserProfile): UserProfile => ({
  ...user,
  member_id: SUPER_ADMIN_USERNAME,
  role: 'super_admin',
  avatar_url: user.avatar_url?.includes(LEGACY_SUPER_ADMIN_AVATAR) ? undefined : user.avatar_url
});

const getMemberUsername = (fullName: string): string =>
  `EDZEN_${fullName.trim().toUpperCase().replace(/[^A-Z0-9]+/g, '_')}`;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<UserProfile[]>(() => {
    let stored = LocalStateEngine.get<UserProfile[]>('users', MOCK_USERS);
    // Force clear old mock data so the new first-login flow works
    if (stored.some(u => u.id === 'user-001' || u.id === 'user-admin')) {
      localStorage.clear();
      stored = [];
    }
    return stored;
  });

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const savedId = localStorage.getItem('edgezen_active_user_id');
    const found = users.find(u => u.id === savedId);
    if (!found || found.status !== 'active') return null;
    return found.id === SUPER_ADMIN_ID ? normalizeSuperAdmin(found) : found;
  });

  useEffect(() => {
    LocalStateEngine.set('users', users);
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('edgezen_active_user_id', currentUser.id);
    }
  }, [currentUser]);

  const login = (emailOrMemberId: string, pass: string): boolean => {
    if (emailOrMemberId === SUPER_ADMIN_USERNAME && pass === SUPER_ADMIN_PASSWORD) {
      const existingSuperAdmin = users.find(user => user.id === SUPER_ADMIN_ID);
      const superAdmin = existingSuperAdmin
        ? normalizeSuperAdmin(existingSuperAdmin)
        : createSuperAdminProfile();
      setUsers(prev => existingSuperAdmin
        ? prev.map(user => user.id === SUPER_ADMIN_ID ? superAdmin : user)
        : [superAdmin, ...prev]);
      setCurrentUser(superAdmin);
      return true;
    }

    const found = users.find(user =>
      user.id !== SUPER_ADMIN_ID &&
      (user.member_id.toLowerCase() === emailOrMemberId.trim().toLowerCase() ||
        getMemberUsername(user.full_name).toLowerCase() === emailOrMemberId.trim().toLowerCase()) &&
      user.register_number.trim().toLowerCase() === pass.trim().toLowerCase()
    );
    if (!found) {
      const normalizedUsername = emailOrMemberId.trim().toUpperCase();
      if (!normalizedUsername.startsWith('EDZEN_') || normalizedUsername.length <= 6 || !pass.trim()) {
        return false;
      }

      const fullName = normalizedUsername.slice(6).replace(/_/g, ' ').trim();
      const newMember: UserProfile = {
        id: `user-${Date.now()}`,
        full_name: fullName,
        register_number: pass.trim(),
        department: 'Not specified',
        year: 'Not specified',
        college_email: `${fullName.toLowerCase().replace(/\s+/g, '.')}@college.edu`,
        member_id: normalizedUsername,
        role: 'student_member',
        status: 'active',
        xp: 0,
        level: 1,
        streak_weeks: 0,
        profile_completion_pct: 40,
        joined_date: new Date().toISOString().split('T')[0]
      };
      setUsers(prev => [newMember, ...prev]);
      setCurrentUser(newMember);
      return true;
    }

    setCurrentUser(found);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('edgezen_active_user_id');
  };

  const switchRole = (role: UserRole) => {
    if (role === 'super_admin' && currentUser?.id !== SUPER_ADMIN_ID) {
      return;
    }
    const target = users.find(u => u.role === role);
    if (target) {
      setCurrentUser(target);
    } else if (currentUser) {
      const updated = { ...currentUser, role };
      setCurrentUser(updated);
      setUsers(prev => prev.map(u => u.id === currentUser.id ? updated : u));
    }
  };

  const updateProfile = (updated: Partial<UserProfile>) => {
    if (!currentUser) return;
    const newProfile = { ...currentUser, ...updated };
    setCurrentUser(newProfile);
    setUsers(prev => prev.map(u => u.id === currentUser.id ? newProfile : u));
  };

  const addUser = (newUser: UserProfile) => {
    setUsers(prev => [newUser, ...prev]);
  };

  const updateUserAvatar = (userId: string, avatarUrl: string) => {
    setUsers(prev => prev.map(user => user.id === userId ? { ...user, avatar_url: avatarUrl } : user));
    if (currentUser?.id === userId) {
      setCurrentUser(prev => prev ? { ...prev, avatar_url: avatarUrl } : null);
    }
  };

  const deleteUser = (userId: string) => {
    if (userId === SUPER_ADMIN_ID) return;
    setUsers(prev => prev.filter(user => user.id !== userId));
    if (currentUser?.id === userId) {
      setCurrentUser(null);
      localStorage.removeItem('edgezen_active_user_id');
    }
  };

  const updateUserRole = (userId: string, newRole: UserRole) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    if (currentUser && currentUser.id === userId) {
      setCurrentUser(prev => prev ? { ...prev, role: newRole } : null);
    }
  };

  const updateUserStatus = (userId: string, status: UserProfile['status']) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status } : u));
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      login,
      logout,
      switchRole,
      updateProfile,
      allUsers: users,
      addUser,
      updateUserAvatar,
      deleteUser,
      updateUserRole,
      updateUserStatus
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
