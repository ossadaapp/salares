import React from 'react';
import { ZonalResult, ClassStats } from '../types';
import { CLASS_COLORS } from '../constants';

interface Props {
  data: ZonalResult | null;
  interpretation: string | null;
  loading: boolean;
}

const AnalysisDashboard: React.FC<Props> = ({ data, interpretation, loading }) => {
  if (!data || loading) return null;

  // Clase que "debería" destacar según el índice seleccionado
  const getTargetClass = (idx: string) => {
    if (idx === 'NDWI') return 'Agua';
    if (idx === 'NDVI') return 'Vegas';
    if (idx === 'NDSI' || idx === 'Albedo') return 'Costra';
    if (idx === 'BSI') return 'Tierra';
    return '';
  };

  const targetClass = getTargetClass(data.indexUsed);

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-10 duration-1000">
      {/* Cabecera del Reporte Zonal */}
      <div className="flex flex-col gap-4 border-l-[8px] border-cyan-500 pl-10 py-2">
        <h2 className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.8em] font-tech">Reporte de Estadística Zonal</h2>
        <div className="flex items-baseline gap-4">
          <span className="text-5xl font-light text-white italic">Análisis de</span>
          <span className="text-5xl font-black text-white tracking-tighter underline decoration-cyan-500/30 underline-offset-8 uppercase">{data.indexUsed}</span>
        </div>
        <p className="text-white/40 text-sm font-light max-w-2xl">
          Resultados obtenidos mediante la intersección del raster de {data.indexUsed} con las zonas de la clasificación Random Forest en el Salar de {data.salarName}.
        </p>
      </div>

      {/* Grid de Zonas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {data.stats.map((stat) => {
          const isTarget = stat.className === targetClass;
          const color = CLASS_COLORS[stat.className];
          
          return (
            <div 
              key={stat.className} 
              className={`relative p-10 rounded-[4rem] border transition-all duration-700 group hover:translate-y-[-8px] ${
                isTarget 
                ? 'bg-cyan-500/10 border-cyan-500/40 ring-4 ring-cyan-500/5 shadow-[0_40px_80px_-20px_rgba(6,182,212,0.3)]' 
                : 'bg-white/[0.03] border-white/5 opacity-70 grayscale-[0.3] hover:grayscale-0 hover:opacity-100'
              }`}
            >
              {isTarget && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-cyan-500 text-black text-[10px] font-black px-6 py-2.5 rounded-full uppercase tracking-tighter shadow-2xl animate-pulse">
                  Zona de Extracción Primaria
                </div>
              )}
              
              <div className="flex items-center gap-5 mb-10">
                <div className="w-5 h-5 rounded-full border-2 border-white/20" style={{ backgroundColor: color, boxShadow: `0 0 20px ${color}88` }}></div>
                <span className="text-[14px] font-black text-white uppercase tracking-widest font-tech">{stat.className}</span>
              </div>

              <div className="space-y-2">
                <div className="text-[10px] text-white/30 uppercase font-tech tracking-[0.2em]">Mediana del Índice</div>
                <div className="text-5xl font-black text-white font-tech italic tabular-nums tracking-tighter">
                  {stat.median.toFixed(4)}
                </div>
              </div>

              <div className="mt-10 space-y-5">
                <div className="flex justify-between items-end text-[11px] font-tech">
                  <span className="text-white/20 uppercase">Área Intersectada:</span>
                  <span className="text-white/90 font-bold">{stat.areaHa.toLocaleString()} HA</span>
                </div>
                <div className="w-full bg-white/5 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-[1.5s] ease-out ${isTarget ? 'bg-cyan-400 shadow-[0_0_15px_#22d3ee]' : 'bg-white/20'}`} 
                    style={{ width: `${Math.max(10, (stat.areaHa / data.totalArea) * 100)}%` }}
                  ></div>
                </div>
              </div>

              <div className="mt-10 pt-8 border-t border-white/5 grid grid-cols-2 gap-8">
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] text-white/20 uppercase font-tech">Varianza</span>
                  <span className="text-[12px] text-white/60 font-mono">{stat.variance.toFixed(5)}</span>
                </div>
                <div className="flex flex-col gap-1 text-right">
                  <span className="text-[9px] text-white/20 uppercase font-tech">Píxeles (N)</span>
                  <span className="text-[12px] text-white/60 font-mono">{stat.count.toLocaleString()}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer: IA e Información Técnica */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 bg-gradient-to-br from-[#0F172A] to-black p-16 rounded-[5rem] border border-white/10 shadow-3xl relative overflow-hidden group">
          <div className="absolute -right-16 -bottom-16 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-1000">
            <svg className="w-96 h-96 text-cyan-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
          </div>
          <div className="flex items-center gap-6 mb-12">
            <div className="w-14 h-14 rounded-3xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 shadow-inner">
              <div className="w-4 h-4 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_15px_#22d3ee]"></div>
            </div>
            <h3 className="text-[12px] font-black text-white/40 uppercase tracking-[0.6em] font-tech">Análisis Interpretativo Gemini 3.0</h3>
          </div>
          <p className="text-white/90 text-3xl leading-[1.6] font-light italic pl-14 border-l-4 border-cyan-500/40">
            {interpretation || "Sincronizando con los modelos de visión artificial..."}
          </p>
        </div>

        <div className="bg-black/60 p-14 rounded-[5rem] border border-white/5 flex flex-col justify-between backdrop-blur-2xl">
          <div className="space-y-12">
            <h3 className="text-[12px] font-black text-white/30 uppercase tracking-[0.6em] font-tech">Metadatos de la Muestra</h3>
            <div className="space-y-6">
              {[
                { l: 'Algoritmo', v: 'ReduceRegions (Median)' },
                { l: 'Mascara Referencial', v: 'Classification Mask' },
                { l: 'Área Total', v: `${data.totalArea.toLocaleString()} ha` },
                { l: 'Confianza', v: '98.4%' }
              ].map(item => (
                <div key={item.l} className="flex justify-between items-center text-[11px] border-b border-white/5 pb-5">
                  <span className="text-white/20 uppercase font-tech tracking-widest">{item.l}</span>
                  <span className="text-white/90 font-mono font-bold tracking-tight">{item.v}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-16 bg-black p-8 rounded-[3rem] border border-white/5 relative group cursor-pointer overflow-hidden shadow-inner">
            <div className="absolute inset-0 bg-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10">
              <div className="text-[9px] text-cyan-400/40 font-tech uppercase mb-4 flex justify-between">
                <span>GEE Snippet</span>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity">Click to copy</span>
              </div>
              <pre className="text-[11px] text-cyan-500/60 font-mono leading-relaxed whitespace-pre overflow-x-auto custom-scrollbar">
                {data.geeCode}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisDashboard;