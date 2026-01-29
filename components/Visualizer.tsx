
import React, { useState, useRef } from 'react';

const Visualizer: React.FC<any> = ({ configA, configB, loading }) => {
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (e: any) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX || (e.touches && e.touches[0].clientX);
    const pos = ((x - rect.left) / rect.width) * 100;
    setSliderPos(Math.max(0, Math.min(100, pos)));
  };

  return (
    <div ref={containerRef} onMouseMove={handleMove} onTouchMove={handleMove} className="relative w-full h-full rounded-[3rem] overflow-hidden border border-white/5 bg-[#050B1A] cursor-col-resize group shadow-2xl">
      {loading && <div className="absolute inset-0 z-50 bg-[#020617]/90 backdrop-blur-xl flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
        <p className="font-tech text-cyan-400 text-[9px] tracking-[0.4em] uppercase">Calculando Estadísticas en la Nube</p>
      </div>}
      
      <div className="absolute inset-0 flex items-center justify-center grayscale-[0.2]">
        <div className="text-center opacity-10">
          <p className="font-tech text-[12px] text-white uppercase tracking-widest">{configB.indice} - {configB.anio}</p>
          <div className="w-80 h-80 bg-cyan-500/10 rounded-full blur-[100px] mt-4"></div>
        </div>
      </div>

      <div className="absolute inset-0 z-10 overflow-hidden" style={{ width: `${sliderPos}%`, borderRight: '2px solid rgba(255,255,255,0.2)' }}>
        <div className="absolute inset-0 w-[calc(100vw-340px)] h-full bg-[#0F172A] flex items-center justify-center">
           <div className="text-center opacity-20">
            <p className="font-tech text-[12px] text-white uppercase tracking-widest">{configA.indice} - {configA.anio}</p>
            <div className="w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px] mt-4"></div>
          </div>
        </div>
      </div>
      
      <div className="absolute top-1/2 -translate-y-1/2 z-20 pointer-events-none" style={{ left: `${sliderPos}%`, transform: 'translateX(-50%) translateY(-50%)' }}>
        <div className="w-10 h-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center shadow-2xl transition-transform group-hover:scale-110">
          <div className="flex gap-1">
            <div className="w-0.5 h-3 bg-white/40"></div>
            <div className="w-0.5 h-3 bg-white/40"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Visualizer;

