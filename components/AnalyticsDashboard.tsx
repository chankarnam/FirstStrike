
import React from 'react';
import { Incident } from '../types';
import { TrendingUp, Users, AlertTriangle, Timer, Activity } from 'lucide-react';

interface AnalyticsDashboardProps {
  incidents: Incident[];
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ incidents }) => {
  return (
    <div className="flex-1 overflow-y-auto bg-[#050507] p-8 space-y-8">
      <div className="flex justify-between items-end mb-4">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tighter uppercase">BigQuery Insights</h2>
          <p className="text-[11px] text-zinc-500 font-mono tracking-[0.2em] uppercase mt-1">Simulated Historical Asset Telemetry</p>
        </div>
        <div className="flex space-x-4">
           <div className="px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-[10px] font-black text-zinc-400 uppercase tracking-widest">
             Export Report
           </div>
           <div className="px-4 py-2 rounded-lg bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest shadow-xl">
             Refresh Dataset
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="p-6 rounded-2xl glass border-zinc-800/60">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="text-[9px] text-emerald-500 font-bold uppercase mono">+12.4%</span>
          </div>
          <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1 block">Dispatch Efficiency</span>
          <span className="text-3xl font-black text-white mono">94.8%</span>
        </div>

        <div className="p-6 rounded-2xl glass border-zinc-800/60">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <Users className="w-5 h-5 text-blue-400" />
            </div>
            <span className="text-[9px] text-blue-500 font-bold uppercase mono">Active</span>
          </div>
          <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1 block">Unit Saturation</span>
          <span className="text-3xl font-black text-white mono">82%</span>
        </div>

        <div className="p-6 rounded-2xl glass border-zinc-800/60">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 rounded-xl bg-red-500/10 border border-red-500/20">
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
            <span className="text-[9px] text-red-500 font-bold uppercase mono">High Risk</span>
          </div>
          <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1 block">Anomaly Events</span>
          <span className="text-3xl font-black text-white mono">03</span>
        </div>

        <div className="p-6 rounded-2xl glass border-zinc-800/60">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20">
              <Timer className="w-5 h-5 text-purple-400" />
            </div>
            <span className="text-[9px] text-purple-500 font-bold uppercase mono">-2.1m</span>
          </div>
          <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1 block">Avg Response Time</span>
          <span className="text-3xl font-black text-white mono">4.2m</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="p-8 rounded-3xl bg-zinc-900/30 border border-zinc-800/60 h-96 relative flex items-center justify-center">
          <div className="absolute inset-0 opacity-10 flex items-center justify-center">
            <Activity className="w-48 h-48 text-zinc-500 animate-pulse" />
          </div>
          <div className="text-center z-10">
            <h4 className="text-xl font-black text-zinc-100 mb-2 uppercase tracking-tight">Post-Incident Correlation Map</h4>
            <p className="text-xs text-zinc-500 mb-6">Historical spatial analysis of fire growth vs drone deployment speed</p>
            <div className="flex space-x-2 justify-center">
              {[0.4, 0.7, 0.9, 0.6, 0.8, 0.5, 0.9, 1.0].map((v, i) => (
                <div key={i} className="w-8 bg-blue-600/20 border-t-2 border-blue-500 rounded-t" style={{ height: `${v * 100}px` }} />
              ))}
            </div>
          </div>
        </div>

        <div className="p-8 rounded-3xl bg-zinc-900/30 border border-zinc-800/60 h-96 flex flex-col">
          <h4 className="text-xl font-black text-zinc-100 mb-6 uppercase tracking-tight">Recent CAD Logs</h4>
          <div className="flex-1 space-y-4 overflow-y-auto pr-4">
            {incidents.map((inc, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-black/40 border border-zinc-800/40">
                <div className="flex items-center space-x-4">
                   <span className="text-[10px] text-zinc-600 font-mono font-black">{inc.id}</span>
                   <span className="text-xs font-bold text-zinc-300">{inc.type}</span>
                </div>
                <div className="flex items-center space-x-4">
                   <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded uppercase">{inc.status}</span>
                   <span className="text-[10px] text-zinc-500 mono">{new Date(inc.timestamp).toLocaleTimeString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
