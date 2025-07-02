import { useCallback } from 'react';
import toast from 'react-hot-toast';

export type CelebrationType = 'taskComplete' | 'achievement' | 'milestone' | 'celebration';

interface CelebrationMessages {
  [key: string]: {
    title: string;
    message: string;
    emoji: string;
  };
}

const celebrationMessages: CelebrationMessages = {
  taskComplete: {
    title: 'Task Completed!',
    message: 'Great job staying productive!',
    emoji: '✅'
  },
  achievement: {
    title: 'Achievement Unlocked!',
    message: 'You\'re making excellent progress!',
    emoji: '🏆'
  },
  milestone: {
    title: 'Milestone Reached!',
    message: 'You\'re crushing your goals!',
    emoji: '🎯'
  },
  celebration: {
    title: 'Congratulations!',
    message: 'You\'ve accomplished something amazing!',
    emoji: '🎉'
  }
};

export const useCelebration = () => {
  const celebrate = useCallback((type: CelebrationType, customMessage?: string) => {
    const celebration = celebrationMessages[type];
    
    // Show toast notification
    toast.success(
      customMessage || celebration.message,
      {
        icon: celebration.emoji,
        duration: 4000,
        style: {
          background: 'linear-gradient(135deg, #10b981, #34d399)',
          color: '#ffffff',
          border: 'none',
          borderRadius: '16px',
          padding: '16px 20px',
          fontSize: '16px',
          fontWeight: '600',
          boxShadow: '0 10px 25px -5px rgba(16, 185, 129, 0.3), 0 10px 10px -5px rgba(16, 185, 129, 0.1)',
        },
      }
    );
  }, []);

  return { celebrate };
};