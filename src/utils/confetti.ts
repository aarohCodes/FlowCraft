// Empty confetti utility - removed celebratory feedback
export interface ConfettiOptions {
  particleCount?: number;
  spread?: number;
  startVelocity?: number;
  decay?: number;
  gravity?: number;
  drift?: number;
  ticks?: number;
  origin?: { x: number; y: number };
  colors?: string[];
  shapes?: ('square' | 'circle')[];
  scalar?: number;
}

// Stub implementation that doesn't actually show confetti
export const confetti = {
  fire: () => {},
  stop: () => {}
};

// Preset confetti effects (all disabled)
export const confettiPresets = {
  taskComplete: () => {},
  achievement: () => {},
  milestone: () => {},
  celebration: () => {}
};