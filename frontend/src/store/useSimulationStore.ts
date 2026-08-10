import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Board, Grade } from '../types/simulation';

interface SimulationState {
  // Curriculum Filters
  activeBoard: Board;
  activeGrade: Grade;
  searchQuery: string;
  selectedTopic: string | null;
  
  // Active Simulation State
  currentSimId: string;
  isRunning: boolean;
  playbackSpeed: number; // 0.25, 0.5, 1, 2
  timeStep: number;
  
  // Real-time parameters for currently open simulation
  parameters: Record<string, number>;
  lockedParams: Record<string, boolean>;
  
  // Visual vector and guide toggles
  showVelocityVector: boolean;
  showAccelerationVector: boolean;
  showForceVector: boolean;
  showGrid: boolean;
  showTrajectory: boolean;
  
  // User interaction & Progress (Completely open access, local storage persistence)
  favoriteSimIds: string[];
  completedSimIds: string[];
  userXP: number;
  
  // Scratchpad Notes
  notesText: Record<string, string>; // simId -> text

  // Actions
  setActiveBoard: (board: Board) => void;
  setActiveGrade: (grade: Grade) => void;
  setSearchQuery: (query: string) => void;
  setSelectedTopic: (topic: string | null) => void;
  setCurrentSimId: (simId: string, defaultParams?: Record<string, number>) => void;
  
  setIsRunning: (running: boolean) => void;
  toggleRunning: () => void;
  setPlaybackSpeed: (speed: number) => void;
  resetSimulation: (defaultParams: Record<string, number>) => void;
  
  setParameter: (key: string, value: number) => void;
  setAllParameters: (params: Record<string, number>) => void;
  toggleParamLock: (key: string) => void;
  
  toggleVector: (type: 'velocity' | 'acceleration' | 'force' | 'grid' | 'trajectory') => void;
  toggleFavorite: (simId: string) => void;
  addXP: (amount: number, simId?: string) => void;
  saveNote: (simId: string, text: string) => void;
}

export const useSimulationStore = create<SimulationState>()(
  persist(
    (set, _get) => ({
      activeBoard: 'CBSE',
      activeGrade: 11,
      searchQuery: '',
      selectedTopic: null,
      
      currentSimId: 'free-fall',
      isRunning: false,
      playbackSpeed: 1,
      timeStep: 0,
      
      parameters: {
        gravity: 9.81,
        height: 50,
        mass: 5,
        airResistance: 0.1,
        atmosphere: 1, // 0 vacuum, 1 air
      },
      lockedParams: {},
      
      showVelocityVector: true,
      showAccelerationVector: true,
      showForceVector: true,
      showGrid: true,
      showTrajectory: true,
      
      favoriteSimIds: ['free-fall', 'projectile-motion', 'ac-circuit'],
      completedSimIds: [],
      userXP: 150,
      notesText: {},

      setActiveBoard: (board) => set({ activeBoard: board }),
      setActiveGrade: (grade) => set({ activeGrade: grade }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setSelectedTopic: (topic) => set({ selectedTopic: topic }),
      
      setCurrentSimId: (simId, defaultParams = {}) => set({ 
        currentSimId: simId, 
        parameters: { ...defaultParams },
        isRunning: false,
        timeStep: 0
      }),

      setIsRunning: (running) => set({ isRunning: running }),
      toggleRunning: () => set((state) => ({ isRunning: !state.isRunning })),
      setPlaybackSpeed: (speed) => set({ playbackSpeed: speed }),
      resetSimulation: (defaultParams) => set({ parameters: { ...defaultParams }, isRunning: false, timeStep: Date.now() }),
      
      setParameter: (key, value) => set((state) => {
        if (state.lockedParams[key]) return state; // Don't modify if locked
        return { parameters: { ...state.parameters, [key]: value } };
      }),
      setAllParameters: (params) => set({ parameters: { ...params }, isRunning: true }),
      toggleParamLock: (key) => set((state) => ({ 
        lockedParams: { ...state.lockedParams, [key]: !state.lockedParams[key] } 
      })),
      
      toggleVector: (type) => set((state) => {
        switch(type) {
          case 'velocity': return { showVelocityVector: !state.showVelocityVector };
          case 'acceleration': return { showAccelerationVector: !state.showAccelerationVector };
          case 'force': return { showForceVector: !state.showForceVector };
          case 'grid': return { showGrid: !state.showGrid };
          case 'trajectory': return { showTrajectory: !state.showTrajectory };
          default: return state;
        }
      }),
      
      toggleFavorite: (simId) => set((state) => {
        const exists = state.favoriteSimIds.includes(simId);
        return {
          favoriteSimIds: exists 
            ? state.favoriteSimIds.filter(id => id !== simId)
            : [...state.favoriteSimIds, simId]
        };
      }),


      addXP: (amount, simId) => set((state) => {
        const newCompleted = simId && !state.completedSimIds.includes(simId)
          ? [...state.completedSimIds, simId]
          : state.completedSimIds;
        return { 
          userXP: state.userXP + amount,
          completedSimIds: newCompleted
        };
      }),

      saveNote: (simId, text) => set((state) => ({
        notesText: { ...state.notesText, [simId]: text }
      }))
    }),
    {
      name: 'graviton-workspace-storage',
      partialize: (state) => ({
        favoriteSimIds: state.favoriteSimIds,
        completedSimIds: state.completedSimIds,
        userXP: state.userXP,
        notesText: state.notesText,
        activeBoard: state.activeBoard,
        activeGrade: state.activeGrade
      })
    }
  )
);
