import { useState } from 'react';
import { TopNavbar } from '../components/navigation/TopNavbar';
import { Sidebar } from '../components/navigation/Sidebar';
import { SimulationCanvas } from '../components/workspace/SimulationCanvas';
import { ControlPanel } from '../components/workspace/ControlPanel';
import { EquationViewer } from '../components/workspace/EquationViewer';
import { NotePadModal } from '../components/workspace/NotePadModal';
import { Sliders, Calculator, Menu } from 'lucide-react';

type RightPanelTab = 'controls' | 'equations';

export const Workspace = () => {
  const [activeTab, setActiveTab] = useState<RightPanelTab>('controls');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(true);
  const [isNotesOpen, setIsNotesOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen w-screen bg-transparent overflow-hidden font-sans">
      {/* Top Navigation Bar */}
      <TopNavbar 
        
        onToggleSidebar={() => setIsSidebarOpen(prev => !prev)}
      />

      {/* Workspace Main Grid */}
      <div className="flex-1 flex flex-col md:flex-row overflow-y-auto md:overflow-hidden p-3 gap-3 relative">
        {/* Left Hierarchical Category Tree & Search */}
        <Sidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Center Main Interactive 60 FPS Simulation Viewport */}
        <main className="flex-1 flex flex-col min-w-0 min-h-[45vh] md:min-h-0 overflow-hidden relative transition-all duration-300">
          
          {/* Floating Reopen Left Panel */}
          {!isSidebarOpen && (
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-space-800 border border-white/10 rounded-r-xl p-2 text-slate-300 hover:text-white shadow-lg shadow-black/50 hidden md:flex transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500"
              aria-label="Show left panel"
              title="Show left panel"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}
          
          {/* Floating Reopen Right Panel */}
          {!isRightPanelOpen && (
            <button 
              onClick={() => setIsRightPanelOpen(true)}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-space-800 border border-white/10 rounded-l-xl p-2 text-slate-300 hover:text-white shadow-lg shadow-black/50 hidden md:flex transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500"
              aria-label="Show right panel"
              title="Show right panel"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <SimulationCanvas />
        </main>

        {/* Right Multi-Tab Controls & Mathematics Engine */}
        <aside className={`transition-[width] duration-300 ease-in-out flex-shrink-0 flex flex-col gap-2 min-h-[500px] md:min-h-0 overflow-hidden min-w-0 ${isRightPanelOpen ? 'w-full md:w-[380px] xl:w-[440px]' : 'w-full md:w-0'}`}>
          <div className="w-full md:w-[380px] xl:w-[440px] flex flex-col gap-2 h-full flex-shrink-0">
          {/* Tab Navigation Bar */}
          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center bg-space-800 border border-white/10 rounded-2xl p-1 shadow-lg">
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
            {/* Close Right Panel button */}
            <button onClick={() => setIsRightPanelOpen(false)} className="p-2 rounded-xl bg-space-800 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-colors hidden md:flex flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-amber-500" aria-label="Hide right panel" title="Hide right panel">
              <Menu className="w-5 h-5" />
            </button>
          </div>

          {/* Active Tab Panel Body */}
          <div className="flex-1 overflow-hidden">
            {activeTab === 'controls' && <ControlPanel />}
            {activeTab === 'equations' && <EquationViewer />}
          </div>
          </div>
        </aside>
      </div>

      {/* Interactive Scratchpad & Notepad Modal */}
      <NotePadModal isOpen={isNotesOpen} onClose={() => setIsNotesOpen(false)} />
    </div>
  );
}
