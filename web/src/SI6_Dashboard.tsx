import React, { useState, useEffect } from 'react';
import { 
  Zap, Cpu, Activity, ShieldCheck, Terminal, RefreshCw,
  BrainCircuit, BatteryCharging, Layers, Coins, Gauge, ShieldAlert,
  ArrowRightLeft, PowerOff, TrendingUp, Sparkles, Shield, Info
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';

const MODEL_NAME = "gemini-2.5-flash-preview-09-2025";

const SI6_Dashboard = () => {
  const [workers] = useState([
    { id: 'CPU-LCL', name: 'p2pool Engine', type: 'CPU', hashrate: 450, unit: 'H/s', temp: 48, algo: 'RandomX' },
    { id: 'GPU-NV', name: 'NVIDIA Envii', type: 'GPU', hashrate: 25.5, unit: 'MH/s', temp: 65, algo: 'KawPow' }
  ]);
  const [totalEnergy, setTotalEnergy] = useState(0);
  const [thermalSlot, setThermalSlot] = useState(0);
  const [history, setHistory] = useState<{time: string, val: number}[]>([]);
  const [aiLog, setAiLog] = useState(["[ENVII] Nanopool déconnecté.", "[ENVII] Bridge p2pool SI-6 activé."]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [report, setReport] = useState("");
  const [aiAnalysisType, setAiAnalysisType] = useState("");

  const callGemini = async (prompt: string, systemInstruction: string) => {
    setIsAnalyzing(true);
    // Note: apiKey should be provided via env or config in real app
    // Here we use a placeholder or assume the user will provide it.
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || ""; 
    
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          systemInstruction: { parts: [{ text: systemInstruction }] }
        })
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || "Aucune réponse générée.";
    } catch (e) {
      console.error("Gemini API Error:", e);
      return "Erreur de connexion au Cortex Gemini. Veuillez réessayer.";
    } finally {
      setIsAnalyzing(false);
    }
  };

  const analyzeBifurcations = async () => {
    setAiAnalysisType("Bifurcation");
    const stats = JSON.stringify({ workers, totalEnergy, thermalSlot });
    const systemPrompt = "Tu es l'Analyste de Bifurcation d'ADAM v7.0 SI-6. Utilise la théorie du Kinematic Tangent Cone pour analyser les performances actuelles et suggérer une trajectoire d'optimisation instantanée. Réponds en français.";
    const userPrompt = `Analyse les données suivantes pour identifier les opportunités de hachage : ${stats}. Comment pouvons-nous utiliser l'Exception de l'Alpeiron pour augmenter le rendement ?`;
    
    const res = await callGemini(userPrompt, systemPrompt);
    setReport(res);
    setAiLog(prev => [`[IA] Analyse de bifurcation complétée.`, ...prev]);
  };

  const runEthicalAudit = async () => {
    setAiAnalysisType("Éthique");
    const systemPrompt = "Tu es le Gardien de l'Âme d'Alexandria. Tu dois valider si les opérations actuelles respectent les 3 points : transparence, légalité, éthique. Réponds en français de manière solennelle.";
    const userPrompt = "Effectue un audit en temps réel de la Pompe à Déminer. La transmutation de capital en Energon est-elle conforme aux principes d'Alexandria ?";
    
    const res = await callGemini(userPrompt, systemPrompt);
    setReport(res);
    setAiLog(prev => [`[IA] Audit éthique validé.`, ...prev]);
  };

  const generateEnergonSummary = async () => {
    setAiAnalysisType("Synthèse");
    const systemPrompt = "Tu es le comptable SI-6 d'ADAM. Résume la production d'énergie en termes de E, X et C Energons. Réponds en français.";
    const userPrompt = `Production actuelle : ${totalEnergy.toFixed(4)} kWh. Prépare un rapport de scellage pour Ethereum Mainnet.`;
    
    const res = await callGemini(userPrompt, systemPrompt);
    setReport(res);
    setAiLog(prev => [`[IA] Synthèse de production générée.`, ...prev]);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTotalEnergy(prev => prev + 0.00186);
      setThermalSlot(prev => Math.min(100, Math.max(0, prev + (Math.random() * 2 - 1))));
      setHistory(prev => [...prev.slice(-19), { 
        time: new Date().toLocaleTimeString(), 
        val: workers.reduce((acc, w) => acc + w.hashrate, 0) 
      }]);
    }, 2000);
    return () => clearInterval(interval);
  }, [workers]);

  return (
    <div className="min-h-screen bg-[#050608] text-slate-300 p-8 font-['Inter'] selection:bg-emerald-500/30">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div className="flex items-center gap-4">
          <div className="bg-emerald-500 p-3 rounded-xl shadow-lg shadow-emerald-500/30"><Zap className="text-black" size={24} /></div>
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tighter uppercase">Energon <span className="text-emerald-500">Envii</span> SI-6</h1>
            <p className="text-slate-500 text-[10px] tracking-[0.3em] uppercase flex items-center gap-2">
              <ShieldCheck size={12} className="text-emerald-500" /> @ADAM/envii Core Active • p2pool Protocol
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={analyzeBifurcations} disabled={isAnalyzing} className="bg-purple-600/10 border border-purple-500/30 text-purple-400 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-purple-600/20 transition-all flex items-center gap-2">
            <Sparkles size={14} /> ✨ Bifurcation
          </button>
          <button onClick={runEthicalAudit} disabled={isAnalyzing} className="bg-blue-600/10 border border-blue-500/30 text-blue-400 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-blue-600/20 transition-all flex items-center gap-2">
            <Shield size={14} /> ✨ Éthique
          </button>
          <button onClick={generateEnergonSummary} disabled={isAnalyzing} className="bg-emerald-600/10 border border-emerald-500/30 text-emerald-400 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-emerald-600/20 transition-all flex items-center gap-2">
            <Coins size={14} /> ✨ Synthèse
          </button>
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-2 rounded-xl text-[10px] font-bold uppercase flex items-center gap-2">
            <PowerOff size={14} /> Nanopool Bypassed
          </div>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 bg-[#0c0d10] border border-slate-800 rounded-2xl p-6 shadow-2xl relative group">
          <h2 className="text-blue-400 font-bold mb-8 flex items-center gap-2 uppercase tracking-widest text-sm"><BatteryCharging size={18} /> Récupérateur Envii</h2>
          <div className="flex justify-center mb-10">
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90">
                <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-900" />
                <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={364.4} strokeDashoffset={364.4 - (364.4 * thermalSlot / 100)} className="text-blue-500 transition-all duration-1000 shadow-[0_0_15px_rgba(59,130,246,0.3)]" strokeLinecap="round" />
              </svg>
              <span className="absolute text-2xl font-bold text-white">{thermalSlot.toFixed(0)}%</span>
            </div>
          </div>
          <div className="bg-blue-500/5 p-3 rounded-lg border border-blue-500/20 text-[10px] text-blue-400 flex justify-between font-bold">
            <span>FLUX RECYCLÉ</span><span>{(thermalSlot * 0.186).toFixed(3)} kW/h</span>
          </div>
        </div>

        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#0c0d10] border border-slate-800 p-6 rounded-2xl border-l-4 border-l-emerald-500 shadow-xl relative overflow-hidden">
            <div className="absolute -right-4 -top-4 opacity-5 text-emerald-500"><TrendingUp size={100} /></div>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Accumulation Envii</p>
            <h3 className="text-4xl font-bold text-emerald-400 mt-2 tracking-tight">{totalEnergy.toFixed(4)} <span className="text-sm font-sans opacity-50 uppercase">kW/h</span></h3>
          </div>
          <div className="bg-[#0c0d10] border border-slate-800 p-6 rounded-2xl border-l-4 border-l-blue-500 shadow-xl relative overflow-hidden">
             <div className="absolute -right-4 -top-4 opacity-5 text-blue-500"><ArrowRightLeft size={100} /></div>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Efficiency Bypass</p>
            <h3 className="text-4xl font-bold text-white mt-2">SI-6 <span className="text-sm font-sans opacity-50 uppercase">Core</span></h3>
          </div>
          
          <div className="md:col-span-2 bg-[#0c0d10] border border-slate-800 rounded-2xl p-6 h-[220px] shadow-inner">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] text-slate-500 uppercase font-bold flex items-center gap-2"><Activity size={12} className="text-emerald-500" /> Flux p2pool décentralisé</span>
            </div>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={history}>
                 <defs>
                  <linearGradient id="colorE" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="val" stroke="#10b981" fill="url(#colorE)" strokeWidth={2} isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {report && (
          <div className="lg:col-span-12 bg-slate-900/50 border border-slate-800 p-6 rounded-2xl animate-in fade-in slide-in-from-bottom-4 shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
             <h3 className="text-emerald-400 font-bold mb-4 text-xs uppercase tracking-widest flex items-center gap-2">
               <BrainCircuit size={14} /> {aiAnalysisType} - Analyse Intelligent ✨
             </h3>
             <div className="text-[12px] text-slate-300 whitespace-pre-wrap leading-relaxed font-mono bg-black/40 p-5 rounded-lg border border-white/5 border-dashed">
               {report}
             </div>
          </div>
        )}

        <div className="lg:col-span-4 bg-black/40 border border-slate-800/50 p-6 rounded-2xl h-fit">
           <h3 className="text-slate-500 font-bold mb-4 text-[10px] uppercase tracking-widest flex items-center gap-2"><Terminal size={14} /> Envii Console</h3>
           <div className="space-y-3">
              {aiLog.map((log, i) => (
                <div key={i} className="text-[10px] font-mono border-l border-slate-800 pl-3 py-1 flex items-start gap-2">
                  <span className="text-emerald-500 opacity-50">▶</span>
                  <span className={i === 0 ? "text-emerald-400" : "text-slate-500"}>
                    {log}
                  </span>
                </div>
              ))}
              {isAnalyzing && (
                <div className="flex items-center gap-2 text-purple-400 text-[10px] font-mono animate-pulse mt-2">
                   <RefreshCw size={10} className="animate-spin" /> Synchronisation Cortex SI-6...
                </div>
              )}
           </div>
        </div>

        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          {workers.map(w => (
            <div key={w.id} className={`bg-[#0c0d10] border p-5 rounded-2xl flex justify-between group hover:bg-slate-800/20 transition-all border-l-4 ${w.type === 'GPU' ? 'border-blue-500 shadow-lg shadow-blue-500/5' : 'border-emerald-500 shadow-lg shadow-emerald-500/5'}`}>
              <div className="flex items-center gap-4">
                <div className={`p-2.5 rounded-xl ${w.type === 'GPU' ? 'bg-blue-500/10 text-blue-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                  {w.type === 'GPU' ? <Layers size={20} /> : <Cpu size={20} />}
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm tracking-tight">{w.name}</h4>
                  <p className="text-[10px] text-slate-500 uppercase font-mono tracking-tighter">{w.algo}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white font-mono text-lg font-bold">{w.hashrate} <span className="opacity-40 text-[10px] uppercase tracking-tighter">{w.unit}</span></p>
                <div className="mt-1 flex items-center justify-end gap-1.5">
                   <div className={`w-1.5 h-1.5 rounded-full ${w.temp > 70 ? 'bg-red-500 animate-ping' : 'bg-emerald-500'}`}></div>
                   <span className="text-[10px] font-bold text-slate-500 font-mono">{w.temp}°C</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="mt-12 pt-6 border-t border-slate-900 text-[9px] text-slate-700 font-bold uppercase tracking-[0.4em] flex flex-col md:flex-row justify-between gap-4">
        <div className="flex flex-wrap gap-10">
           <span className="flex items-center gap-2 text-emerald-500/80"><ShieldCheck size={12} /> @ADAM/envii Optimized</span>
           <span className="flex items-center gap-2 text-blue-500/80"><ShieldAlert size={12} /> Nanopool Bypassed</span>
           <span className="flex items-center gap-2 text-purple-500/80"><Gauge size={12} /> Alpeiron SI-6 Pivot</span>
        </div>
        <div className="text-slate-600 flex items-center gap-2">
           <Info size={10} /> Michael Lefebvre (BLUE) • DWallStreet • SI-Level 6
        </div>
      </footer>
    </div>
  );
};

export default SI6_Dashboard;
