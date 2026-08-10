import React from 'react';
import { useSimulationStore } from '../../store/useSimulationStore';
import { CORE_SIMULATIONS } from '../../data/simulationsData';
import { Sliders, Lock, Unlock, RotateCcw } from 'lucide-react';

export const ControlPanel: React.FC = () => {
  const { currentSimId, parameters, setParameter, lockedParams, toggleParamLock, resetSimulation } = useSimulationStore();
  const sim = CORE_SIMULATIONS.find(s => s.id === currentSimId);

  if (!sim) return null;

  const handleReset = () => {
    const defaultParams: Record<string, number> = {};
    sim.parameters.forEach(p => {
      defaultParams[p.id] = p.defaultValue;
    });
    resetSimulation(defaultParams);
  };

  return (
    <div className="flex flex-col h-full bg-white shadow-2xl rounded-2xl border border-slate-200 overflow-hidden shadow-xl">
      {/* Panel Header */}
      <div className="p-4 border-b border-slate-200 bg-slate-100 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-stone-400" />
          <h3 className="font-heading text-sm font-bold text-slate-900 tracking-wide">Real-time Parameters</h3>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleReset}
            className="p-1.5 rounded-lg bg-slate-200 hover:bg-white/10 text-slate-700 hover:text-slate-900 transition-all border border-slate-200"
            title="Reset variables to curriculum default settings"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Sliders and Parameter Input Cards */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 hide-scrollbar">
        {sim.parameters.map((param) => {
          const val = parameters[param.id] !== undefined ? parameters[param.id] : param.defaultValue;
          const isLocked = !!lockedParams[param.id];

          return (
            <div 
              key={param.id} 
              className={`p-4 rounded-xl border transition-all duration-200 ${
                isLocked 
                  ? 'bg-slate-200 shadow-md border-stone-500/30 opacity-75' 
                  : 'bg-white/[0.03] hover:bg-white/[0.05] border-slate-200 hover:border-stone-500/40'
              }`}
            >
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2 pr-2">
                  <span className="font-heading text-xs font-bold text-slate-800 truncate">{param.label}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 bg-stone-500/20 text-stone-300 rounded font-semibold border border-stone-500/30">
                    {param.variableSymbol}
                  </span>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="flex items-center bg-slate-100 border border-slate-200 rounded-lg px-2 py-0.5">
                    {param.options ? (
                      <select
                        disabled={isLocked}
                        value={val}
                        onChange={(e) => setParameter(param.id, parseFloat(e.target.value))}
                        className="w-full bg-transparent text-right font-mono text-xs text-slate-900 font-bold focus:outline-none disabled:text-slate-600 appearance-none"
                        style={{ textAlignLast: 'right' }}
                      >
                        {param.options.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="number"
                        disabled={isLocked}
                        min={param.min}
                        max={param.max}
                        step={param.step}
                        value={val}
                        onChange={(e) => {
                          const num = parseFloat(e.target.value);
                          if (!isNaN(num)) setParameter(param.id, Math.min(param.max, Math.max(param.min, num)));
                        }}
                        className="w-16 bg-transparent text-right font-mono text-xs text-slate-900 font-bold focus:outline-none disabled:text-slate-600"
                      />
                    )}
                    <span className="text-[10px] text-slate-600 font-mono ml-1">{param.unit}</span>
                  </div>

                  {/* Lock Toggle Button */}
                  <button
                    onClick={() => toggleParamLock(param.id)}
                    className={`p-1 rounded transition-colors ${
                      isLocked ? 'text-stone-400 bg-stone-500/20 hover:bg-stone-500/30' : 'text-slate-500 hover:text-slate-700 bg-slate-200'
                    }`}
                    title={isLocked ? 'Unlock Parameter' : 'Lock parameter value'}
                  >
                    {isLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Range Slider */}
              {!param.options && (
                <div className="py-1">
                  <input
                    type="range"
                    disabled={isLocked}
                    min={param.min}
                    max={param.max}
                    step={param.step}
                    value={val}
                    onChange={(e) => setParameter(param.id, parseFloat(e.target.value))}
                    className="disabled:opacity-40 w-full"
                  />
                </div>
              )}

              <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 mt-1">
                {!param.options && <span>Min: {param.min} {param.unit}</span>}
                {param.description && (
                  <span className="text-stone-400 italic font-sans truncate px-2" title={param.description}>
                    ℹ️ {param.description}
                  </span>
                )}
                <span>Max: {param.max} {param.unit}</span>
              </div>
            </div>
          );
        })}


      </div>


    </div>
  );
};
