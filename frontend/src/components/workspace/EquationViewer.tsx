import React, { useState, useEffect } from 'react';
import { useSimulationStore } from '../../store/useSimulationStore';
import { CORE_SIMULATIONS } from '../../data/simulationsData';
import { MathJax, MathJaxContext } from 'better-react-mathjax';
import { Calculator, Zap } from 'lucide-react';

const InteractiveEquationCard: React.FC<{ eq: any }> = ({ eq }) => {
  const vars = eq.variables || [];
  const [localParams, setLocalParams] = useState<Record<string, number>>(
    vars.reduce((acc: any, v: string) => ({ ...acc, [v]: 0 }), {})
  );
  const [isCalculating, setIsCalculating] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleParamChange = (v: string, val: string) => {
    const num = parseFloat(val);
    setLocalParams(prev => ({ ...prev, [v]: isNaN(num) ? 0 : num }));
    setResult(null); // Clear result when inputs change
  };

  const handleCalculate = () => {
    setIsCalculating(true);
    setResult(null);
    setTimeout(() => {
      let res = '?';
      try {
        const keys = Object.keys(localParams);
        const values = Object.values(localParams);
        const func = new Function(...keys, `return ${eq.evaluatorTemplate};`);
        const val = func(...values);
        if (val !== undefined && !isNaN(val) && val !== Infinity) {
          res = val.toFixed(2);
        }
      } catch (e) {
        res = 'Error';
      }
      setResult(res);
      setIsCalculating(false);
    }, 500);
  };

  return (
    <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-3 transition-all duration-200 shadow-lg">
      <div className="flex items-center justify-center">
        <span className="font-heading text-xs font-extrabold text-indigo-900">{eq.title}</span>
      </div>

      <div className="p-3 rounded-xl bg-white shadow-md border border-slate-300 text-center overflow-x-auto">
        <div className="text-sm text-slate-900">
          <MathJax>{"\\[" + eq.latexFormula + "\\]"}</MathJax>
        </div>
      </div>

      {vars.length > 0 && (
        <div className="p-3 rounded-xl bg-white shadow-inner border border-slate-200 text-center flex flex-col gap-3 items-center justify-center">
          <div className="flex flex-wrap gap-2 justify-center">
            {vars.map((v: string) => (
              <div key={v} className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2 py-1 rounded-lg">
                <span className="font-mono text-xs font-bold text-slate-700">{v}:</span>
                <input 
                  type="number"
                  value={localParams[v] === 0 ? '' : localParams[v]}
                  onChange={e => handleParamChange(v, e.target.value)}
                  className="w-16 bg-white border border-slate-300 rounded px-1.5 py-0.5 text-xs font-mono text-slate-900 focus:outline-none focus:border-indigo-400"
                  placeholder="0"
                />
              </div>
            ))}
          </div>
          
          <button
            onClick={handleCalculate}
            disabled={isCalculating}
            className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isCalculating ? (
              <>
                <span className="w-3 h-3 rounded-full border-2 border-white/30 border-t-white animate-spin"></span>
                Calculating...
              </>
            ) : (
              'Calculate'
            )}
          </button>
          
          {result !== null && (
             <div className="px-4 py-1.5 rounded-xl bg-indigo-100 border border-indigo-200 text-indigo-900 text-sm font-mono font-bold shadow-inner">
               Result = {result}
             </div>
          )}
        </div>
      )}
      <p className="text-[11px] text-slate-600 leading-relaxed pt-1 border-t border-indigo-100 text-center">
        {eq.description}
      </p>
    </div>
  );
};

export const EquationViewer: React.FC = () => {
  const { currentSimId, parameters } = useSimulationStore();
  const sim = CORE_SIMULATIONS.find(s => s.id === currentSimId);
  const [aiEquations, setAiEquations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [aiError, setAiError] = useState('');

  useEffect(() => {
    if (!sim) return;
    const fetchAIEquations = async () => {
      setLoading(true);
      setAiError('');
      try {
        const res = await fetch('http://localhost:5005/api/equations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ topic: sim.topic, subtopic: sim.subtopic })
        });
        const data = await res.json();
        if (res.ok && data.equations) {
          setAiEquations(data.equations);
        } else {
          setAiError(data.error || 'Failed to fetch AI equations');
        }
      } catch (e: any) {
        setAiError(e.message || 'Network error');
      }
      setLoading(false);
    };
    fetchAIEquations();
  }, [currentSimId, sim?.topic, sim?.subtopic]);

  if (!sim) return null;

  return (
    <MathJaxContext>
      <div className="flex flex-col h-full bg-white shadow-2xl rounded-2xl border border-slate-200 overflow-hidden shadow-xl">
        {/* Header */}
      <div className="p-4 border-b border-slate-200 bg-slate-100 flex items-center justify-between flex-shrink-0 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Calculator className="w-4 h-4 text-amber-400" />
          <h3 className="font-heading text-sm font-bold text-slate-900 tracking-wide">Live Mathematical Engine</h3>
        </div>
      </div>
      
      {aiError && (
        <div className="px-4 py-2 bg-red-100 text-red-600 text-xs border-b border-red-200">
          {aiError}
        </div>
      )}

      {/* Equations Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 hide-scrollbar">
        {/* Live Equations List */}
        <div className="space-y-4">
          <h4 className="text-xs font-mono font-bold text-slate-600 uppercase tracking-wider px-1">
            Dynamic Equations & Live Output
          </h4>

          {loading && (
            <div className="text-xs text-slate-500 italic p-4 text-center border border-dashed rounded-xl border-slate-300">
              Generating Equations...
            </div>
          )}

          {!loading && sim.equations.length === 0 && aiEquations.length === 0 && (
             <div className="text-xs text-slate-500 italic p-4 text-center border border-dashed rounded-xl border-slate-300">
               No equations found.
             </div>
          )}

          {sim.equations.map((eq) => {
            const evaluated = eq.evaluator(parameters);

            return (
              <div key={eq.id} className="p-4 rounded-2xl bg-slate-100 border border-slate-200 space-y-3 hover:border-amber-500/50 transition-all duration-200 shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="font-heading text-xs font-extrabold text-slate-900 text-glow-cyan">{eq.title}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/30 font-bold">
                    {evaluated.resultLabel}: {evaluated.resultValue} {evaluated.resultUnit}
                  </span>
                </div>

                {/* Abstract Latex Formula */}
                <div className="p-3 rounded-xl bg-white shadow-md border border-slate-300 text-center overflow-x-auto">
                  <div className="text-sm text-slate-900">
                    <MathJax>{"\\[" + eq.latexFormula + "\\]"}</MathJax>
                  </div>
                </div>

                {/* Substituted Numerical Latex */}
                <div className="p-3 rounded-xl bg-stone-100 shadow-inner border border-slate-300 text-center overflow-x-auto">
                  <div className="text-xs font-semibold text-slate-500 mb-1 uppercase font-mono flex items-center justify-center gap-1">
                    <Zap className="w-3 h-3 text-amber-500 fill-current" /> Real-Time Numerical Substitution
                  </div>
                  <div className="text-sm text-slate-900 font-bold">
                    <MathJax>{"\\[" + evaluated.substitutedLatex + "\\]"}</MathJax>
                  </div>
                </div>

                <p className="text-[11px] text-slate-700 leading-relaxed pt-1 border-t border-white/5">
                  {eq.description}
                </p>
              </div>
            );
          })}

          {aiEquations.map((eq, i) => (
            <InteractiveEquationCard key={`ai-${i}`} eq={eq} />
          ))}
        </div>

        {/* Prerequisites Banner */}
        <div className="p-3.5 rounded-xl bg-white/90 shadow-xl border border-slate-200 text-xs">
          <span className="font-bold text-slate-700 block mb-1">Required Prerequisite Topics:</span>
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            {sim.prerequisites.map((pre, idx) => (
              <span key={idx} className="px-2 py-0.5 rounded bg-slate-200 text-slate-600 border border-white/5 text-[11px] font-mono">
                {pre}
              </span>
            ))}
          </div>
        </div>
      </div>
      </div>
    </MathJaxContext>
  );
};
