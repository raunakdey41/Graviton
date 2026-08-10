import React, { useState } from 'react';
import { useSimulationStore } from '../../store/useSimulationStore';
import { CORE_SIMULATIONS } from '../../data/simulationsData';
import { Sparkles, X, Save, Download } from 'lucide-react';

interface NotePadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotePadModal: React.FC<NotePadModalProps> = ({ isOpen, onClose }) => {
  const { currentSimId, notesText, saveNote } = useSimulationStore();
  const sim = CORE_SIMULATIONS.find(s => s.id === currentSimId);

  const currentText = notesText[currentSimId] || '';
  const [text, setText] = useState(currentText);
  const [savedStatus, setSavedStatus] = useState(false);

  React.useEffect(() => {
    setText(notesText[currentSimId] || '');
  }, [currentSimId, notesText]);

  if (!isOpen) return null;

  const handleSave = () => {
    saveNote(currentSimId, text);
    setSavedStatus(true);
    setTimeout(() => setSavedStatus(false), 1500);
  };

  const handleExportText = () => {
    const element = document.createElement("a");
    const file = new Blob([`--- GRAVITON PHYSICS LAB NOTES ---\nSimulation: ${sim?.title || currentSimId}\nDate: ${new Date().toLocaleDateString()}\n\n${text}`], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `Graviton_Notes_${currentSimId}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[110] p-4">
      <div className="bg-white shadow-xl border border-slate-300 rounded-2xl p-6 max-w-2xl w-full shadow-2xl animate-[fadeIn_0.2s_ease-out] flex flex-col max-h-[85vh]">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-4 flex-shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-stone-400 animate-pulse" />
            <h3 className="font-heading text-lg font-bold text-slate-900">Interactive Lab Notepad</h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 text-slate-600 hover:text-slate-900">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-3 flex items-center justify-between text-xs text-slate-600 px-1">
          <span className="font-semibold text-stone-300">Active Topic: {sim?.title || currentSimId}</span>
          <span>Automatic browser persistence enabled</span>
        </div>

        <div className="flex-1 min-h-[280px] relative">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Record experimental hypotheses, numerical observation tables, or deduction proofs here during simulation execution..."
            className="w-full h-full bg-white shadow-xl border border-slate-300 rounded-2xl p-4 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:border-stone-500 focus:outline-none resize-none font-sans leading-relaxed shadow-inner"
          />
        </div>

        <div className="mt-5 pt-4 border-t border-slate-200 flex items-center justify-between gap-3 flex-shrink-0">
          <button 
            onClick={handleExportText}
            className="px-3.5 py-2 rounded-xl bg-slate-200 hover:bg-white/10 border border-slate-200 text-slate-700 hover:text-slate-900 transition-all text-xs font-semibold flex items-center gap-1.5"
          >
            <Download className="w-4 h-4 text-amber-400" /> Export as .TXT
          </button>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => { setText(''); saveNote(currentSimId, ''); }}
              className="px-3.5 py-2 rounded-xl hover:bg-stone-950/40 text-slate-600 hover:text-stone-400 transition-all text-xs font-semibold"
            >
              Clear
            </button>
            <button 
              onClick={handleSave}
              className={`px-6 py-2 rounded-xl text-slate-900 text-xs font-bold transition-all shadow-lg flex items-center gap-1.5 ${
                savedStatus ? 'bg-orange-600 shadow-orange-600/30' : 'bg-stone-600 hover:bg-stone-500 shadow-stone-600/30'
              }`}
            >
              <Save className="w-4 h-4" /> {savedStatus ? 'Saved!' : 'Save Notes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
