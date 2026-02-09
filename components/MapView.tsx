
import React from 'react';
import { Incident, Resource } from '../types';

interface MapViewProps {
  incidents: Incident[];
  resources: Resource[];
  onIncidentClick: (incident: Incident) => void;
}

const MapView: React.FC<MapViewProps> = ({ incidents, resources, onIncidentClick }) => {
  const project = (lat: number, lng: number) => {
    const x = ((lng + 118.4) / 0.3) * 100;
    const y = ((34.2 - lat) / 0.3) * 100;
    return { x, y };
  };

  return (
    <div className="relative w-full h-full bg-[#050507] overflow-hidden border-zinc-800/60 border-x">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: `
          linear-gradient(rgba(39, 39, 42, 0.3) 1px, transparent 1px),
          linear-gradient(90deg, rgba(39, 39, 42, 0.3) 1px, transparent 1px)
        `,
        backgroundSize: '32px 32px'
      }} />
      
      <div className="scanning-line" />
      
      {/* Digital Topography Hints (SVG) */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.03]" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path d="M0,50 Q25,45 50,50 T100,50" fill="none" stroke="white" strokeWidth="0.1" />
        <path d="M0,30 Q25,35 50,30 T100,30" fill="none" stroke="white" strokeWidth="0.1" />
        <path d="M0,70 Q25,65 50,70 T100,70" fill="none" stroke="white" strokeWidth="0.1" />
      </svg>

      {/* Constraint HUD */}
      <div className="absolute top-6 right-6 flex flex-col space-y-3 pointer-events-none">
        <div className="glass px-4 py-2 rounded-lg flex items-center space-x-3 shadow-2xl">
          <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_8px_cyan]" />
          <div className="flex flex-col">
            <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Environmental</span>
            <span className="text-[11px] font-bold text-cyan-400 mono">WIND: NW 15.4 KTS</span>
          </div>
        </div>
        <div className="glass px-4 py-2 rounded-lg flex items-center space-x-3 border-red-900/30">
          <div className="w-1.5 h-1.5 bg-red-600 rounded-full shadow-[0_0_8px_red]" />
          <div className="flex flex-col">
            <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Airspace Status</span>
            <span className="text-[11px] font-bold text-red-500 mono">TFR-ACTIVE (3NM)</span>
          </div>
        </div>
      </div>

      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* Resource Trails/Vectors could go here */}
        
        {/* Resources (Blue Diamonds) */}
        {resources.map((res) => {
          const { x, y } = project(res.location.lat, res.location.lng);
          return (
            <g key={res.id}>
              <circle cx={x} cy={y} r="1.5" className="fill-blue-500/10" />
              <rect x={x-0.4} y={y-0.4} width="0.8" height="0.8" transform={`rotate(45 ${x} ${y})`} className="fill-blue-400" />
              <text x={x + 1} y={y + 0.5} className="fill-zinc-500 text-[1px] mono font-bold uppercase">{res.name}</text>
            </g>
          );
        })}

        {/* Incident Hotspots (Rings and Crosses) */}
        {incidents.map((inc) => {
          const { x, y } = project(inc.location.lat, inc.location.lng);
          const isCritical = inc.severity === 'Critical';
          return (
            <g key={inc.id} className="cursor-pointer pointer-events-auto group" onClick={() => onIncidentClick(inc)}>
              <circle 
                cx={x} cy={y} r={isCritical ? "4.5" : "2.5"} 
                className={`${isCritical ? 'fill-red-500/10 stroke-red-500/30' : 'fill-orange-500/10 stroke-orange-500/30'} animate-pulse`} 
                strokeWidth="0.1"
              />
              <circle cx={x} cy={y} r={isCritical ? "0.8" : "0.5"} className={isCritical ? 'fill-red-500' : 'fill-orange-500'} />
              <g className="opacity-40">
                <line x1={x-2} y1={y} x2={x+2} y2={y} stroke={isCritical ? '#ef4444' : '#f97316'} strokeWidth="0.05" />
                <line x1={x} y1={y-2} x2={x} y2={y+2} stroke={isCritical ? '#ef4444' : '#f97316'} strokeWidth="0.05" />
              </g>
            </g>
          );
        })}
      </svg>

      {/* Map Metadata / Coordinate HUD */}
      <div className="absolute bottom-6 left-6 flex space-x-6">
        <div className="glass p-4 rounded-xl flex items-center space-x-4">
          <div className="flex flex-col border-r border-zinc-800 pr-4">
            <span className="text-[9px] font-black uppercase text-zinc-500 mb-1">Grid System</span>
            <span className="text-[11px] font-bold text-zinc-300 mono">UTM ZONE 11S</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] font-black uppercase text-zinc-500 mb-1">Status</span>
            <div className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
              <span className="text-[11px] font-bold text-zinc-300 mono uppercase tracking-tight">Geo-Sync Locked</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;
