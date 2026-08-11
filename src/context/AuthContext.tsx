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
  updateUserRole: (userId: string, newRole: UserRole) => void;
  updateUserStatus: (userId: string, status: UserProfile['status']) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
    return found || (users.length > 0 ? users[0] : null); // Default to first user or null if empty
  });

  useEffect(() => {
    LocalStateEngine.set('users', users);
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('edgezen_active_user_id', currentUser.id);
    }
  }, [currentUser]);

  const login = (emailOrMemberId: string, _pass: string): boolean => {
    if (users.length === 0) {
      // Create first user as Super Admin
      const firstUser: UserProfile = {
        id: `user-${Date.now()}`,
        full_name: emailOrMemberId.split('@')[0],
        register_number: 'ADMIN-001',
        department: 'Administration',
        year: 'System Admin',
        college_email: emailOrMemberId.includes('@') ? emailOrMemberId : `${emailOrMemberId}@college.edu`,
        member_id: emailOrMemberId,
        role: 'super_admin',
        status: 'active',
        avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
        bio: 'First User - Platform Super Admin',
        skills: ['System Administration'],
        xp: 0,
        level: 1,
        streak_weeks: 0,
        profile_completion_pct: 100,
        joined_date: new Date().toISOString().split('T')[0],
        notification_preferences: { email: true, in_app: true, contests: true, events: true }
      };
      setUsers([firstUser]);
      setCurrentUser(firstUser);
      return true;
    }

    const found = users.find(
      u => u.college_email.toLowerCase() === emailOrMemberId.toLowerCase() ||
           u.member_id.toLowerCase() === emailOrMemberId.toLowerCase()
    );
    if (found) {
      setCurrentUser(found);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('edgezen_active_user_id');
  };

  const switchRole = (role: UserRole) => {
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
