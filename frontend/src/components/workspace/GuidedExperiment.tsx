import React, { useState } from 'react';
import { useSimulationStore } from '../../store/useSimulationStore';
import { CORE_SIMULATIONS } from '../../data/simulationsData';
import { FlaskConical, CheckCircle2, Circle, Lightbulb, Play } from 'lucide-react';

export const GuidedExperiment: React.FC = () => {
  const { currentSimId, setParameter } = useSimulationStore();
  const sim = CORE_SIMULATIONS.find(s => s.id === currentSimId);
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});

  if (!sim || !sim.guidedSteps || sim.guidedSteps.length === 0) {
    return (
      <div className="flex flex-col h-full bg-white shadow-2xl rounded-2xl border border-slate-200 p-6 items-center justify-center text-center text-slate-600">
        <FlaskConical className="w-12 h-12 text-stone-400/50 mb-3 animate-pulse" />
        <h4 className="font-heading font-bold text-slate-900 text-sm mb-1">Self-Guided Experimental Sandbox</h4>
        <p className="text-xs max-w-xs leading-relaxed">
          Use the control panel and equation engine to independently alter parameters and verify physical outcomes!
        </p>
      </div>
    );
  }

  const toggleStep = (stepNum: number) => {
    setCompletedSteps(prev => ({ ...prev, [stepNum]: !prev[stepNum] }));
  };

  const handleApplyStepTarget = (targetParam?: string, value?: number) => {
    if (targetParam && value !== undefined) {
      setParameter(targetParam, value);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white shadow-2xl rounded-2xl border border-slate-200 overflow-hidden shadow-xl">
      <div className="p-4 border-b border-slate-200 bg-slate-100 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <FlaskConical className="w-4 h-4 text-orange-400" />
          <h3 className="font-heading text-sm font-bold text-slate-900 tracking-wide">Guided Lab Experiment</h3>
        </div>
        <span className="text-[10px] font-mono font-bold text-slate-600 bg-slate-200 px-2 py-0.5 rounded border border-slate-200">
          {Object.values(completedSteps).filter(Boolean).length} / {sim.guidedSteps.length} Steps Complete
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 hide-scrollbar">
        <div className="text-xs text-slate-700 bg-orange-950/30 border border-orange-500/20 p-3.5 rounded-xl leading-relaxed">
          Follow this structured procedural investigation to isolate variables and observe direct cause-and-effect physical laws!
        </div>

        {sim.guidedSteps.map((step) => {
          const isDone = !!completedSteps[step.stepNumber];

          return (
            <div 
              key={step.stepNumber} 
              className={`p-4 rounded-xl border transition-all duration-200 ${
                isDone 
                  ? 'bg-orange-950/20 border-orange-500/40 text-slate-700' 
                  : 'bg-white/[0.03] border-slate-200 hover:border-stone-500/40'
              }`}
            >
              <div className="flex items-start gap-3">
                <button 
                  onClick={() => toggleStep(step.stepNumber)} 
                  className="mt-0.5 text-orange-400 hover:text-orange-300 transition-transform hover:scale-110 flex-shrink-0"
                >
                  {isDone ? <CheckCircle2 className="w-5 h-5 fill-orange-500/20" /> : <Circle className="w-5 h-5 text-slate-500" />}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className={`font-heading text-xs font-bold ${isDone ? 'text-orange-300' : 'text-slate-900'}`}>
                      Step {step.stepNumber}: {step.title}
                    </h4>
                  </div>
                  
                  <p className="text-xs text-slate-800 mt-1.5 leading-relaxed">
                    {step.instruction}
                  </p>

                  {step.targetParameterId && step.targetValue !== undefined && (
                    <button 
                      onClick={() => handleApplyStepTarget(step.targetParameterId, step.targetValue)}
                      className="mt-3 px-3 py-1.5 rounded-lg bg-stone-600/30 hover:bg-stone-600 text-stone-200 hover:text-slate-900 border border-stone-500/30 hover:border-transparent text-xs font-semibold flex items-center gap-1.5 transition-all shadow"
                    >
                      <Play className="w-3 h-3 fill-current" /> Auto-Apply: Set {step.targetParameterId} to {step.targetValue}
                    </button>
                  )}

                  <div className="mt-3 p-3 rounded-lg bg-slate-100 border border-white/5 text-[11px] text-amber-300 flex items-start gap-2">
                    <Lightbulb className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5 animate-pulse" />
                    <span><strong>Observation Prompt:</strong> {step.observationPrompt}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
