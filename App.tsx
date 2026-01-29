

import React, { useState, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Visualizer from './components/Visualizer';
import AnalysisDashboard from './components/AnalysisDashboard';
import { ZonalResult, SceneConfig } from './types';
import { calculateZonalStats } from './services/zonalStatsService';
import { interpretResults } from './services/geminiService';

const App: React.FC = () => {
  const [result, setResult] = useState<ZonalResult | null>(null);
  const [interpretation, setInterpretation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const [configA, setConfigA] = useState<SceneConfig>({ indice: 'NDWI', anio: '2024', estacion: 'Verano' });
  const [configB, setConfigB] = useState<SceneConfig>({ indice: 'Clasificación', anio: '2024', estacion: 'Verano' });
  const [global, setGlobal] = useState({ salar: 'Maricunga', ambiente: 'Andino' });

  const handleApply = useCallback(async (cA: SceneConfig, cB: SceneConfig, g: any) => {
    setLoading(true);
    setGlobal(g);
    try {
      const stats = await calculateZonalStats(g.salar, cA.indice, parseInt(cA.anio), cA.estacion);
      setResult(stats);
      const text = await interpretResults(stats);
      setInterpretation(text);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className="flex h-screen w-screen bg-[#020617] overflow-hidden">
      <Sidebar 
        onApply={handleApply} 
        loading={loading} 
        configA={configA} 
        configB={configB} 
        setConfigA={setConfigA} 
        setConfigB={setConfigB} 
      />
      
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-20 px-12 border-b border-white/5 flex items-center justify-between bg-black/20 backdrop-blur-xl z-10">
          <div className="flex items-center gap-6">
            <div className="text-[10px] font-bold text-white/40 uppercase font-tech tracking-[0.3em]">Sector: {global.salar}</div>
            <div className="h-4 w-px bg-white/10"></div>
            <div className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-[8px] font-bold text-cyan-400 font-tech">TELEMETRÍA ACTIVA</div>
          </div>
          <div className="text-[10px] font-bold text-white uppercase font-tech tracking-widest">SISTEMA DE MONITOREO GEOESPACIAL V1.0</div>
        </header>

        <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
          <div className="h-[600px] mb-12">
            <Visualizer configA={configA} configB={configB} loading={loading} />
          </div>
          <AnalysisDashboard data={result} interpretation={interpretation} loading={loading} />
        </div>
      </main>
    </div>
  );
};

export default App;

