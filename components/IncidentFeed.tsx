
import React from 'react';
import { Incident, Severity } from '../types';
import { Clock, MapPin, AlertCircle } from 'lucide-react';

interface IncidentFeedProps {
  incidents: Incident[];
  onSelect: (incident: Incident) => void;
}

const getSeverityStyles = (sev: Severity) => {
  switch (sev) {
    case 'Critical': return 'text-red-400 border-red-500/50 bg-red-500/10';
    case 'High': return 'text-orange-400 border-orange-500/50 bg-orange-500/10';
    case 'Medium': return 'text-yellow-400 border-yellow-500/50 bg-yellow-500/10';
    default: return 'text-blue-400 border-blue-500/50 bg-blue-500/10';
  }
};

const IncidentFeed: React.FC<IncidentFeedProps> = ({ incidents, onSelect }) => {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="p-5 border-b border-zinc-800/60 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-black uppercase tracking-[0.2em] text-zinc-100">Live Alerts</h2>
          <p className="text-[10px] text-zinc-500 font-mono">MONITORING ACTIVE CHANNELS</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          <span className="text-[10px] font-bold text-red-500/80 tracking-widest uppercase">Signal High</span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {incidents.map((incident) => (
          <button
            key={incident.id}
            onClick={() => onSelect(incident)}
            className={`w-full text-left p-4 rounded-xl border border-zinc-800/60 bg-zinc-900/20 hover:bg-zinc-800/40 hover:border-zinc-700 transition-all duration-300 group ${incident.severity === 'Critical' ? 'pulse-critical' : ''}`}
          >
            <div className="flex justify-between items-start mb-3">
              <span className={`text-[9px] font-black px-2 py-0.5 rounded-sm border mono ${getSeverityStyles(incident.severity)}`}>
                {incident.severity.toUpperCase()}
              </span>
              <span className="text-[10px] text-zinc-500 flex items-center mono">
                <Clock className="w-3 h-3 mr-1 opacity-60" />
                {new Date(incident.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            
            <h3 className="text-sm font-bold text-zinc-200 group-hover:text-white mb-1 tracking-tight flex items-center">
              {incident.type}
            </h3>
            
            <div className="flex items-center text-[11px] text-zinc-400 mb-3 font-medium">
              <MapPin className="w-3 h-3 mr-1.5 text-zinc-600" />
              <span className="truncate">{incident.location.address}</span>
            </div>
            
            <div className="p-2.5 rounded-lg bg-black/40 border border-zinc-800/40 group-hover:border-zinc-700/60 transition-colors">
              <p className="text-[11px] text-zinc-500 leading-relaxed line-clamp-2">
                {incident.description}
              </p>
            </div>
            
            <div className="mt-3 pt-3 border-t border-zinc-800/40 flex justify-between items-center">
              <span className="text-[9px] text-zinc-600 mono font-bold uppercase tracking-widest">{incident.id}</span>
              <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest group-hover:text-blue-400 transition-colors">Details →</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default IncidentFeed;
