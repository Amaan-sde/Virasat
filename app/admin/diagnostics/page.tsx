'use client';

import React, { useState, useEffect } from 'react';
import {
  Activity,
  Shield,
  Database,
  HardDrive,
  Cpu,
  Clock,
  RefreshCw,
  Server
} from 'lucide-react';

export default function AdminDiagnosticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchDiagnostics = () => {
    setLoading(true);
    fetch('/api/admin/diagnostics')
      .then(res => {
        if (!res.ok) throw new Error('Unauthorized');
        return res.json();
      })
      .then(resData => {
        if (resData?.diagnostics) setData(resData.diagnostics);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchDiagnostics();
  }, []);

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-purple-400 font-semibold mb-1">
            <Shield className="w-3.5 h-3.5" />
            <span>Developer / Super Admin Privilege</span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-amber-100">
            System & Infrastructure Diagnostics
          </h2>
          <p className="text-xs text-stone-400 mt-0.5">
            Technical health inspection, runtime memory consumption, and persistent database metrics.
          </p>
        </div>

        <button
          onClick={fetchDiagnostics}
          className="p-2.5 rounded-lg bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-300 hover:text-white transition flex items-center gap-2 text-xs uppercase tracking-wider"
        >
          <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
          <span>Refresh Metrics</span>
        </button>
      </div>

      {loading && !data ? (
        <div className="py-20 text-center text-xs text-stone-400 uppercase tracking-widest animate-pulse font-mono">
          Querying System Kernel & Runtime Diagnostics...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
          {/* Runtime */}
          <div className="p-6 rounded-2xl bg-stone-900/40 border border-stone-800 space-y-3">
            <div className="flex items-center justify-between text-stone-400">
              <span className="uppercase tracking-wider font-semibold">Node Runtime</span>
              <Server className="w-4 h-4 text-purple-400" />
            </div>
            <p className="font-mono text-2xl font-bold text-stone-100">{data?.nodeVersion}</p>
            <p className="text-[11px] text-stone-400">
              Platform: {data?.platform} ({data?.arch})
            </p>
          </div>

          {/* Memory */}
          <div className="p-6 rounded-2xl bg-stone-900/40 border border-stone-800 space-y-3">
            <div className="flex items-center justify-between text-stone-400">
              <span className="uppercase tracking-wider font-semibold">Memory Consumption</span>
              <Cpu className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="font-mono text-2xl font-bold text-emerald-300">
              {data?.memory?.heapUsedMb} MB
            </p>
            <p className="text-[11px] text-stone-400">
              RSS: {data?.memory?.rssMb} MB | Heap Total: {data?.memory?.heapTotalMb} MB
            </p>
          </div>

          {/* Database Health */}
          <div className="p-6 rounded-2xl bg-stone-900/40 border border-stone-800 space-y-3">
            <div className="flex items-center justify-between text-stone-400">
              <span className="uppercase tracking-wider font-semibold">Database Engine</span>
              <Database className="w-4 h-4 text-amber-400" />
            </div>
            <p className="font-mono text-2xl font-bold text-amber-300">
              {data?.database?.status || 'HEALTHY'}
            </p>
            <p className="text-[11px] text-stone-400">
              {data?.database?.type} | Size: {data?.database?.sizeKb} KB
            </p>
          </div>

          {/* Storage */}
          <div className="p-6 rounded-2xl bg-stone-900/40 border border-stone-800 space-y-3">
            <div className="flex items-center justify-between text-stone-400">
              <span className="uppercase tracking-wider font-semibold">Image Uploads Storage</span>
              <HardDrive className="w-4 h-4 text-blue-400" />
            </div>
            <p className="font-mono text-2xl font-bold text-white">
              {data?.storage?.uploadsCount} Assets
            </p>
            <p className="text-[11px] text-stone-400 truncate">
              Path: {data?.storage?.directory}
            </p>
          </div>

          {/* Process Uptime */}
          <div className="p-6 rounded-2xl bg-stone-900/40 border border-stone-800 space-y-3">
            <div className="flex items-center justify-between text-stone-400">
              <span className="uppercase tracking-wider font-semibold">Process Uptime</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <p className="font-mono text-2xl font-bold text-white">
              {Math.floor((data?.uptimeSeconds || 0) / 60)} minutes
            </p>
            <p className="text-[11px] text-stone-400">
              ({data?.uptimeSeconds || 0} seconds elapsed)
            </p>
          </div>

          {/* System Load */}
          <div className="p-6 rounded-2xl bg-stone-900/40 border border-stone-800 space-y-3">
            <div className="flex items-center justify-between text-stone-400">
              <span className="uppercase tracking-wider font-semibold">Host System Load</span>
              <Activity className="w-4 h-4 text-purple-400" />
            </div>
            <p className="font-mono text-base font-bold text-stone-100">
              {(data?.systemLoad || []).map((l: number) => l.toFixed(2)).join(', ')}
            </p>
            <p className="text-[11px] text-stone-400">
              1-min, 5-min, 15-min averages
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

