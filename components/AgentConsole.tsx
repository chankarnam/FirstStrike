
import React from 'react';
import { CommandPlan } from '../types';
import { Bot, ShieldCheck, Truck, Activity, Zap, Cpu, AlertTriangle, Key, ExternalLink } from 'lucide-react';

interface AgentConsoleProps {
  plan: (CommandPlan & { error?: string }) | null;
  loading: boolean;
  onRefresh: () => void;
}

const AgentConsole: React.FC<AgentConsoleProps> = ({ plan, loading, onRefresh }) => {
  const isQuotaError = plan?.error === "QUOTA_LIMIT";

  const handleOpenKey = async () => {
    const aiStudio = (window as any).aistudio;
    if (aiStudio) {
      await aiStudio.openSelectKey();
      onRefresh(); // Trigger refresh after opening key selection
    }
  };

  return (
    <div className={`h-full flex flex-col transition-all duration-500 border-t ${isQuotaError ? 'bg-red-950/20 border-red-500/50' : 'bg-[#0c0c0e] border-zinc-800/60 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]'}`}>
      {/* Control Bar */}
      <div className="px-6 py-4 border-b border-zinc-800/60 flex justify-between items-center bg-zinc-900/20 backdrop-blur-md">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20">
            <Cpu className="w-3.5 h-3.5 text-purple-400" />
            <h2 className="text-[10px] font-black uppercase tracking-[0.15em] text-purple-400">Gemini 3 Multi-Agent Engine</h2>
          </div>
          <div className="h-4 w-px bg-zinc-800" />
          <div className="flex items-center space-x-2">
            <Zap className={`w-3 h-3 ${isQuotaError ? 'text-red-500' : 'text-yellow-500/60'}`} />
            <span className={`text-[10px] mono uppercase font-bold ${isQuotaError ? 'text-red-400 animate-pulse' : 'text-zinc-500'}`}>
              {isQuotaError ? 'QUOTA EXCEEDED' : 'Inference latency: 1.2s'}
            </span>
          </div>
        </div>
        
        <div className="flex space-x-3">
          {isQuotaError && (
            <div className="flex items-center space-x-2">
              <a 
                href="https://ai.google.dev/gemini-api/docs/billing" 
                target="_blank" 
                rel="noreferrer"
                className="text-[9px] font-black text-red-400/60 uppercase tracking-widest hover:text-red-400 transition-colors flex items-center"
              >
                Billing Info <ExternalLink className="w-2.5 h-2.5 ml-1" />
              </a>
              <button 
                onClick={handleOpenKey}
                className="px-4 py-2 rounded-lg text-xs font-black bg-red-600 hover:bg-red-500 text-white flex items-center space-x-2 border border-red-400/50 uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(220,38,38,0.4)]"
              >
                <Key className="w-3.5 h-3.5" />
                <span>Unlock System</span>
              </button>
            </div>
          )}
          <button 
            onClick={onRefresh}
            disabled={loading}
            className={`px-6 py-2 rounded-lg text-xs font-black transition-all flex items-center space-x-2 border uppercase tracking-widest ${
              loading 
                ? 'bg-zinc-800/50 text-zinc-500 border-zinc-700/50 cursor-not-allowed' 
                : 'bg-zinc-100 hover:bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.1)]'
            }`}
          >
            {loading ? (
              <>
                <div className="w-3 h-3 border-2 border-zinc-500 border-t-zinc-200 rounded-full animate-spin mr-2" />
                <span>Synthesizing...</span>
              </>
            ) : (
              <>
                <Bot className="w-4 h-4 mr-1" />
                <span>Update Strategy</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 divide-x divide-zinc-800/60">
        {/* Planner Column */}
        <section className="p-6 overflow-y-auto">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center space-x-2.5">
              <div className={`p-1.5 rounded-lg border ${isQuotaError ? 'bg-red-500/10 border-red-500/20' : 'bg-emerald-500/10 border-emerald-500/20'}`}>
                {isQuotaError ? <AlertTriangle className="w-4 h-4 text-red-400" /> : <Activity className="w-4 h-4 text-emerald-400" />}
              </div>
              <span className="text-[11px] font-black text-zinc-300 uppercase tracking-[0.1em]">Strategy Agent</span>
            </div>
            <div className={`w-1.5 h-1.5 rounded-full ${loading ? 'animate-pulse bg-zinc-700' : (isQuotaError ? 'bg-red-500' : 'bg-emerald-500')}`} />
          </div>
          
          {loading ? (
            <div className="space-y-4 animate-pulse">
              <div className="h-3 bg-zinc-800/50 rounded-full w-full" />
              <div className="h-20 bg-zinc-800/30 rounded-xl" />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="relative">
                <div className={`absolute -left-3 top-0 bottom-0 w-0.5 ${isQuotaError ? 'bg-red-500/20' : 'bg-emerald-500/20'}`} />
                <p className={`text-[12px] leading-relaxed font-medium pl-2 italic ${isQuotaError ? 'text-red-300' : 'text-zinc-400'}`}>
                  "{plan?.summary || 'Initializing tactical assessment...'}"
                </p>
              </div>
              <div className="space-y-2.5">
                {(plan?.nextSteps || []).map((step, i) => (
                  <div key={i} className={`flex items-start space-x-3 p-2.5 rounded-lg border transition-colors ${isQuotaError ? 'bg-red-900/10 border-red-500/10' : 'bg-zinc-800/20 border-zinc-800/40 hover:bg-zinc-800/40'}`}>
                    <div className={`mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0 ${isQuotaError ? 'bg-red-500/40' : 'bg-emerald-500/40'}`} />
                    <span className="text-[11px] text-zinc-300 font-medium leading-snug">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Logistics Column */}
        <section className="p-6 overflow-y-auto bg-zinc-900/10">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center space-x-2.5">
              <div className="p-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <Truck className="w-4 h-4 text-blue-400" />
              </div>
              <span className="text-[11px] font-black text-zinc-300 uppercase tracking-[0.1em]">Resource Logistics</span>
            </div>
          </div>
          <div className="space-y-3">
            {(plan?.allocations || []).map((alloc, i) => (
              <div key={i} className="p-3.5 rounded-xl bg-blue-500/5 border border-blue-500/10">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-black text-blue-400 mono">{alloc.resourceId}</span>
                  <span className="text-[9px] text-zinc-600 font-bold uppercase">{alloc.incidentId}</span>
                </div>
                <p className="text-[11px] text-zinc-300 font-medium leading-tight">{alloc.task}</p>
              </div>
            ))}
            {(!plan?.allocations || plan.allocations.length === 0) && !loading && (
              <div className="text-center py-8 opacity-20">
                <span className="text-[10px] font-black uppercase tracking-widest">No allocations active</span>
              </div>
            )}
          </div>
        </section>

        {/* Risk Column */}
        <section className="p-6 overflow-y-auto">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center space-x-2.5">
              <div className="p-1.5 rounded-lg bg-red-500/10 border border-red-500/20">
                <ShieldCheck className="w-4 h-4 text-red-400" />
              </div>
              <span className="text-[11px] font-black text-zinc-300 uppercase tracking-[0.1em]">Threat Analysis</span>
            </div>
          </div>
          <div className="space-y-2.5">
            {(plan?.risks || []).map((risk, i) => (
              <div key={i} className="flex items-start space-x-3 p-3 rounded-xl bg-red-500/5 border border-red-500/10">
                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500/50 flex-shrink-0" />
                <span className="text-[11px] text-red-200/70 font-bold leading-snug">{risk}</span>
              </div>
            ))}
            {(!plan?.risks || plan.risks.length === 0) && !loading && (
              <div className="text-center py-8 opacity-20">
                <span className="text-[10px] font-black uppercase tracking-widest">Environmental threats nominal</span>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default AgentConsole;
