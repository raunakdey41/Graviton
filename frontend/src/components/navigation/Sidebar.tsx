import React, { useState, useMemo } from 'react';
import { useSimulationStore } from '../../store/useSimulationStore';
import { CORE_SIMULATIONS } from '../../data/simulationsData';
import { Search, ChevronDown, ChevronRight, Play, BookOpen, Layers, Menu } from 'lucide-react';
import type { Topic } from '../../types/simulation';

const TOPICS: Topic[] = [
  'Mechanics',
  'Electromagnetism',
  'Optics',
  'Waves & Thermodynamics',
  'Nuclear Physics'
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { 
    activeBoard, activeGrade, searchQuery, 
    setSearchQuery, selectedTopic,
    currentSimId, setCurrentSimId
  } = useSimulationStore();

  const [collapsedTopics, setCollapsedTopics] = useState<Record<string, boolean>>({});
  const [filterMode, setFilterMode] = useState<'all' | 'interactive' | 'currentGrade'>('all');

  const toggleTopic = (topic: string) => {
    setCollapsedTopics(prev => ({ ...prev, [topic]: !prev[topic] }));
  };

  const filteredCatalog = useMemo(() => {
    return CORE_SIMULATIONS.filter(sim => {
      // Board check
      const boardMatch = sim.boards.includes(activeBoard);
      // Grade check (if currentGrade filter active)
      const gradeMatch = filterMode === 'currentGrade' ? sim.grade.includes(activeGrade) : true;
      // Interactive check
      const interactiveMatch = filterMode === 'interactive' ? sim.isInteractive : true;
      // Topic check
      const topicMatch = selectedTopic ? sim.topic === selectedTopic : true;
      // Search check
      const searchMatch = searchQuery.trim() === '' || 
        sim.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sim.subtopic.toLowerCase().includes(searchQuery.toLowerCase());

      return boardMatch && gradeMatch && interactiveMatch && topicMatch && searchMatch;
    });
  }, [activeBoard, activeGrade, filterMode, selectedTopic, searchQuery]);

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-40 text-slate-100 bg-space-900 flex flex-col transition-[width,transform] duration-300 ease-in-out flex-shrink-0 overflow-hidden min-w-0
        ${isOpen ? 'translate-x-0 w-72 border-r border-white/10' : '-translate-x-full w-72 md:translate-x-0 md:w-0 border-r-0 border-white/0'}
      `}>
        <div className="w-72 flex flex-col h-full flex-shrink-0">
        {/* Search & Filter Header */}
        <div className="p-4 border-b border-white/10 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="font-heading font-bold text-white text-sm">Explore</span>
            <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors hidden md:block focus:outline-none focus:ring-2 focus:ring-amber-500" aria-label="Hide left panel" title="Hide left panel">
              <Menu className="w-4 h-4" />
            </button>
          </div>
          <div className="relative">
          <Search className="w-4 h-4 text-slate-100 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input 
            type="text" 
            placeholder="Search physics concepts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-space-800 border border-white/15 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:border-stone-500 focus:outline-none transition-all"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-100 hover:text-white">
              Clear
            </button>
          )}
        </div>

        {/* Quick Filter Buttons */}
        <div className="flex items-center gap-1.5 bg-space-800/60 p-1 rounded-xl border border-white/5 text-[11px]">
          <button 
            onClick={() => setFilterMode('all')}
            className={`flex-1 py-1 rounded-lg font-semibold transition-all ${filterMode === 'all' ? 'bg-stone-600 text-white shadow' : 'text-slate-100 hover:text-white'}`}
          >
            All (50+)
          </button>
          <button 
            onClick={() => setFilterMode('interactive')}
            className={`flex-1 py-1 rounded-lg font-semibold transition-all ${filterMode === 'interactive' ? 'bg-amber-600 text-white shadow' : 'text-slate-100 hover:text-white'}`}
          >
            Interactive
          </button>
          <button 
            onClick={() => setFilterMode('currentGrade')}
            className={`flex-1 py-1 rounded-lg font-semibold transition-all ${filterMode === 'currentGrade' ? 'bg-stone-600 text-white shadow' : 'text-slate-100 hover:text-white'}`}
          >
            {activeGrade}th Only
          </button>
        </div>
      </div>

      {/* Curriculum Category Tree */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 hide-scrollbar">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-100 px-1 uppercase tracking-wider">
          <span className="flex items-center gap-1.5"><Layers className="w-3.5 h-3.5 text-stone-200" /> Syllabus Topics</span>
          <span className="text-[10px] font-mono text-stone-200">{activeBoard}</span>
        </div>

        {TOPICS.map(topic => {
          const topicSims = filteredCatalog.filter(s => s.topic === topic);
          if (topicSims.length === 0 && searchQuery) return null;

          const isCollapsed = collapsedTopics[topic];

          return (
            <div key={topic} className="border border-white/5 rounded-2xl overflow-hidden bg-white/[0.02]">
              {/* Topic Accordion Header */}
              <div 
                onClick={() => toggleTopic(topic)} 
                className="p-3 bg-white/[0.04] hover:bg-white/[0.07] cursor-pointer flex items-center justify-between select-none transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-200">{topic}</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-white/10 text-slate-100 font-mono text-[10px] font-medium">
                    {topicSims.length}
                  </span>
                </div>
                {isCollapsed ? <ChevronRight className="w-4 h-4 text-slate-100" /> : <ChevronDown className="w-4 h-4 text-slate-100" />}
              </div>

              {/* Subtopic Simulation List */}
              {!isCollapsed && (
                <div className="p-1.5 space-y-1 divide-y divide-white/[0.03]">
                  {topicSims.length === 0 ? (
                    <p className="text-[11px] text-slate-100 italic py-2 px-3">No topics match filters in this branch.</p>
                  ) : (
                    topicSims.map(sim => {
                      const isSelected = sim.id === currentSimId;

                      return (
                        <button
                          key={sim.id}
                          onClick={() => {
                            if (sim.isInteractive) {
                              setCurrentSimId(sim.id);
                              onClose();
                            }
                          }}
                          disabled={!sim.isInteractive}
                          className={`w-full text-left p-2.5 rounded-xl flex items-start gap-2.5 transition-all duration-200 ${
                            isSelected
                              ? 'bg-gradient-to-r from-stone-900/80 via-stone-900/40 to-transparent border-l-4 border-stone-400 text-white font-semibold shadow'
                              : sim.isInteractive
                              ? 'hover:bg-white/[0.05] text-slate-100 hover:text-white'
                              : 'opacity-50 cursor-not-allowed text-slate-100'
                          }`}
                        >
                          <div className={`mt-0.5 p-1.5 rounded-lg flex-shrink-0 ${
                            sim.isInteractive 
                              ? isSelected ? 'bg-stone-500 text-white shadow-sm' : 'bg-stone-500/20 text-stone-200' 
                              : 'bg-white/5 text-slate-100'
                          }`}>
                            {sim.isInteractive ? <Play className="w-3 h-3 fill-current" /> : <BookOpen className="w-3 h-3" />}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <span className="text-xs truncate font-medium">{sim.title}</span>
                            </div>
                            <div className="flex items-center gap-1.5 mt-1">
                              <span className="text-[9px] font-mono text-slate-100 uppercase tracking-tight">{sim.subtopic}</span>
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-white/5 text-slate-100 font-mono">
                                Class {sim.grade.join(', ')}
                              </span>
                              {!sim.isInteractive && (
                                <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-medium ml-auto">
                                  Syllabus Map
                                </span>
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="p-3.5 border-t border-white/10 bg-black/20 flex flex-col gap-1 text-[11px] text-slate-100">
        <div className="flex items-center justify-between font-semibold text-slate-100">
          <span>Curriculum Coverage</span>
          <span className="text-orange-400 font-mono">100% Aligned</span>
        </div>
        <p className="text-[10px] text-slate-100 leading-tight">
          Strictly standardized for CBSE, ICSE and ISC textbook laboratories.
        </p>
      </div>
        </div>
    </aside>
    </>
  );
};
