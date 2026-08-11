import { useState } from 'react';
import { TopNavbar } from '../components/navigation/TopNavbar';
import { Sidebar } from '../components/navigation/Sidebar';
import { SimulationCanvas } from '../components/workspace/SimulationCanvas';
import { ControlPanel } from '../components/workspace/ControlPanel';
import { EquationViewer } from '../components/workspace/EquationViewer';
import { NotePadModal } from '../components/workspace/NotePadModal';
import { Sliders, Calculator,  } from 'lucide-react';

type RightPanelTab = 'controls' | 'equations';

export const Workspace = () => {
  const [activeTab, setActiveTab] = useState<RightPanelTab>('controls');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isNotesOpen, setIsNotesOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen w-screen bg-transparent overflow-hidden font-sans">
      {/* Top Navigation Bar */}
      <TopNavbar 
        
        onToggleSidebar={() => setIsSidebarOpen(prev => !prev)}
      />

      {/* Workspace Main Grid */}
      <div className="flex-1 flex flex-col md:flex-row overflow-y-auto md:overflow-hidden p-3 gap-3">
        {/* Left Hierarchical Category Tree & Search */}
        <Sidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Center Main Interactive 60 FPS Simulation Viewport */}
        <main className="flex-1 flex min-w-0 min-h-[45vh] md:min-h-0 overflow-hidden">
          <SimulationCanvas />
        </main>

        {/* Right Multi-Tab Controls & Mathematics Engine */}
        <aside className="w-full md:w-[380px] xl:w-[440px] flex-shrink-0 flex flex-col gap-2 min-h-[500px] md:min-h-0 md:overflow-hidden">
          {/* Tab Navigation Bar */}
          <div className="flex items-center bg-space-800 border border-white/10 rounded-2xl p-1 shadow-lg">
            <button
              onClick={() => setActiveTab('controls')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                activeTab === 'controls'
                  ? 'bg-stone-600 text-white shadow-md shadow-stone-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Controls</span>
            </button>

            <button
              onClick={() => setActiveTab('equations')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                activeTab === 'equations'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Equations</span>
            </button>

          </div>

          {/* Active Tab Panel Body */}
          <div className="flex-1 overflow-hidden">
            {activeTab === 'controls' && <ControlPanel />}
            {activeTab === 'equations' && <EquationViewer />}
          </div>
        </aside>
      </div>

      {/* Interactive Scratchpad & Notepad Modal */}
      <NotePadModal isOpen={isNotesOpen} onClose={() => setIsNotesOpen(false)} />
    </div>
  );
}
