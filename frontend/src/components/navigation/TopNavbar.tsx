import React, { useState } from 'react';
import { useSimulationStore } from '../../store/useSimulationStore';
import type { Board, Grade } from '../../types/simulation';
import { Atom, Share2, BookOpen, Bookmark, X, ExternalLink, Check } from 'lucide-react';
import { CORE_SIMULATIONS } from '../../data/simulationsData';

const BOARDS: Board[] = ['CBSE', 'ICSE', 'ISC'];
const GRADES: Grade[] = [9, 10, 11, 12];

interface TopNavbarProps {
  onToggleSidebar: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({ onToggleSidebar }) => {
  const { 
    activeBoard, setActiveBoard, 
    activeGrade, setActiveGrade, 
    favoriteSimIds, currentSimId,
    setCurrentSimId
  } = useSimulationStore();

  const [showSavedModal, setShowSavedModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShareCopy = () => {
    const shareUrl = `${window.location.origin}/?sim=${currentSimId}&board=${activeBoard}&grade=${activeGrade}`;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <>
      <header className="text-slate-100 min-h-[4rem] border-b border-white/10 bg-space-900/90 py-3 md:py-0 px-4 flex flex-col md:flex-row items-center justify-between z-50 flex-shrink-0 gap-3 md:gap-0">
        {/* Left Logo & Toggle */}
        <div className="flex items-center justify-between w-full md:w-auto gap-3">
          <div className="flex items-center gap-3">
            <button 
              onClick={onToggleSidebar} 
              className="md:hidden p-2 rounded-lg hover:bg-white/10 text-slate-100"
              aria-label="Toggle Sidebar"
            >
              <BookOpen className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-2.5 group cursor-pointer" onClick={() => setCurrentSimId('free-fall')}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-stone-600 via-stone-600 to-amber-500 flex items-center justify-center shadow-lg shadow-stone-500/30 group-hover:scale-105 transition-transform duration-300">
                <Atom className="w-6 h-6 text-white animate-[spin_10s_linear_infinite]" />
              </div>
              <div className="flex flex-col">
                <span className="font-heading text-xl font-extrabold tracking-tight text-white flex items-center gap-1.5">
                  GRAV<span className="text-amber-400">ITON</span>
                  <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-stone-500/20 text-stone-300 border border-stone-500/30 font-normal">LAB</span>
                </span>
                <span className="text-[10px] text-slate-100 tracking-wider uppercase font-medium hidden sm:inline-block">Interactive Physics Workspace</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center Curriculum Selectors */}
        <div className="flex flex-wrap items-center justify-center gap-2 w-full md:w-auto">
          {/* Board Selector */}
          <div className="flex items-center bg-space-800/80 border border-white/10 rounded-xl p-1 px-2 shadow-sm">
            <span className="text-[10px] md:text-xs text-slate-100 mr-1.5 font-medium hidden lg:inline">Board:</span>
            <div className="flex gap-0.5">
              {BOARDS.map(board => (
                <button
                  key={board}
                  onClick={() => setActiveBoard(board)}
                  className={`px-1.5 py-0.5 md:px-2.5 md:py-1 text-[10px] md:text-xs font-semibold rounded-lg transition-all duration-200 ${
                    activeBoard === board
                      ? 'bg-gradient-to-r from-stone-600 to-stone-500 text-white shadow-md shadow-stone-500/30 scale-102'
                      : 'text-slate-100 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {board}
                </button>
              ))}
            </div>
          </div>

          {/* Grade Selector */}
          <div className="flex items-center bg-space-800/80 border border-white/10 rounded-xl p-1 px-2 shadow-sm">
            <span className="text-[10px] md:text-xs text-slate-100 mr-1.5 font-medium hidden sm:inline">Class:</span>
            <div className="flex gap-0.5">
              {GRADES.map(grade => (
                <button
                  key={grade}
                  onClick={() => setActiveGrade(grade)}
                  className={`px-1.5 py-0.5 md:px-2.5 md:py-1 text-[10px] md:text-xs font-semibold rounded-lg transition-all duration-200 ${
                    activeGrade === grade
                      ? 'bg-gradient-to-r from-amber-600 to-stone-500 text-white shadow-md shadow-amber-500/30'
                      : 'text-slate-100 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {grade}th
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Action Tools Removed */}
      </header>

      {/* Favorites & Saved Scenarios Modal */}
      {showSavedModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-space-900 border border-white/15 rounded-2xl p-6 max-w-xl w-full shadow-2xl animate-[fadeIn_0.2s_ease-out]">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
              <h3 className="font-heading text-lg font-bold text-white flex items-center gap-2">
                <Bookmark className="w-5 h-5 text-amber-400" /> My Saved Scenarios & Favorites
              </h3>
              <button onClick={() => setShowSavedModal(false)} className="p-1.5 rounded-lg hover:bg-white/10 text-slate-100 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              <div>
                <h4 className="text-xs font-mono text-stone-200 uppercase tracking-wider mb-2 font-semibold">Bookmarked Simulations</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {favoriteSimIds.map(id => {
                    const sim = CORE_SIMULATIONS.find(s => s.id === id);
                    if (!sim) return null;
                    return (
                      <div 
                        key={id} 
                        onClick={() => { setCurrentSimId(id); setShowSavedModal(false); }}
                        className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-stone-500/50 cursor-pointer flex items-center justify-between group transition-all"
                      >
                        <span className="text-xs font-semibold text-white group-hover:text-stone-300">{sim.title}</span>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-100 group-hover:text-stone-300" />
                      </div>
                    );
                  })}
                </div>
              </div>


            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
              <button onClick={() => setShowSavedModal(false)} className="px-4 py-2 bg-stone-600 hover:bg-stone-500 text-white text-xs font-semibold rounded-xl">
                Close Modal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-space-900 border border-white/15 rounded-2xl p-6 max-w-md w-full shadow-2xl animate-[fadeIn_0.2s_ease-out]">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
              <h3 className="font-heading text-lg font-bold text-white flex items-center gap-2">
                <Share2 className="w-5 h-5 text-amber-400" /> Share Lab Configuration
              </h3>
              <button onClick={() => setShowShareModal(false)} className="p-1.5 rounded-lg hover:bg-white/10 text-slate-100 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-100 mb-4 leading-relaxed">
              Generate an open-access direct link to share this exact interactive simulation, class grade level, and educational board with classmates or friends! No sign-in required.
            </p>
            
            <div className="flex items-center gap-2 bg-black/40 border border-white/15 rounded-xl p-2.5 mb-4 font-mono text-[11px] text-amber-300 overflow-hidden text-ellipsis">
              <span className="truncate flex-1">{window.location.origin}/?sim={currentSimId}&board={activeBoard}&grade={activeGrade}</span>
              <button 
                onClick={handleShareCopy} 
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all flex-shrink-0 ${
                  copied ? 'bg-orange-600 text-white' : 'bg-stone-600 hover:bg-stone-500 text-white'
                }`}
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : null}
                {copied ? 'Copied!' : 'Copy URL'}
              </button>
            </div>

            <div className="p-3 rounded-xl bg-stone-950/40 border border-stone-500/30 text-[11px] text-stone-300">
              ⚡ <strong>Open Access:</strong> Anyone opening this link gets full interaction with real-time sliders and vector animations instantly!
            </div>
          </div>
        </div>
      )}
    </>
  );
};
