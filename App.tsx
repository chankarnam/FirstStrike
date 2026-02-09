
import React, { useState, useEffect, useCallback, useRef } from 'react';
import IncidentFeed from './components/IncidentFeed';
import ResourcePanel from './components/ResourcePanel';
import MapView from './components/MapView';
import AgentConsole from './components/AgentConsole';
import TacticalBriefing from './components/TacticalBriefing';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import { Incident, Resource, CommandPlan } from './types';
import { MOCK_INCIDENTS, MOCK_RESOURCES } from './constants';
import { geminiService } from './services/geminiService';
// Added AlertTriangle to imports to fix the "Cannot find name 'AlertTriangle'" error
import { Shield, Bell, Settings, Info, Activity, MapPin, BarChart3, Radio, Volume2, Key, AlertTriangle } from 'lucide-react';

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<'tactical' | 'analytics'>('tactical');
  const [incidents, setIncidents] = useState<Incident[]>(MOCK_INCIDENTS);
  const [resources, setResources] = useState<Resource[]>(MOCK_RESOURCES);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [commandPlan, setCommandPlan] = useState<(CommandPlan & { error?: string, grounding?: any }) | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [reconImage, setReconImage] = useState<string | null>(null);
  const [hasSelectedKey, setHasSelectedKey] = useState(false);
  // Add state for user location to support Google Maps grounding
  const [userLocation, setUserLocation] = useState<{ latitude: number, longitude: number } | undefined>();
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);

  const checkKeyStatus = useCallback(async () => {
    const aiStudio = (window as any).aistudio;
    if (aiStudio) {
      const selected = await aiStudio.hasSelectedApiKey();
      setHasSelectedKey(selected);
    }
  }, []);

  // Updated generatePlan to use user location if available
  const generatePlan = useCallback(async () => {
    setIsGenerating(true);
    try {
      const plan = await geminiService.generateCommandPlan(incidents, resources, userLocation);
      setCommandPlan(plan);
      await checkKeyStatus();
    } catch (error) {
      console.error("Plan Gen Error:", error);
    } finally {
      setIsGenerating(false);
    }
  }, [incidents, resources, checkKeyStatus, userLocation]);

  const handleBriefing = async () => {
    if (isSpeaking) {
      audioSourceRef.current?.stop();
      setIsSpeaking(false);
      return;
    }
    if (!commandPlan?.summary) return;

    setIsSpeaking(true);
    const buffer = await geminiService.generateAudioBriefing(commandPlan.summary);
    if (buffer) {
      // Create context with mandatory 24000 sample rate for Gemini TTS
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.onended = () => setIsSpeaking(false);
      source.start();
      audioSourceRef.current = source;
    } else {
      setIsSpeaking(false);
    }
  };

  const handleIncidentSelect = async (inc: Incident) => {
    setSelectedIncident(inc);
    setReconImage(null);
    const img = await geminiService.generateSatelliteIntelligence(inc);
    setReconImage(img);
  };

  // Get user location on mount for better grounding
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => console.debug("Location access denied", error)
      );
    }
    checkKeyStatus();
  }, []);

  // Re-run plan generation when location is acquired or updated
  useEffect(() => {
    generatePlan();
  }, [userLocation]);

  return (
    <div className="h-screen flex flex-col bg-[#09090b] text-[#f4f4f5] selection:bg-purple-500/30 overflow-hidden">
      {/* High Fidelity Header */}
      <header className="h-20 glass border-b border-zinc-800/60 flex items-center justify-between px-8 z-50">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center shadow-[0_0_30px_rgba(220,38,38,0.3)] border border-red-500/50">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-black tracking-tighter text-white leading-none uppercase">FirstStrike</h1>
                <span className={`px-1.5 py-0.5 rounded-sm text-[9px] font-black mono tracking-widest border ${hasSelectedKey ? 'bg-purple-600 text-white border-purple-400' : 'bg-blue-600 text-white border-blue-400'}`}>
                  {hasSelectedKey ? 'PRIVATE KEY ACTIVE' : 'PUBLIC SHARED TIER'}
                </span>
              </div>
              <p className="text-[10px] text-zinc-500 font-mono tracking-[0.2em] mt-1 flex items-center uppercase">
                <div className="w-2 h-2 rounded-full bg-emerald-500/20 mr-2 flex items-center justify-center">
                  <div className={`w-1 h-1 rounded-full ${commandPlan?.error === 'QUOTA_LIMIT' ? 'bg-red-500 animate-ping' : 'bg-emerald-500 animate-pulse'}`} />
                </div>
                {commandPlan?.error === 'QUOTA_LIMIT' ? 'SIGNAL INTERRUPTED: QUOTA EXHAUSTED' : 'Geo-Orchestration v5.1 • Active'}
              </p>
            </div>
          </div>
        </div>

        <nav className="flex items-center bg-zinc-900/50 p-1 rounded-xl border border-zinc-800">
          <button 
            onClick={() => setViewMode('tactical')}
            className={`px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all flex items-center space-x-2 ${viewMode === 'tactical' ? 'bg-zinc-800 text-white shadow-xl' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Tactical Hub</span>
          </button>
          <button 
            onClick={() => setViewMode('analytics')}
            className={`px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all flex items-center space-x-2 ${viewMode === 'analytics' ? 'bg-zinc-800 text-white shadow-xl' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>BigQuery Insights</span>
          </button>
        </nav>

        <div className="flex items-center space-x-4">
          <button 
            onClick={handleBriefing}
            className={`p-2.5 transition-all rounded-lg border flex items-center space-x-2 ${isSpeaking ? 'bg-red-500/10 border-red-500/50 text-red-500 animate-pulse' : 'bg-zinc-800/50 border-zinc-700 text-zinc-400 hover:text-white'}`}
          >
            <Volume2 className="w-5 h-5" />
          </button>
          <button 
            onClick={async () => {
               const aiStudio = (window as any).aistudio;
               if (aiStudio) {
                 await aiStudio.openSelectKey();
                 checkKeyStatus();
               }
            }}
            className={`p-2.5 transition-all rounded-lg border ${hasSelectedKey ? 'bg-purple-500/10 border-purple-500/30 text-purple-400' : 'bg-zinc-800/50 border-zinc-700 text-zinc-400 hover:text-white'}`}
          >
            <Key className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Framework */}
      <main className="flex-1 flex overflow-hidden">
        {viewMode === 'tactical' ? (
          <>
            <aside className="w-[340px] glass hidden lg:flex flex-col z-10">
              <IncidentFeed incidents={incidents} onSelect={handleIncidentSelect} />
            </aside>

            <section className="flex-1 flex flex-col min-w-0 bg-[#050507]">
              <div className="flex-1 relative">
                <MapView incidents={incidents} resources={resources} onIncidentClick={handleIncidentSelect} />
                {commandPlan?.grounding && (
                  <div className="absolute top-6 left-6 max-w-xs">
                    <TacticalBriefing grounding={commandPlan.grounding} />
                  </div>
                )}
              </div>
              <div className="h-80">
                <AgentConsole plan={commandPlan} loading={isGenerating} onRefresh={generatePlan} />
              </div>
            </section>

            <aside className="w-72 glass hidden xl:flex flex-col z-10">
              <ResourcePanel resources={resources} />
            </aside>
          </>
        ) : (
          <AnalyticsDashboard incidents={incidents} />
        )}
      </main>

      {/* Modern Status Footer */}
      <footer className="h-10 glass border-t border-zinc-800/60 flex items-center justify-between px-6 text-[10px] text-zinc-500 mono font-bold tracking-tighter uppercase">
        <div className="flex items-center space-x-6">
          <div className={`flex items-center px-2 py-0.5 rounded border ${commandPlan?.error === 'QUOTA_LIMIT' ? 'text-red-500 bg-red-500/5 border-red-500/10' : 'text-emerald-500 bg-emerald-500/5 border-emerald-500/10'}`}>
            <Activity className="w-3 h-3 mr-1.5 animate-pulse" />
            {commandPlan?.error === 'QUOTA_LIMIT' ? 'STATUS: OFFLINE (QUOTA)' : 'SENSORS: NOMINAL'}
          </div>
          <span className="opacity-60">GRID: LAX-TACTICAL-01</span>
        </div>
      </footer>

      {/* Recon Overlay */}
      {selectedIncident && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl">
          <div className="bg-[#0c0c0e] border border-zinc-800 rounded-3xl shadow-2xl max-w-4xl w-full flex overflow-hidden relative">
            {commandPlan?.error === 'QUOTA_LIMIT' && (
              <div className="absolute inset-0 z-50 bg-red-950/40 backdrop-blur-sm flex items-center justify-center p-8 text-center">
                <div className="max-w-md">
                   <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                   <h3 className="text-2xl font-black text-white uppercase mb-2">Satellite Link Lost</h3>
                   <p className="text-zinc-300 text-sm mb-6">Visual recon requires a private API key. Public quota is currently exhausted.</p>
                   <button 
                     onClick={async () => {
                       const aiStudio = (window as any).aistudio;
                       if (aiStudio) {
                         await aiStudio.openSelectKey();
                         setSelectedIncident(null);
                         generatePlan();
                       }
                     }}
                     className="px-8 py-3 bg-red-600 text-white rounded-xl font-black uppercase tracking-widest hover:bg-red-500 transition-all shadow-xl"
                   >
                     Unlock Recon Link
                   </button>
                </div>
              </div>
            )}
            
            <div className="flex-1 p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="px-2 py-1 rounded bg-red-600 text-white text-[10px] font-black uppercase tracking-widest">{selectedIncident.severity}</div>
                <h3 className="text-3xl font-black text-white uppercase tracking-tighter">{selectedIncident.type}</h3>
              </div>
              <p className="text-zinc-400 text-sm mb-6 leading-relaxed">{selectedIncident.description}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                  <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-2 block">Tactical Status</span>
                  <span className="text-xl font-bold text-white mono">{selectedIncident.status}</span>
                </div>
                <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                  <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-2 block">Grid Coordinates</span>
                  <span className="text-xl font-bold text-blue-400 mono">{selectedIncident.location.lat.toFixed(4)}, {selectedIncident.location.lng.toFixed(4)}</span>
                </div>
              </div>

              <div className="flex space-x-4">
                <button className="flex-1 py-4 bg-white text-black text-xs font-black uppercase tracking-widest rounded-xl hover:bg-zinc-200 transition-all">Authorize Dispatch</button>
                <button onClick={() => setSelectedIncident(null)} className="px-8 py-4 bg-zinc-800 text-white text-xs font-black uppercase tracking-widest rounded-xl">Close HUD</button>
              </div>
            </div>
            
            <div className="w-96 bg-zinc-900 border-l border-zinc-800 relative group overflow-hidden">
               {reconImage ? (
                  <img src={reconImage} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100" alt="Tactical Recon" />
               ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center space-y-4">
                    <Activity className="w-12 h-12 text-zinc-700 animate-bounce" />
                    <span className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em]">Syncing Feed...</span>
                  </div>
               )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
