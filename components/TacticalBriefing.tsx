
import React from 'react';
import { Globe, ExternalLink, MapPin, Search } from 'lucide-react';

interface TacticalBriefingProps {
  grounding: any;
}

const TacticalBriefing: React.FC<TacticalBriefingProps> = ({ grounding }) => {
  const chunks = grounding?.groundingChunks || [];

  return (
    <div className="glass p-5 rounded-2xl shadow-2xl border-blue-500/20 w-80 flex flex-col max-h-[380px] animate-in fade-in slide-in-from-left-4 duration-500">
      <div className="flex items-center space-x-3 mb-4 flex-shrink-0">
        <div className="p-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20">
          <Search className="w-4 h-4 text-blue-400" />
        </div>
        <div>
          <h4 className="text-[10px] font-black text-zinc-100 uppercase tracking-widest leading-none">Intelligence Feed</h4>
          <p className="text-[8px] text-zinc-500 mono font-bold mt-1">GROUNDED SOURCES</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
        {chunks.map((chunk: any, i: number) => {
          if (chunk.web) {
            return (
              <a 
                key={i}
                href={chunk.web.uri} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-start space-x-3 p-3 rounded-xl bg-zinc-900/40 border border-zinc-800/60 hover:border-blue-500/30 hover:bg-zinc-900 transition-all group"
              >
                <div className="mt-1 p-1 rounded-md bg-zinc-800 border border-zinc-700">
                  <Globe className="w-3 h-3 text-zinc-500 group-hover:text-blue-400" />
                </div>
                <div className="flex-1 overflow-hidden">
                  <span className="block text-[10px] font-black text-zinc-300 truncate group-hover:text-white">{chunk.web.title}</span>
                  <span className="block text-[8px] text-zinc-500 truncate mt-0.5 mono">{chunk.web.uri}</span>
                </div>
                <ExternalLink className="w-3 h-3 text-zinc-700 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            );
          }
          if (chunk.maps) {
            return (
              <a 
                key={i}
                href={chunk.maps.uri} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-start space-x-3 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20 hover:border-emerald-500/40 transition-all group"
              >
                <div className="mt-1 p-1 rounded-md bg-emerald-500/10 border border-emerald-500/20">
                  <MapPin className="w-3 h-3 text-emerald-400" />
                </div>
                <div className="flex-1 overflow-hidden">
                  <span className="block text-[10px] font-black text-emerald-100 truncate">{chunk.maps.title}</span>
                  <span className="block text-[8px] text-emerald-500/60 truncate mt-0.5 mono tracking-tighter">SECURE EVAC POINT</span>
                </div>
              </a>
            );
          }
          return null;
        })}

        {!chunks.length && (
          <div className="py-8 flex flex-col items-center justify-center opacity-30">
            <Globe className="w-8 h-8 text-zinc-700 mb-2" />
            <span className="text-[9px] font-black uppercase tracking-widest">Awaiting Live Citations</span>
          </div>
        )}
      </div>
      
      {chunks.length > 0 && (
        <div className="mt-2 pt-2 border-t border-zinc-800/40 flex justify-center">
          <div className="w-1 h-1 rounded-full bg-blue-500/20 animate-bounce" />
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #27272a; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #3b82f6; }
      `}</style>
    </div>
  );
};

export default TacticalBriefing;
