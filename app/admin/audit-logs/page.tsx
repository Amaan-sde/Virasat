'use client';

import React, { useState, useEffect } from 'react';
import {
  FileText,
  Shield,
  Clock,
  User,
  RefreshCw,
  Search
} from 'lucide-react';
import { AuditLog } from '@/types';
import { formatDateTime } from '@/lib/utils';

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchLogs = () => {
    setLoading(true);
    fetch('/api/admin/audit-logs?limit=150')
      .then(res => {
        if (!res.ok) throw new Error('Unauthorized');
        return res.json();
      })
      .then(data => {
        if (data?.logs) setLogs(data.logs);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter(
    l =>
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.userName.toLowerCase().includes(search.toLowerCase()) ||
      l.entity.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-purple-400 font-semibold mb-1">
            <Shield className="w-3.5 h-3.5" />
            <span>Developer / Super Admin Privilege</span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-amber-100">
            Administrative Audit Trail
          </h2>
          <p className="text-xs text-stone-400 mt-0.5">
            Immutable chronological logging of all platform modifications, order state changes, and logins.
          </p>
        </div>

        <button
          onClick={fetchLogs}
          className="p-2.5 rounded-lg bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-300 hover:text-white transition flex items-center gap-2 text-xs uppercase tracking-wider"
        >
          <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
          <span>Refresh Trail</span>
        </button>
      </div>

      {/* Search Filter */}
      <div className="p-3.5 rounded-xl bg-stone-900/50 border border-stone-800 max-w-md">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Filter by action, admin name, or entity..."
          className="w-full bg-stone-950 border border-stone-800 rounded px-3 py-1.5 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
        />
      </div>

      {/* Logs Table */}
      <div className="rounded-2xl bg-stone-900/40 border border-stone-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-300">
            <thead>
              <tr className="bg-stone-950/80 border-b border-stone-800 text-stone-400 uppercase tracking-wider text-[10px]">
                <th className="p-4">Timestamp</th>
                <th className="p-4">Admin Operator</th>
                <th className="p-4">Action Event</th>
                <th className="p-4">Entity</th>
                <th className="p-4">Details / Metadata</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/80 font-mono">
              {filteredLogs.map(l => (
                <tr key={l.id} className="hover:bg-stone-900/60 transition">
                  <td className="p-4 text-stone-400 text-[11px] whitespace-nowrap">
                    {formatDateTime(l.createdAt)}
                  </td>
                  <td className="p-4">
                    <span className="font-sans font-semibold text-stone-100 block">{l.userName}</span>
                    <span className="text-[10px] text-purple-400 uppercase">{l.userRole}</span>
                  </td>
                  <td className="p-4 font-bold text-amber-300">
                    {l.action}
                  </td>
                  <td className="p-4 text-stone-300">
                    {l.entity} {l.entityId ? `(#${l.entityId})` : ''}
                  </td>
                  <td className="p-4 text-[11px] text-stone-400 max-w-xs truncate font-sans">
                    {l.details ? JSON.stringify(l.details) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

