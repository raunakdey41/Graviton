import type { SimulationConfig } from '../types/simulation';

export const CORE_SIMULATIONS: SimulationConfig[] = [
  {
    id: 'free-fall',
    title: 'Free Fall & Air Resistance',
    subtitle: 'Explore gravity and air drag on falling objects.',
    topic: 'Mechanics',
    subtopic: 'Kinematics',
    grade: [9, 10, 11],
    boards: ['CBSE', 'ICSE', 'ISC'],
    difficulty: 'Beginner',
    isInteractive: true,
    learningObjectives: ['Understand terminal velocity', 'Analyze effect of mass and drag'],
    prerequisites: ['Basic Kinematics'],
    realWorldApps: [
      { title: 'Skydiving', description: 'Terminal velocity and drag' },
      { title: 'Falling objects', description: 'Objects falling under gravity' }
    ],
    parameters: [
      { id: 'height', label: 'Initial Height', variableSymbol: 'h', min: 10, max: 200, step: 10, defaultValue: 80, unit: 'm', category: 'initial_conditions' },
      { id: 'gravity', label: 'Gravity', variableSymbol: 'g', min: 1, max: 25, step: 0.1, defaultValue: 9.81, unit: 'm/s²', category: 'environment' },
      { id: 'mass', label: 'Mass', variableSymbol: 'm', min: 0.1, max: 50, step: 0.1, defaultValue: 5, unit: 'kg', category: 'initial_conditions' }
    ],
    equations: [], guidedSteps: [], quiz: []
  },
  {
    id: 'universal-motion-lab',
    title: 'Universal Motion Simulator',
    subtitle: 'Comprehensive 1D & 2D kinematics. Explore distance, velocity, acceleration.',
    topic: 'Mechanics',
    subtopic: 'Kinematics',
    grade: [9, 10, 11, 12],
    boards: ['CBSE', 'ICSE', 'ISC'],
    difficulty: 'All Levels',
    isInteractive: true,
    learningObjectives: ['Master relationships between position, velocity, and acceleration.'],
    prerequisites: ['Basic Algebra', 'Vectors'],
    realWorldApps: [],
    parameters: [
      { id: 'initialVelocity', label: 'Initial Velocity (v₀)', variableSymbol: 'v_0', min: -50, max: 50, step: 1, defaultValue: 15, unit: 'm/s', category: 'initial_conditions' },
      { id: 'acceleration', label: 'Acceleration (a)', variableSymbol: 'a', min: -20, max: 20, step: 0.5, defaultValue: -9.8, unit: 'm/s²', category: 'environment' }
    ],
    equations: [], guidedSteps: [], quiz: []
  },
  {
    id: 'friction-inclined-plane',
    title: 'Friction on Inclined Plane',
    subtitle: 'Analyze forces, static and kinetic friction on a block sliding down a ramp.',
    topic: 'Mechanics',
    subtopic: 'Dynamics',
    grade: [11],
    boards: ['CBSE', 'ISC'],
    difficulty: 'Intermediate',
    isInteractive: true,
    learningObjectives: ['Resolve forces on an incline', 'Understand difference between static and kinetic friction'],
    prerequisites: ['Vectors', 'Newton\'s Laws'],
    realWorldApps: [
      { title: 'Ramps', description: 'Sliding objects on inclined planes' }
    ],
    parameters: [
      { id: 'angle', label: 'Incline Angle', variableSymbol: 'θ', min: 0, max: 90, step: 1, defaultValue: 25, unit: '°', category: 'environment' },
      { id: 'mass', label: 'Mass', variableSymbol: 'm', min: 1, max: 100, step: 1, defaultValue: 10, unit: 'kg', category: 'initial_conditions' },
      { id: 'staticCoeff', label: 'Static Friction', variableSymbol: 'μ_s', min: 0, max: 1, step: 0.01, defaultValue: 0.55, unit: '', category: 'environment' },
      { id: 'kineticCoeff', label: 'Kinetic Friction', variableSymbol: 'μ_k', min: 0, max: 1, step: 0.01, defaultValue: 0.40, unit: '', category: 'environment' },
      { id: 'appliedForce', label: 'Applied Force', variableSymbol: 'F_{ext}', min: -500, max: 500, step: 10, defaultValue: 0, unit: 'N', category: 'initial_conditions' }
    ],
    equations: [], guidedSteps: [], quiz: []
  },
  {
    id: 'pendulum-motion',
    title: 'Pendulum Motion',
    subtitle: 'Study simple harmonic motion with a pendulum.',
    topic: 'Mechanics',
    subtopic: 'Oscillations',
    grade: [11],
    boards: ['CBSE', 'ISC'],
    difficulty: 'Intermediate',
    isInteractive: true,
    learningObjectives: ['Analyze SHM period and frequency', 'Energy conservation in pendulum'],
    prerequisites: ['Trigonometry', 'Energy Conservation'],
    realWorldApps: [
      { title: 'Clocks', description: 'Pendulum clocks using SHM' }
    ],
    parameters: [
      { id: 'angle', label: 'Initial Angle', variableSymbol: 'θ_0', min: 0, max: 90, step: 1, defaultValue: 30, unit: '°', category: 'initial_conditions' },
      { id: 'length', label: 'Length', variableSymbol: 'L', min: 0.5, max: 10, step: 0.1, defaultValue: 2.5, unit: 'm', category: 'initial_conditions' },
      { id: 'mass', label: 'Bob Mass', variableSymbol: 'm', min: 0.1, max: 50, step: 0.1, defaultValue: 5, unit: 'kg', category: 'initial_conditions' },
      { id: 'damping', label: 'Damping', variableSymbol: 'b', min: 0, max: 0.5, step: 0.01, defaultValue: 0.02, unit: '', category: 'environment' }
    ],
    equations: [], guidedSteps: [], quiz: []
  },
  {
    id: 'circular-motion',
    title: 'Circular Motion',
    subtitle: 'Explore centripetal force and tangential velocity in uniform circular motion.',
    topic: 'Mechanics',
    subtopic: 'Dynamics',
    grade: [11],
    boards: ['CBSE', 'ISC'],
    difficulty: 'Intermediate',
    isInteractive: true,
    learningObjectives: ['Understand centripetal acceleration and force'],
    prerequisites: ['Kinematics', 'Vectors'],
    realWorldApps: [
      { title: 'Satellites', description: 'Orbital motion of satellites' }
    ],
    parameters: [
      { id: 'radius', label: 'Radius', variableSymbol: 'R', min: 1, max: 20, step: 0.5, defaultValue: 3.5, unit: 'm', category: 'environment' },
      { id: 'velocity', label: 'Tangential Velocity', variableSymbol: 'v', min: 1, max: 30, step: 1, defaultValue: 5.0, unit: 'm/s', category: 'initial_conditions' },
      { id: 'mass', label: 'Mass', variableSymbol: 'm', min: 1, max: 100, step: 1, defaultValue: 8.0, unit: 'kg', category: 'initial_conditions' }
    ],
    equations: [], guidedSteps: [], quiz: []
  },
  {
    id: 'spring-mass-oscillator',
    title: 'Spring-Mass Oscillator',
    subtitle: 'Visualize Hooke\'s Law and damped harmonic oscillations.',
    topic: 'Mechanics',
    subtopic: 'Oscillations',
    grade: [11],
    boards: ['CBSE', 'ISC'],
    difficulty: 'Intermediate',
    isInteractive: true,
    learningObjectives: ['Analyze spring constant effects', 'Study damped oscillations'],
    prerequisites: ['Hooke\'s Law', 'Calculus basics'],
    realWorldApps: [
      { title: 'Suspensions', description: 'Vehicle suspension systems' }
    ],
    parameters: [
      { id: 'springConstant', label: 'Spring Constant', variableSymbol: 'k', min: 10, max: 500, step: 5, defaultValue: 60, unit: 'N/m', category: 'environment' },
      { id: 'mass', label: 'Mass', variableSymbol: 'm', min: 0.5, max: 20, step: 0.5, defaultValue: 3.0, unit: 'kg', category: 'initial_conditions' },
      { id: 'amplitude', label: 'Initial Displacement', variableSymbol: 'A', min: 0.1, max: 5, step: 0.1, defaultValue: 2.0, unit: 'm', category: 'initial_conditions' },
      { id: 'damping', label: 'Damping Coefficient', variableSymbol: 'γ', min: 0, max: 1, step: 0.01, defaultValue: 0.04, unit: 'kg/s', category: 'environment' }
    ],
    equations: [], guidedSteps: [], quiz: []
  },
  {
    id: 'projectile-motion',
    title: 'Projectile Motion',
    subtitle: 'Analyze 2D trajectory of a projectile with varying angles and velocities.',
    topic: 'Mechanics',
    subtopic: 'Kinematics',
    grade: [11],
    boards: ['CBSE', 'ISC'],
    difficulty: 'Intermediate',
    isInteractive: true,
    learningObjectives: ['Determine range, max height, and time of flight'],
    prerequisites: ['Trigonometry', '1D Kinematics'],
    realWorldApps: [
      { title: 'Sports', description: 'Trajectory of a thrown ball' }
    ],
    parameters: [
      { id: 'velocity', label: 'Launch Velocity', variableSymbol: 'v_0', min: 1, max: 150, step: 1, defaultValue: 35, unit: 'm/s', category: 'initial_conditions' },
      { id: 'angle', label: 'Launch Angle', variableSymbol: 'θ', min: 0, max: 90, step: 1, defaultValue: 45, unit: '°', category: 'initial_conditions' },
      { id: 'height', label: 'Initial Height', variableSymbol: 'h_0', min: 0, max: 100, step: 1, defaultValue: 0, unit: 'm', category: 'initial_conditions' },
      { id: 'gravity', label: 'Gravity', variableSymbol: 'g', min: 1, max: 25, step: 0.1, defaultValue: 9.81, unit: 'm/s²', category: 'environment' }
    ],
    equations: [], guidedSteps: [], quiz: []
  },
  {
    id: 'collisions-momentum',
    title: 'Collisions & Momentum',
    subtitle: 'Elastic and inelastic 1D collisions between two masses.',
    topic: 'Mechanics',
    subtopic: 'Dynamics',
    grade: [11],
    boards: ['CBSE', 'ISC'],
    difficulty: 'Intermediate',
    isInteractive: true,
    learningObjectives: ['Conservation of momentum', 'Coefficient of restitution'],
    prerequisites: ['Momentum', 'Kinetic Energy'],
    realWorldApps: [
      { title: 'Billiards', description: 'Elastic collisions of balls' }
    ],
    parameters: [
      { id: 'mass1', label: 'Mass 1', variableSymbol: 'm_1', min: 1, max: 50, step: 1, defaultValue: 6, unit: 'kg', category: 'initial_conditions' },
      { id: 'velocity1', label: 'Velocity 1', variableSymbol: 'v_1', min: -50, max: 50, step: 1, defaultValue: 10, unit: 'm/s', category: 'initial_conditions' },
      { id: 'mass2', label: 'Mass 2', variableSymbol: 'm_2', min: 1, max: 50, step: 1, defaultValue: 12, unit: 'kg', category: 'initial_conditions' },
      { id: 'velocity2', label: 'Velocity 2', variableSymbol: 'v_2', min: -50, max: 50, step: 1, defaultValue: -4, unit: 'm/s', category: 'initial_conditions' },
      { id: 'restitution', label: 'Restitution (e)', variableSymbol: 'e', min: 0, max: 1, step: 0.05, defaultValue: 1.0, unit: '', category: 'environment' }
    ],
    equations: [], guidedSteps: [], quiz: []
  },
  {
    id: 'ray-optics-lenses',
    title: 'Ray Optics & Lenses',
    subtitle: 'Trace light rays through convex/concave lenses and mirrors.',
    topic: 'Optics',
    subtopic: 'Ray Optics',
    grade: [10, 12],
    boards: ['CBSE', 'ICSE', 'ISC'],
    difficulty: 'Intermediate',
    isInteractive: true,
    learningObjectives: ['Understand image formation and the lens/mirror formula'],
    prerequisites: ['Basic Geometry'],
    realWorldApps: [
      { title: 'Glasses', description: 'Corrective lenses for vision' }
    ],
    parameters: [
      { 
        id: 'opticType', label: 'Optical Element', variableSymbol: 'Type', min: 0, max: 3, step: 1, defaultValue: 0, unit: '', category: 'environment',
        options: [
          { value: 0, label: 'Convex Lens' },
          { value: 1, label: 'Concave Lens' },
          { value: 2, label: 'Concave Mirror' },
          { value: 3, label: 'Convex Mirror' }
        ]
      },
      { id: 'focalLength', label: 'Focal Length', variableSymbol: 'f', min: 10, max: 100, step: 1, defaultValue: 20, unit: 'cm', category: 'environment' },
      { id: 'objectDistance', label: 'Object Distance', variableSymbol: 'u', min: -200, max: -5, step: 1, defaultValue: -45, unit: 'cm', category: 'initial_conditions' },
      { id: 'objectHeight', label: 'Object Height', variableSymbol: 'h_0', min: 1, max: 50, step: 1, defaultValue: 12, unit: 'cm', category: 'initial_conditions' }
    ],
    equations: [], guidedSteps: [], quiz: []
  },
  {
    id: 'lateral-inversion',
    title: 'Lateral Inversion',
    subtitle: 'Understand how a plane mirror inverts an image laterally.',
    topic: 'Optics',
    subtopic: 'Ray Optics',
    grade: [9, 10],
    boards: ['CBSE', 'ICSE', 'ISC'],
    difficulty: 'Beginner',
    isInteractive: true,
    learningObjectives: ['Visualize left-right inversion in plane mirrors'],
    prerequisites: ['Reflection'],
    realWorldApps: [
      { title: 'Ambulance', description: 'Why AMBULANCE is written backward' }
    ],
    parameters: [
      { id: 'distance', label: 'Object Distance', variableSymbol: 'u', min: -100, max: -10, step: 1, defaultValue: -40, unit: 'cm', category: 'initial_conditions' }
    ],
    equations: [], guidedSteps: [], quiz: []
  },
  {
    id: 'critical-angle',
    title: 'Critical Angle & TIR',
    subtitle: 'Simulate refraction and Total Internal Reflection.',
    topic: 'Optics',
    subtopic: 'Ray Optics',
    grade: [10, 12],
    boards: ['CBSE', 'ICSE', 'ISC'],
    difficulty: 'Intermediate',
    isInteractive: true,
    learningObjectives: ['Understand Snell\'s Law and Total Internal Reflection'],
    prerequisites: ['Refraction'],
    realWorldApps: [
      { title: 'Fiber Optics', description: 'Internet data transmission via TIR' }
    ],
    parameters: [
      { id: 'n1', label: 'Incident Medium (n1)', variableSymbol: 'n_1', min: 1.0, max: 2.5, step: 0.1, defaultValue: 1.5, unit: '', category: 'environment' },
      { id: 'n2', label: 'Refracted Medium (n2)', variableSymbol: 'n_2', min: 1.0, max: 2.5, step: 0.1, defaultValue: 1.0, unit: '', category: 'environment' },
      { id: 'angle', label: 'Incident Angle', variableSymbol: 'θ_i', min: 0, max: 90, step: 1, defaultValue: 30, unit: '°', category: 'initial_conditions' }
    ],
    equations: [], guidedSteps: [], quiz: []
  },
  {
    id: 'wave-interference',
    title: 'Wave Interference',
    subtitle: '2D ripples from two point sources creating interference patterns.',
    topic: 'Waves & Thermodynamics',
    subtopic: 'Wave Optics',
    grade: [11, 12],
    boards: ['CBSE', 'ISC'],
    difficulty: 'Advanced',
    isInteractive: true,
    learningObjectives: ['Visualize constructive and destructive interference'],
    prerequisites: ['Wave motion'],
    realWorldApps: [
      { title: 'Noise Cancellation', description: 'Headphones using destructive interference' }
    ],
    parameters: [
      { id: 'frequency', label: 'Frequency', variableSymbol: 'f', min: 1, max: 20, step: 1, defaultValue: 5, unit: 'Hz', category: 'environment' },
      { id: 'separation', label: 'Source Separation', variableSymbol: 'd', min: 1, max: 50, step: 1, defaultValue: 15, unit: 'cm', category: 'initial_conditions' }
    ],
    equations: [], guidedSteps: [], quiz: []
  },
  {
    id: 'ac-circuit-resonance',
    title: 'AC Circuit & Resonance',
    subtitle: 'Explore RLC circuits, impedance, and resonance frequencies.',
    topic: 'Electromagnetism',
    subtopic: 'Alternating Current',
    grade: [12],
    boards: ['CBSE', 'ISC'],
    difficulty: 'Advanced',
    isInteractive: true,
    learningObjectives: ['Analyze RLC circuits and phase differences', 'Understand resonance'],
    prerequisites: ['DC Circuits', 'Trigonometry'],
    realWorldApps: [
      { title: 'Radios', description: 'Tuning a radio using LC resonance' }
    ],
    parameters: [
      { id: 'resistance', label: 'Resistance', variableSymbol: 'R', min: 1, max: 1000, step: 10, defaultValue: 50, unit: 'Ω', category: 'environment' },
      { id: 'inductance', label: 'Inductance', variableSymbol: 'L', min: 1, max: 1000, step: 10, defaultValue: 100, unit: 'mH', category: 'environment' },
      { id: 'capacitance', label: 'Capacitance', variableSymbol: 'C', min: 1, max: 1000, step: 10, defaultValue: 50, unit: 'μF', category: 'environment' },
      { id: 'frequency', label: 'AC Frequency', variableSymbol: 'f', min: 1, max: 1000, step: 5, defaultValue: 70, unit: 'Hz', category: 'initial_conditions' },
      { id: 'voltage', label: 'Peak Voltage', variableSymbol: 'V_0', min: 1, max: 500, step: 5, defaultValue: 120, unit: 'V', category: 'initial_conditions' }
    ],
    equations: [], guidedSteps: [], quiz: []
  },
  {
    id: 'magnetic-field-lorentz',
    title: 'Magnetic Field & Lorentz Force',
    subtitle: 'Visualize charged particles moving through uniform magnetic fields.',
    topic: 'Electromagnetism',
    subtopic: 'Magnetism',
    grade: [12],
    boards: ['CBSE', 'ISC'],
    difficulty: 'Advanced',
    isInteractive: true,
    learningObjectives: ['Understand the Lorentz force on moving charges'],
    prerequisites: ['Vectors', 'Cross Products'],
    realWorldApps: [
      { title: 'Particle Accelerators', description: 'Cyclotrons using magnetic fields' }
    ],
    parameters: [
      { id: 'magField', label: 'Magnetic Field', variableSymbol: 'B', min: -5, max: 5, step: 0.1, defaultValue: 1.5, unit: 'T', category: 'environment' },
      { id: 'velocity', label: 'Particle Velocity', variableSymbol: 'v', min: 1, max: 500, step: 10, defaultValue: 80, unit: 'm/s', category: 'initial_conditions' },
      { id: 'charge', label: 'Charge', variableSymbol: 'q', min: -10, max: 10, step: 0.5, defaultValue: 2, unit: 'mC', category: 'initial_conditions' },
      { id: 'mass', label: 'Mass', variableSymbol: 'm', min: 0.1, max: 20, step: 0.1, defaultValue: 4, unit: 'mg', category: 'initial_conditions' }
    ],
    equations: [], guidedSteps: [], quiz: []
  },
  {
    id: 'gas-laws-thermo',
    title: 'Gas Laws & Thermodynamics',
    subtitle: 'Interactive simulation of Ideal Gas Law (PV=nRT).',
    topic: 'Waves & Thermodynamics',
    subtopic: 'Kinetic Theory',
    grade: [11],
    boards: ['CBSE', 'ISC'],
    difficulty: 'Intermediate',
    isInteractive: true,
    learningObjectives: ['Verify Boyle\'s, Charles\'s and Gay-Lussac\'s Laws'],
    prerequisites: ['Basic Chemistry'],
    realWorldApps: [
      { title: 'Engines', description: 'Internal combustion engines' }
    ],
    parameters: [
      { id: 'volume', label: 'Volume', variableSymbol: 'V', min: 1, max: 20, step: 0.5, defaultValue: 4.0, unit: 'L', category: 'environment' },
      { id: 'temperature', label: 'Temperature', variableSymbol: 'T', min: 50, max: 1000, step: 10, defaultValue: 300, unit: 'K', category: 'initial_conditions' },
      { id: 'moles', label: 'Moles of Gas', variableSymbol: 'n', min: 0.1, max: 10, step: 0.1, defaultValue: 2.0, unit: 'mol', category: 'initial_conditions' }
    ],
    equations: [], guidedSteps: [], quiz: []
  },
  {
    id: 'photoelectric-effect',
    title: 'Photoelectric Effect',
    subtitle: 'Experiment with light frequency and intensity to eject electrons from metals.',
    topic: 'Modern Physics',
    subtopic: 'Dual Nature of Radiation',
    grade: [12],
    boards: ['CBSE', 'ISC'],
    difficulty: 'Advanced',
    isInteractive: true,
    learningObjectives: ['Understand threshold frequency and stopping potential'],
    prerequisites: ['Energy levels', 'Waves'],
    realWorldApps: [
      { title: 'Solar panels', description: 'Converting light to electricity' }
    ],
    parameters: [
      { id: 'wavelength', label: 'Wavelength', variableSymbol: 'λ', min: 100, max: 800, step: 10, defaultValue: 280, unit: 'nm', category: 'initial_conditions' },
      { id: 'intensity', label: 'Light Intensity', variableSymbol: 'I', min: 10, max: 200, step: 10, defaultValue: 70, unit: '%', category: 'initial_conditions' },
      { id: 'workFunction', label: 'Work Function', variableSymbol: 'Φ', min: 1.5, max: 6.0, step: 0.1, defaultValue: 2.3, unit: 'eV', category: 'environment' },
      { id: 'stoppingVoltage', label: 'Stopping Voltage', variableSymbol: 'V_s', min: -10, max: 0, step: 0.1, defaultValue: -0.8, unit: 'V', category: 'environment' }
    ],
    equations: [], guidedSteps: [], quiz: []
  },
  {
    id: 'alpha-radiation',
    title: 'Alpha Radiation Decay',
    subtitle: 'Simulate heavy alpha particles being stopped by paper.',
    topic: 'Nuclear Physics',
    subtopic: 'Radioactivity',
    grade: [12],
    boards: ['CBSE', 'ICSE', 'ISC'],
    difficulty: 'Intermediate',
    isInteractive: true,
    learningObjectives: ['Understand alpha decay and penetrating power'],
    prerequisites: ['Atomic Structure'],
    realWorldApps: [
      { title: 'Smoke Detectors', description: 'Americium-241 alpha source' }
    ],
    parameters: [
      { id: 'energy', label: 'Particle Energy', variableSymbol: 'E', min: 1, max: 10, step: 0.5, defaultValue: 5.5, unit: 'MeV', category: 'initial_conditions' },
      { id: 'shield', label: 'Shielding', variableSymbol: 'S', min: 0, max: 2, step: 1, defaultValue: 0, unit: '', category: 'environment', options: [{ value: 0, label: 'None' }, { value: 1, label: 'Paper' }, { value: 2, label: 'Aluminum' }] }
    ],
    equations: [], guidedSteps: [], quiz: []
  },
  {
    id: 'beta-radiation',
    title: 'Beta Radiation Decay',
    subtitle: 'Simulate high-speed electrons passing through paper but stopped by aluminum.',
    topic: 'Nuclear Physics',
    subtopic: 'Radioactivity',
    grade: [12],
    boards: ['CBSE', 'ICSE', 'ISC'],
    difficulty: 'Intermediate',
    isInteractive: true,
    learningObjectives: ['Understand beta decay and its penetration'],
    prerequisites: ['Atomic Structure'],
    realWorldApps: [
      { title: 'Medical Tracers', description: 'Using beta emitters in medicine' }
    ],
    parameters: [
      { id: 'energy', label: 'Particle Energy', variableSymbol: 'E', min: 0.1, max: 5, step: 0.1, defaultValue: 1.5, unit: 'MeV', category: 'initial_conditions' },
      { id: 'shield', label: 'Shielding', variableSymbol: 'S', min: 0, max: 2, step: 1, defaultValue: 1, unit: '', category: 'environment', options: [{ value: 0, label: 'None' }, { value: 1, label: 'Paper' }, { value: 2, label: 'Aluminum' }] }
    ],
    equations: [], guidedSteps: [], quiz: []
  },
  {
    id: 'gamma-radiation',
    title: 'Gamma Radiation',
    subtitle: 'Simulate high-energy photons being attenuated by thick lead.',
    topic: 'Nuclear Physics',
    subtopic: 'Radioactivity',
    grade: [12],
    boards: ['CBSE', 'ICSE', 'ISC'],
    difficulty: 'Advanced',
    isInteractive: true,
    learningObjectives: ['Understand gamma rays and lead shielding'],
    prerequisites: ['Photons', 'Electromagnetic Spectrum'],
    realWorldApps: [
      { title: 'Cancer Radiotherapy', description: 'Using gamma rays to destroy tumors' }
    ],
    parameters: [
      { id: 'energy', label: 'Photon Energy', variableSymbol: 'E', min: 1, max: 20, step: 1, defaultValue: 10, unit: 'MeV', category: 'initial_conditions' },
      { id: 'leadThickness', label: 'Lead Thickness', variableSymbol: 'x', min: 0, max: 20, step: 1, defaultValue: 5, unit: 'cm', category: 'environment' }
    ],
    equations: [], guidedSteps: [], quiz: []
  }
];
