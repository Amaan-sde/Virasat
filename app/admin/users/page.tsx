'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  Plus,
  Shield,
  Mail,
  Phone,
  Calendar,
  Lock,
  X
} from 'lucide-react';
import { User, UserRole } from '@/types';
import { formatDateTime } from '@/lib/utils';
import { useToast } from '@/components/ui/ToastContext';

export default function AdminUsersPage() {
  const { success, error } = useToast();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('CLIENT');
  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchUsers = () => {
    setLoading(true);
    fetch('/api/admin/users')
      .then(res => {
        if (!res.ok) throw new Error('Unauthorized');
        return res.json();
      })
      .then(data => {
        if (data?.users) setUsers(data.users);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password) return;
    setSaving(true);

    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
          role,
          phone: phone.trim()
        })
      });

      const data = await res.json();
      if (res.ok) {
        success(`Administrative account for ${name} provisioned!`);
        setModalOpen(false);
        setName('');
        setEmail('');
        setPassword('');
        setPhone('');
        fetchUsers();
      } else {
        error(data.error || 'Failed to create user');
      }
    } catch {
      error('Server connection error');
    }
    setSaving(false);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-purple-400 font-semibold mb-1">
            <Shield className="w-3.5 h-3.5" />
            <span>Developer / Super Admin Privilege</span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-amber-100">
            Administrative Access & Account Control
          </h2>
          <p className="text-xs text-stone-400 mt-0.5">
            Manage store owner client accounts, permissions, and developer credentials.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-bold text-xs uppercase tracking-wider transition shadow-lg flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Provision Admin User</span>
        </button>
      </div>

      {/* Users Table */}
      <div className="rounded-2xl bg-stone-900/40 border border-stone-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-300">
            <thead>
              <tr className="bg-stone-950/80 border-b border-stone-800 text-stone-400 uppercase tracking-wider text-[10px]">
                <th className="p-4">Name & Identity</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role Permission</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Created On</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/80">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-stone-900/60 transition">
                  <td className="p-4 font-semibold text-stone-100">
                    {u.name}
                  </td>
                  <td className="p-4 text-stone-300 font-mono">
                    {u.email}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        u.role === 'DEVELOPER'
                          ? 'bg-purple-950 text-purple-300 border border-purple-800'
                          : u.role === 'CLIENT'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : 'bg-stone-900 text-stone-400 border border-stone-800'
                      }`}
                    >
                      {u.role === 'DEVELOPER' ? 'Developer (Super Admin)' : u.role === 'CLIENT' ? 'Client (Store Admin)' : 'Customer'}
                    </span>
                  </td>
                  <td className="p-4 text-stone-400">
                    {u.phone || '—'}
                  </td>
                  <td className="p-4 text-stone-500 font-mono">
                    {formatDateTime(u.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Provision Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <div className="relative z-10 w-full max-w-md bg-stone-950 border border-stone-800 rounded-2xl p-6 text-stone-100 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <h3 className="font-serif text-xl font-bold text-amber-100">
                Provision Administrative Account
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-stone-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block uppercase tracking-wider text-stone-300 font-medium mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Client Store Partner"
                  className="w-full bg-stone-900 border border-stone-800 rounded px-3 py-2 text-stone-100"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider text-stone-300 font-medium mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@virasat.com"
                  className="w-full bg-stone-900 border border-stone-800 rounded px-3 py-2 text-stone-100"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider text-stone-300 font-medium mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-stone-900 border border-stone-800 rounded px-3 py-2 text-stone-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block uppercase tracking-wider text-stone-300 font-medium mb-1">
                    Role Permission
                  </label>
                  <select
                    value={role}
                    onChange={e => setRole(e.target.value as UserRole)}
                    className="w-full bg-stone-900 border border-stone-800 rounded px-3 py-2 text-stone-100 font-medium"
                  >
                    <option value="CLIENT">Client (Store Admin)</option>
                    <option value="DEVELOPER">Developer (Super Admin)</option>
                  </select>
                </div>
                <div>
                  <label className="block uppercase tracking-wider text-stone-300 font-medium mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+91..."
                    className="w-full bg-stone-900 border border-stone-800 rounded px-3 py-2 text-stone-100"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-stone-800 text-stone-400 uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold uppercase tracking-wider disabled:opacity-50"
                >
                  {saving ? 'Creating...' : 'Provision User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

