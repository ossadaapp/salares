import React, { useState, useMemo } from 'react';
import { SALARES, INDICES } from '../constants';
import { SalarAmbiente, IndexType, SceneConfig } from '../types';

interface SidebarProps {
  onApply: (configA: SceneConfig, configB: SceneConfig, global: any) => void;
  loading: boolean;
  configA: SceneConfig;
  configB: SceneConfig;
  setConfigA: (c: SceneConfig) => void;
  setConfigB: (c: SceneConfig) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onApply, loading, configA, configB, setConfigA, setConfigB }) => {
  const [ambiente, setAmbiente] = useState<SalarAmbiente>('Andino');
  const [salar, setSalar] = useState('Maricunga');

  const filteredSalares = useMemo(() => SALARES.filter(s => s.ambiente === ambiente), [ambiente]);

  const ControlGroup = ({ label, title, config, setConfig, color }: any) => (
    <div className="bg-[#0F172A]/60 rounded-[2rem] p-6 border border-white/5 relative overflow-hidden">
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${color}`}></div>
      <div className="flex items-center gap-3 mb-4">
        <span className={`w-6 h-6 rounded-lg ${color} flex items-center justify-center text-black font-black text-[10px]`}>{label}</span>
        <span className="text-[9px] font-bold text-white uppercase tracking-widest font-tech">{title}</span>
      </div>
      <div className="space-y-4">
        <select value={config.indice} onChange={(e) => setConfig({...config, indice: e.target.value})} className="w-full bg-[#1E293B] text-white text-[11px] font-bold p-3 rounded-xl border border-white/5 font-tech outline-none">
          {INDICES.map(i => <option key={i} value={i}>{i}</option>)}
        </select>
        <div className="grid grid-cols-2 gap-2">
          <select value={config.anio} onChange={(e) => setConfig({...config, anio: e.target.value})} className="bg-[#1E293B] text-white text-[10px] p-2.5 rounded-xl border border-white/5 font-tech">
            {['2024', '2023', '2022'].map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          <select value={config.estacion} onChange={(e) => setConfig({...config, estacion: e.target.value})} className="bg-[#1E293B] text-white text-[10px] p-2.5 rounded-xl border border-white/5 font-tech">
            {['Verano', 'Otoño', 'Invierno', 'Primavera'].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>
    </div>
  );

  return (
    <aside className="w-[340px] bg-[#020617] h-screen overflow-y-auto p-8 flex flex-col gap-8 border-r border-white/5 custom-scrollbar">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-12 h-12 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl flex items-center justify-center text-cyan-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <h1 className="flex flex-col">
            <span className="text-2xl font-black text-white leading-none">SALARES</span>
            <span className="text-[11px] font-light text-cyan-400 tracking-[0.4em] mt-1">CHILE</span>
          </h1>
        </div>
      </div>

      <div className="bg-white/[0.02] p-6 rounded-[2.5rem] border border-white/5 space-y-4">
        <div className="flex p-1 bg-black/40 rounded-xl">
          {(['Costero', 'PreAndino', 'Andino'] as SalarAmbiente[]).map(amb => (
            <button key={amb} onClick={() => setAmbiente(amb)} className={`flex-1 py-2 rounded-lg text-[8px] font-bold uppercase font-tech transition-all ${ambiente === amb ? 'bg-cyan-500 text-black' : 'text-white/30 hover:text-white/60'}`}>{amb}</button>
          ))}
        </div>
        <select value={salar} onChange={(e) => setSalar(e.target.value)} className="w-full bg-black/40 text-white font-bold text-xs p-4 rounded-xl border border-white/10 font-tech">
          {filteredSalares.map(s => <option key={s.nombre} value={s.nombre}>{s.nombre}</option>)}
        </select>
      </div>

      <ControlGroup label="A" title="Índice a Analizar" config={configA} setConfig={setConfigA} color="bg-emerald-500" />
      <ControlGroup label="B" title="Máscara Referencial" config={configB} setConfig={setConfigB} color="bg-cyan-500" />

      <button onClick={() => onApply(configA, configB, { salar, ambiente })} disabled={loading} className={`w-full py-5 rounded-2xl font-bold text-[10px] tracking-[0.4em] font-tech transition-all ${loading ? 'bg-slate-800 text-white/20 animate-pulse' : 'bg-white text-black hover:bg-cyan-400 active:scale-95'}`}>
        {loading ? 'PROCESANDO GEE...' : 'INICIAR ANÁLISIS'}
      </button>
    </aside>
  );
};

export default Sidebar;


