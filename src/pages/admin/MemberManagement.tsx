import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Users, Search, UserPlus, Upload, Shield, ShieldAlert, Award, UserCheck, Check, X, FileSpreadsheet } from 'lucide-react';
import { UserProfile, UserRole } from '../../types';

export const MemberManagement: React.FC = () => {
  const { allUsers, addUser, updateUserRole, updateUserStatus } = useAuth();
  const { addAuditLog } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);

  // New User Form State
  const [newFullName, setNewFullName] = useState('');
  const [newRegNo, setNewRegNo] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newDept, setNewDept] = useState('AI & Data Science');
  const [newYear, setNewYear] = useState('III Year');
  const [newRole, setNewRole] = useState<UserRole>('student_member');

  // Bulk CSV file upload raw text state
  const [csvText, setCsvText] = useState('');

  const filteredUsers = allUsers.filter(u => {
    const matchesSearch = u.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          u.register_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          u.member_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          u.college_email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === 'All' || u.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFullName || !newEmail || !newRegNo) return;

    const userObj: UserProfile = {
      id: `user-${Date.now()}`,
      full_name: newFullName,
      register_number: newRegNo,
      department: newDept,
      year: newYear,
      college_email: newEmail,
      member_id: `EDGEZEN${new Date().getFullYear()}${Math.floor(100 + Math.random() * 900)}`,
      role: newRole,
      status: 'active',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
      bio: 'Newly recruited EDGEZEN member.',
      skills: ['Python', 'AI Basics'],
      xp: 0,
      level: 1,
      streak_weeks: 1,
      profile_completion_pct: 70,
      joined_date: new Date().toISOString().split('T')[0]
    };

    addUser(userObj);
    addAuditLog('ADD_MEMBER', `Super Admin created member: ${newFullName} (${userObj.member_id})`);
    setShowAddModal(false);
    setNewFullName('');
    setNewRegNo('');
    setNewEmail('');
  };

  const handleBulkImport = () => {
    if (!csvText.trim()) return;
    const lines = csvText.trim().split('\n');
    let importedCount = 0;

    lines.forEach((line, idx) => {
      if (idx === 0 && line.toLowerCase().includes('name')) return; // Header row
      const parts = line.split(',').map(p => p.trim());
      if (parts.length >= 3) {
        const [name, regNo, dept, year, email] = parts;
        const userObj: UserProfile = {
          id: `user-bulk-${Date.now()}-${idx}`,
          full_name: name || `Student ${idx}`,
          register_number: regNo || `REG-${idx}`,
          department: dept || 'AI & Data Science',
          year: year || 'III Year',
          college_email: email || `student${idx}@college.edu`,
          member_id: `EDGEZEN2026${String(idx + 100).padStart(3, '0')}`,
          role: 'student_member',
          status: 'active',
          avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
          xp: 0,
          level: 1,
          streak_weeks: 1,
          profile_completion_pct: 60,
          joined_date: new Date().toISOString().split('T')[0]
        };
        addUser(userObj);
        importedCount++;
      }
    });

    addAuditLog('BULK_IMPORT', `Bulk imported ${importedCount} member accounts via CSV.`);
    setShowBulkModal(false);
    setCsvText('');
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white font-outfit flex items-center space-x-2">
            <Users className="w-6 h-6 text-cyan-400" />
            <span>Member Governance & Directory</span>
          </h1>
          <p className="text-xs text-slate-400">Private invitation-only account provisioner, RBAC manager, and bulk import tool.</p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowBulkModal(true)}
            className="flex items-center space-x-2 bg-slate-900 border border-slate-800 hover:border-cyan-500/50 text-slate-200 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all"
          >
            <Upload className="w-4 h-4 text-cyan-400" />
            <span>Bulk CSV Import</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-glow transition-all"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Single Member</span>
          </button>
        </div>
      </div>

      {/* Search Controls */}
      <div className="glass-card rounded-2xl p-4 border border-slate-800 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by name, register number, member ID, email..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <select
          value={selectedRole}
          onChange={e => setSelectedRole(e.target.value)}
          className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
        >
          <option value="All">All Roles</option>
          <option value="super_admin">Super Admin</option>
          <option value="faculty_coordinator">Faculty Coordinator</option>
          <option value="student_coordinator">Student Coordinator</option>
          <option value="student_member">Student Member</option>
        </select>
      </div>

      {/* Member Directory Table */}
      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 font-mono uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-3.5">Member</th>
                <th className="p-3.5">Member ID / Reg No</th>
                <th className="p-3.5">Dept & Year</th>
                <th className="p-3.5">Role</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">XP & Level</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredUsers.map(u => (
                <tr key={u.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="p-3.5 flex items-center space-x-3">
                    <img src={u.avatar_url} alt={u.full_name} className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-700" />
                    <div>
                      <div className="font-bold text-slate-200">{u.full_name}</div>
                      <div className="text-[10px] text-slate-400">{u.college_email}</div>
                    </div>
                  </td>
                  <td className="p-3.5 font-mono">
                    <span className="text-cyan-400 font-bold">{u.member_id}</span>
                    <span className="text-slate-500 block text-[10px]">{u.register_number}</span>
                  </td>
                  <td className="p-3.5 font-mono text-slate-300">
                    <div>{u.department}</div>
                    <div className="text-slate-500 text-[10px]">{u.year}</div>
                  </td>
                  <td className="p-3.5">
                    <select
                      value={u.role}
                      onChange={e => updateUserRole(u.id, e.target.value as UserRole)}
                      className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-[11px] font-mono text-cyan-300 focus:outline-none"
                    >
                      <option value="super_admin">Super Admin</option>
                      <option value="faculty_coordinator">Faculty Coordinator</option>
                      <option value="student_coordinator">Student Coordinator</option>
                      <option value="student_member">Student Member</option>
                    </select>
                  </td>
                  <td className="p-3.5">
                    <button
                      onClick={() => updateUserStatus(u.id, u.status === 'active' ? 'suspended' : 'active')}
                      className={`px-2.5 py-1 rounded-full border text-[10px] font-mono font-bold capitalize transition-colors ${
                        u.status === 'active'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                      }`}
                    >
                      {u.status}
                    </button>
                  </td>
                  <td className="p-3.5 font-mono text-slate-300">
                    <span className="text-cyan-400 font-bold">Lvl {u.level}</span>
                    <span className="text-slate-500 block text-[10px]">{u.xp} XP</span>
                  </td>
                  <td className="p-3.5 text-right font-mono text-[11px]">
                    <span className="text-slate-500">Joined {u.joined_date}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Single Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleCreateUser} className="glass-panel rounded-3xl p-6 max-w-md w-full border border-cyan-500/40 space-y-4 shadow-glass">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-base text-white">Create Member Account</h3>
              <button type="button" onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1 font-semibold">Full Name *</label>
                <input
                  type="text"
                  required
                  value={newFullName}
                  onChange={e => setNewFullName(e.target.value)}
                  placeholder="e.g. Srikant Sharma"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-semibold">Register Number *</label>
                <input
                  type="text"
                  required
                  value={newRegNo}
                  onChange={e => setNewRegNo(e.target.value)}
                  placeholder="e.g. 202611099"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-semibold">College Email *</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={e => setNewEmail(e.target.value)}
                  placeholder="e.g. srikant@college.edu"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Department</label>
                  <input
                    type="text"
                    value={newDept}
                    onChange={e => setNewDept(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Year</label>
                  <input
                    type="text"
                    value={newYear}
                    onChange={e => setNewYear(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-semibold">Role Assignment</label>
                <select
                  value={newRole}
                  onChange={e => setNewRole(e.target.value as UserRole)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                >
                  <option value="student_member">Student Member</option>
                  <option value="student_coordinator">Student Coordinator</option>
                  <option value="faculty_coordinator">Faculty Coordinator</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold py-3 rounded-xl text-xs shadow-glow transition-all"
            >
              Provision Account & Send Invitation Email
            </button>
          </form>
        </div>
      )}

      {/* Bulk CSV Import Modal */}
      {showBulkModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-panel rounded-3xl p-6 max-w-lg w-full border border-cyan-500/40 space-y-4 shadow-glass">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <FileSpreadsheet className="w-5 h-5 text-cyan-400" />
                <h3 className="font-extrabold text-base text-white">Bulk CSV Member Provisioner</h3>
              </div>
              <button type="button" onClick={() => setShowBulkModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Paste comma-separated rows in format: <code className="text-cyan-400 font-mono">Name, RegNo, Dept, Year, Email</code>
            </p>

            <textarea
              value={csvText}
              onChange={e => setCsvText(e.target.value)}
              placeholder={`Rahul Sharma, 202611090, AI & DS, III Year, rahul@college.edu\nAnanya Verma, 202611091, Cyber Security, II Year, ananya@college.edu`}
              className="w-full h-40 bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-slate-100 focus:outline-none focus:border-cyan-500"
            />

            <button
              onClick={handleBulkImport}
              className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-3 rounded-xl text-xs shadow-glow transition-all"
            >
              Parse & Create Accounts
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
