
import React from 'react';
import { Resource } from '../types';
import { Truck, Activity, Radio, ShieldAlert, Zap, Waves } from 'lucide-react';

interface ResourcePanelProps {
  resources: Resource[];
}

const getStatusStyles = (status: Resource['status']) => {
  switch (status) {
    case 'Available': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/20';
    case 'Active': return 'bg-blue-500/20 text-blue-400 border-blue-500/20';
    case 'En-Route': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/20';
    default: return 'bg-zinc-800 text-zinc-500 border-zinc-700';
  }
};

const ResourcePanel: React.FC<ResourcePanelProps> = ({ resources }) => {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="p-5 border-b border-zinc-800/60">
        <h2 className="text-sm font-black uppercase tracking-[0.2em] text-zinc-100">Tactical Assets</h2>
        <p className="text-[10px] text-zinc-500 font-mono">STATIONED & DEPLOYED UNITS</p>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {resources.map((resource) => (
          <div
            key={resource.id}
            className="p-4 rounded-xl border border-zinc-800/60 bg-zinc-900/30 group hover:border-zinc-700/60 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${getStatusStyles(resource.status).split(' ')[0].replace('/20', '')} shadow-[0_0_8px_currentColor]`} />
                <span className="text-[11px] font-black text-zinc-200 uppercase tracking-tight">{resource.name}</span>
              </div>
              <span className="text-[9px] text-zinc-600 font-mono font-bold uppercase">{resource.id}</span>
            </div>
            
            <div className="flex items-center space-x-2 mb-3">
              <span className={`text-[9px] font-black px-1.5 py-0.5 rounded border mono uppercase tracking-widest ${getStatusStyles(resource.status)}`}>
                {resource.status}
              </span>
              <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">/ {resource.type}</span>
            </div>
            
            <div className="flex flex-wrap gap-1.5">
              {resource.capabilities.map((cap, i) => (
                <div key={i} className="flex items-center px-2 py-1 rounded-md bg-zinc-800/40 border border-zinc-800/60 group-hover:bg-zinc-800/60 transition-colors">
                  <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-tight">{cap}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      {/* Quick Stats Panel */}
      <div className="p-4 bg-zinc-900/40 border-t border-zinc-800/60">
        <div className="grid grid-cols-2 gap-2">
          <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
            <span className="block text-[8px] font-black text-zinc-600 uppercase mb-1">Health Index</span>
            <span className="text-xs font-bold text-emerald-500 mono">98.4%</span>
          </div>
          <div className="p-3 rounded-lg bg-blue-500/5 border border-blue-500/10">
            <span className="block text-[8px] font-black text-zinc-600 uppercase mb-1">Response Avg</span>
            <span className="text-xs font-bold text-blue-500 mono">4m 12s</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourcePanel;
