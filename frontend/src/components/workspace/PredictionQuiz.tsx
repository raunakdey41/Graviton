import React, { useState } from 'react';
import { useSimulationStore } from '../../store/useSimulationStore';
import { CORE_SIMULATIONS } from '../../data/simulationsData';
import confetti from 'canvas-confetti';
import { Award, HelpCircle, CheckCircle, XCircle, Trophy } from 'lucide-react';

export const PredictionQuiz: React.FC = () => {
  const { currentSimId, addXP } = useSimulationStore();
  const sim = CORE_SIMULATIONS.find(s => s.id === currentSimId);

  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({});

  if (!sim || !sim.quiz || sim.quiz.length === 0) {
    return (
      <div className="flex flex-col h-full bg-white shadow-2xl rounded-2xl border border-slate-200 p-6 items-center justify-center text-center text-slate-600">
        <HelpCircle className="w-12 h-12 text-amber-400/50 mb-3 animate-pulse" />
        <h4 className="font-heading font-bold text-slate-900 text-sm mb-1">No Prediction Quiz Available Yet</h4>
        <p className="text-xs max-w-xs leading-relaxed">
          Test your intuitive mastery by making analytical hypotheses before running experiments in the sandbox!
        </p>
      </div>
    );
  }

  const handleSelect = (qId: string, index: number) => {
    if (submitted[qId]) return;
    setSelectedAnswers(prev => ({ ...prev, [qId]: index }));
  };

  const handleSubmit = (qId: string, correctIndex: number, xpReward: number) => {
    const chosen = selectedAnswers[qId];
    if (chosen === undefined) return;

    setSubmitted(prev => ({ ...prev, [qId]: true }));
    if (chosen === correctIndex) {
      addXP(xpReward, currentSimId);
      // Fire celebration confetti!
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.7 }
      });
    }
  };

  return (
    <div className="flex flex-col h-full bg-white shadow-2xl rounded-2xl border border-slate-200 overflow-hidden shadow-xl">
      <div className="p-4 border-b border-slate-200 bg-slate-100 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-400" />
          <h3 className="font-heading text-sm font-bold text-slate-900 tracking-wide">Prediction Challenge & Quiz</h3>
        </div>
        <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold border border-amber-500/30">
          Earn Lab XP & Mastery Badges
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 hide-scrollbar">
        <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-950/40 via-amber-900/20 to-transparent border border-amber-500/30 text-xs text-amber-200 leading-relaxed">
          💡 <strong>Pro Tip:</strong> Try predicting the outcome mathematically before executing the simulation animation to test your physics intuition!
        </div>

        {sim.quiz.map((q, qIdx) => {
          const chosen = selectedAnswers[q.id];
          const isSubmitted = submitted[q.id];
          const isCorrect = chosen === q.correctIndex;

          return (
            <div key={q.id} className="p-5 rounded-2xl bg-slate-100 border border-slate-200 space-y-4 shadow-lg">
              <div className="flex items-start justify-between gap-2">
                <span className="font-heading text-xs font-extrabold text-stone-300 flex items-center gap-1.5">
                  Question #{qIdx + 1}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300 font-bold border border-orange-500/30 flex items-center gap-1">
                  <Award className="w-3 h-3" /> +{q.xpReward} XP Reward
                </span>
              </div>

              <p className="text-xs sm:text-sm font-semibold text-slate-900 leading-relaxed">
                {q.question}
              </p>

              <div className="space-y-2.5 pt-1">
                {q.options.map((opt, oIdx) => {
                  const isThisSelected = chosen === oIdx;
                  let optionStyle = 'bg-slate-200 border-slate-200 hover:bg-white/10 text-slate-700';

                  if (isSubmitted) {
                    if (oIdx === q.correctIndex) {
                      optionStyle = 'bg-orange-950/80 border-orange-500 text-slate-900 font-bold shadow-lg shadow-orange-500/20';
                    } else if (isThisSelected) {
                      optionStyle = 'bg-stone-950/80 border-stone-500 text-stone-200 line-through';
                    } else {
                      optionStyle = 'bg-white/[0.02] border-white/5 text-slate-500 opacity-60';
                    }
                  } else if (isThisSelected) {
                    optionStyle = 'bg-stone-600/40 border-stone-400 text-slate-900 font-semibold shadow-md';
                  }

                  return (
                    <button
                      key={oIdx}
                      disabled={isSubmitted}
                      onClick={() => handleSelect(q.id, oIdx)}
                      className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm transition-all duration-200 flex items-center justify-between gap-3 ${optionStyle}`}
                    >
                      <span className="flex-1">{opt}</span>
                      {isSubmitted && oIdx === q.correctIndex && <CheckCircle className="w-4 h-4 text-orange-400 flex-shrink-0" />}
                      {isSubmitted && isThisSelected && oIdx !== q.correctIndex && <XCircle className="w-4 h-4 text-stone-400 flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {!isSubmitted ? (
                <button
                  disabled={chosen === undefined}
                  onClick={() => handleSubmit(q.id, q.correctIndex, q.xpReward)}
                  className="w-full mt-3 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-900 text-xs font-bold transition-all shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Submit Prediction Answer
                </button>
              ) : (
                <div className={`mt-4 p-4 rounded-xl border text-xs leading-relaxed ${
                  isCorrect ? 'bg-orange-950/40 border-orange-500/30 text-orange-200' : 'bg-stone-950/40 border-stone-500/30 text-stone-200'
                }`}>
                  <div className="font-extrabold flex items-center gap-1.5 mb-1 text-sm">
                    {isCorrect ? '🎉 Brilliant Physics Intuition! Answer Correct!' : '❌ Incorrect Prediction. Let\'s review the concepts:'}
                  </div>
                  <p className="text-slate-800 mt-1 font-sans">{q.explanation}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
