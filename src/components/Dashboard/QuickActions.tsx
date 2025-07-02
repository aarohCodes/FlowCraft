import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  HelpCircle, 
  Mail, 
  BookOpen,
  Clock,
  Zap,
  Crown,
  Calendar,
  CheckSquare,
  BarChart3,
  Search,
  Users,
  ChevronDown,
  ChevronUp,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { PaywallModal } from '../Paywall/PaywallModal';
import { AnimatedButton } from '../UI/AnimatedButton';
import { AnimatedCard } from '../UI/AnimatedCard';
import { IconWrapper } from '../UI/IconWrapper';
import { Typography } from '../UI/Typography';
import { useCelebration } from '../../hooks/useCelebration';

interface QuickAction {
  id: string;
  label: string;
  icon: React.ElementType;
  gradient: string;
  hoverGradient: string;
  action: () => void;
  isPremium?: boolean;
  roles: ('professional' | 'student')[];
  priority: 'primary' | 'secondary';
  description: string;
}

interface QuickActionsProps {
  onStartTimer?: () => void;
  onAddTask?: () => void;
  onCreateFlashcard?: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ onStartTimer, onAddTask, onCreateFlashcard }) => {
  const { state, dispatch } = useApp();
  const { celebrate } = useCelebration();
  const [paywallOpen, setPaywallOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState('');
  const [showMoreTools, setShowMoreTools] = useState(false);
  const [hoveredAction, setHoveredAction] = useState<string | null>(null);

  const showPaywall = (featureName: string) => {
    setSelectedFeature(featureName);
    setPaywallOpen(true);
  };

  const isFeatureUnlocked = (featureName: string) => {
    return state.isPremiumUser || state.unlockedFeatures.includes(featureName);
  };

  const handleActionClick = (action: QuickAction) => {
    // Add micro-interaction feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
    
    action.action();
    
    // Celebrate certain actions
    if (action.id === 'add-task' || action.id === 'create-flashcard') {
      setTimeout(() => celebrate('taskComplete'), 100);
    }
  };

  const allQuickActions: QuickAction[] = [
    // Primary Actions (Always visible)
    {
      id: 'add-task',
      label: 'Add Task',
      icon: Plus,
      gradient: 'from-blue-500 via-blue-600 to-indigo-600',
      hoverGradient: 'from-blue-600 via-blue-700 to-indigo-700',
      roles: ['professional', 'student'],
      priority: 'primary',
      description: 'Create tasks',
      action: () => {
        if (onAddTask) {
          onAddTask();
        }
      },
    },
    {
      id: 'start-timer',
      label: 'Focus Timer',
      icon: Clock,
      gradient: 'from-rose-500 via-pink-600 to-rose-600',
      hoverGradient: 'from-rose-600 via-pink-700 to-rose-700',
      roles: ['professional', 'student'],
      priority: 'primary',
      description: 'Start focus session',
      action: () => {
        if (onStartTimer) {
          onStartTimer();
        }
      },
    },
    {
      id: 'schedule-meeting',
      label: 'Schedule Meeting',
      icon: Calendar,
      gradient: 'from-indigo-500 via-purple-600 to-indigo-600',
      hoverGradient: 'from-indigo-600 via-purple-700 to-indigo-700',
      roles: ['professional'],
      priority: 'primary',
      description: 'Plan meetings',
      action: () => {
        console.log('Navigate to meeting scheduler');
      },
    },
    {
      id: 'email-assistant',
      label: 'Email Assistant',
      icon: Mail,
      gradient: 'from-violet-500 via-purple-600 to-violet-600',
      hoverGradient: 'from-violet-600 via-purple-700 to-violet-700',
      isPremium: true,
      roles: ['professional'],
      priority: 'primary',
      description: 'AI email generation',
      action: () => {
        if (isFeatureUnlocked('Email Management')) {
          const event = new CustomEvent('navigate-to-email');
          window.dispatchEvent(event);
        } else {
          showPaywall('Email Management');
        }
      },
    },
    {
      id: 'create-flashcard',
      label: 'Create Flashcard',
      icon: BookOpen,
      gradient: 'from-amber-500 via-orange-600 to-amber-600',
      hoverGradient: 'from-amber-600 via-orange-700 to-amber-700',
      roles: ['student'],
      priority: 'primary',
      description: 'Build study materials',
      action: () => {
        if (onCreateFlashcard) {
          onCreateFlashcard();
        }
      },
    },
    {
      id: 'quiz-generator',
      label: 'Quiz Generator',
      icon: HelpCircle,
      gradient: 'from-emerald-500 via-green-600 to-emerald-600',
      hoverGradient: 'from-emerald-600 via-green-700 to-emerald-700',
      isPremium: true,
      roles: ['student'],
      priority: 'primary',
      description: 'Generate quizzes',
      action: () => {
        if (isFeatureUnlocked('Quiz Generator')) {
          const event = new CustomEvent('navigate-to-education');
          window.dispatchEvent(event);
        } else {
          showPaywall('Quiz Generator');
        }
      },
    },

    // Secondary Actions (Behind "More Tools")
    {
      id: 'productivity-analytics',
      label: 'Analytics',
      icon: BarChart3,
      gradient: 'from-teal-500 via-cyan-600 to-teal-600',
      hoverGradient: 'from-teal-600 via-cyan-700 to-teal-700',
      roles: ['professional'],
      priority: 'secondary',
      description: 'Track metrics',
      action: () => {
        console.log('Navigate to analytics');
      },
    },
    {
      id: 'task-manager',
      label: 'Task Manager',
      icon: CheckSquare,
      gradient: 'from-cyan-500 via-blue-600 to-cyan-600',
      hoverGradient: 'from-cyan-600 via-blue-700 to-cyan-700',
      roles: ['professional'],
      priority: 'secondary',
      description: 'Advanced tasks',
      action: () => {
        console.log('Navigate to task manager');
      },
    },
    {
      id: 'research-assistant',
      label: 'Research Assistant',
      icon: Search,
      gradient: 'from-sky-500 via-blue-600 to-sky-600',
      hoverGradient: 'from-sky-600 via-blue-700 to-sky-700',
      roles: ['student'],
      priority: 'secondary',
      description: 'AI research help',
      action: () => {
        // Track tool usage
        dispatch({ 
          type: 'TRACK_TOOL_USAGE', 
          payload: { 
            toolId: 'research-assistant', 
            success: Math.random() > 0.15 // 85% success rate
          } 
        });
        console.log('Navigate to research assistant');
      },
    },
    {
      id: 'study-analytics',
      label: 'Study Analytics',
      icon: BarChart3,
      gradient: 'from-pink-500 via-rose-600 to-pink-600',
      hoverGradient: 'from-pink-600 via-rose-700 to-pink-700',
      roles: ['student'],
      priority: 'secondary',
      description: 'Track learning',
      action: () => {
        // Track tool usage
        dispatch({ 
          type: 'TRACK_TOOL_USAGE', 
          payload: { 
            toolId: 'quiz-generator', 
            success: Math.random() > 0.1 // 90% success rate
          } 
        });
        console.log('Navigate to study analytics');
      },
    },
    {
      id: 'group-meeting',
      label: 'Group Meeting',
      icon: Users,
      gradient: 'from-violet-500 via-indigo-600 to-violet-600',
      hoverGradient: 'from-violet-600 via-indigo-700 to-violet-700',
      roles: ['student'],
      priority: 'secondary',
      description: 'Study groups',
      action: () => {
        // Track tool usage
        dispatch({ 
          type: 'TRACK_TOOL_USAGE', 
          payload: { 
            toolId: 'meeting-scheduler', 
            success: Math.random() > 0.05 // 95% success rate
          } 
        });
        console.log('Navigate to group meeting tools');
      },
    },
    {
      id: 'ai-assist',
      label: 'AI Assist',
      icon: Zap,
      gradient: 'from-purple-500 via-indigo-600 to-purple-600',
      hoverGradient: 'from-purple-600 via-indigo-700 to-purple-700',
      isPremium: true,
      roles: ['professional', 'student'],
      priority: 'secondary',
      description: 'Advanced AI',
      action: () => {
        if (isFeatureUnlocked('AI Assistant')) {
          // Track tool usage
          dispatch({ 
            type: 'TRACK_TOOL_USAGE', 
            payload: { 
              toolId: 'email-assistant', 
              success: Math.random() > 0.12 // 88% success rate
            } 
          });
          const event = new CustomEvent('navigate-to-tools');
          window.dispatchEvent(event);
        } else {
          showPaywall('AI Assistant');
        }
      },
    },
  ];

  // Filter actions based on current user role
  const roleActions = allQuickActions.filter(action => 
    action.roles.includes(state.userRole)
  );

  // Separate primary and secondary actions
  const primaryActions = roleActions.filter(action => action.priority === 'primary').slice(0, 4);
  const secondaryActions = roleActions.filter(action => action.priority === 'secondary');

  // Count premium badges to show only on most important features
  const premiumCount = primaryActions.filter(action => action.isPremium && !isFeatureUnlocked(action.label)).length;

  const renderActionButton = (action: QuickAction, index: number, isSecondary = false) => {
    const IconComponent = action.icon;
    const isUnlocked = !action.isPremium || isFeatureUnlocked(action.isPremium ? action.label : '');
    const showPremiumBadge = action.isPremium && !isUnlocked && premiumCount <= 2;
    const isHovered = hoveredAction === action.id;
    
    return (
      <motion.button
        key={action.id}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ 
          delay: index * 0.1,
          type: "spring",
          stiffness: 200,
          damping: 15
        }}
        whileHover={{ 
          scale: 1.05,
          y: -2,
          transition: { duration: 0.2, type: "spring", stiffness: 300 }
        }}
        whileTap={{ 
          scale: 0.95,
          transition: { duration: 0.1 }
        }}
        onHoverStart={() => setHoveredAction(action.id)}
        onHoverEnd={() => setHoveredAction(null)}
        onClick={() => handleActionClick(action)}
        className={`
          relative group overflow-hidden rounded-2xl p-4 flex flex-col items-center justify-center
          shadow-soft hover:shadow-large transition-all duration-300 w-full
          ${isSecondary ? 'h-20 min-h-[5rem]' : 'h-28 min-h-[7rem]'}
          ${!isUnlocked ? 'opacity-90' : ''}
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        `}
        style={{
          background: `linear-gradient(135deg, var(--tw-gradient-stops))`,
        }}
      >
        {/* Enhanced Gradient Background with Animation */}
        <motion.div 
          className={`absolute inset-0 bg-gradient-to-br ${isHovered ? action.hoverGradient : action.gradient}`}
          animate={{
            scale: isHovered ? 1.1 : 1,
            opacity: isHovered ? 0.9 : 1
          }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Animated Shimmer Effect */}
        <motion.div 
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          animate={{
            background: isHovered 
              ? 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%)'
              : 'transparent'
          }}
        >
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12"
            animate={{
              x: isHovered ? ['0%', '100%'] : '0%'
            }}
            transition={{
              duration: 0.8,
              ease: "easeInOut"
            }}
          />
        </motion.div>

        {/* Premium Badge with Animation */}
        {showPremiumBadge && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              delay: 0.3,
              type: "spring",
              stiffness: 200,
              damping: 10
            }}
            className="absolute -top-2 -right-2 w-5 h-5 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full flex items-center justify-center shadow-large z-10"
          >
            <Crown size={10} className="text-white" />
          </motion.div>
        )}

        {/* Unlocked Badge with Celebration */}
        {action.isPremium && isUnlocked && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring",
              stiffness: 300,
              damping: 15
            }}
            className="absolute -top-2 -right-2 w-5 h-5 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full flex items-center justify-center shadow-large z-10"
          >
            <Sparkles size={10} className="text-white" />
          </motion.div>
        )}

        {/* Content with Enhanced Animations */}
        <div className="relative z-10 flex flex-col items-center text-white text-center">
          <motion.div
            animate={{ 
              rotate: isHovered ? [0, -10, 10, 0] : 0,
              scale: isHovered ? 1.15 : 1
            }}
            transition={{ 
              duration: 0.4,
              type: "spring",
              stiffness: 200
            }}
            className="mb-2"
          >
            <IconComponent size={isSecondary ? 18 : 24} />
          </motion.div>
          
          <motion.span 
            className={`${isSecondary ? 'text-xs' : 'text-sm'} font-bold leading-tight mb-1 px-1`}
            animate={{
              y: isHovered ? -1 : 0
            }}
            transition={{ duration: 0.2 }}
          >
            {action.label}
          </motion.span>
          
          <motion.span 
            className="text-xs opacity-90 leading-tight px-1"
            animate={{
              opacity: isHovered ? 1 : 0.9
            }}
          >
            {action.description}
          </motion.span>
          
          {showPremiumBadge && (
            <motion.span 
              className="text-xs opacity-90 font-semibold mt-1 bg-white/20 px-2 py-0.5 rounded-full backdrop-blur-sm"
              animate={{
                scale: isHovered ? 1.05 : 1
              }}
            >
              Premium
            </motion.span>
          )}
        </div>

        {/* Enhanced Floating Particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/40 rounded-full"
              style={{
                left: `${25 + i * 25}%`,
                top: `${35 + i * 15}%`,
              }}
              animate={{
                y: isHovered ? [-10, -25, -10] : [-5, -15, -5],
                opacity: isHovered ? [0.4, 0.8, 0.4] : [0.2, 0.5, 0.2],
                scale: isHovered ? [1, 1.5, 1] : [1, 1.2, 1]
              }}
              transition={{
                duration: 2 + i * 0.5,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>

        {/* Focus Ring */}
        <motion.div
          className="absolute inset-0 rounded-2xl border-2 border-white/50 opacity-0 pointer-events-none"
          animate={{
            opacity: isHovered ? 1 : 0,
            scale: isHovered ? 1.02 : 1
          }}
          transition={{ duration: 0.2 }}
        />
      </motion.button>
    );
  };

  return (
    <>
      <AnimatedCard variant="glass" className="p-6 w-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Typography variant="h6" weight="bold" className="mb-1">
              Quick Actions
            </Typography>
            <Typography variant="caption" className="text-gray-600 dark:text-gray-400">
              {state.userRole === 'professional' 
                ? 'Streamline your workflow' 
                : 'Enhance your learning'
              }
            </Typography>
          </div>
          <div className="flex items-center space-x-2">
            <motion.span 
              className={`px-2 py-1 rounded-full text-xs font-bold ${
                state.userRole === 'professional' 
                  ? 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 dark:from-blue-900/30 dark:to-indigo-900/30 dark:text-blue-400'
                  : 'bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 dark:from-emerald-900/30 dark:to-green-900/30 dark:text-emerald-400'
              }`}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {state.userRole === 'professional' ? 'Pro Mode' : 'Student Mode'}
            </motion.span>
          </div>
        </div>

        {/* Primary Actions - Enhanced Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {primaryActions.map((action, index) => renderActionButton(action, index))}
        </div>

        {/* More Tools Toggle with Enhanced Animation */}
        {secondaryActions.length > 0 && (
          <div className="border-t border-gray-200/50 dark:border-gray-700/50 pt-4">
            <AnimatedButton
              variant="ghost"
              fullWidth
              onClick={() => setShowMoreTools(!showMoreTools)}
              icon={
                <motion.div
                  animate={{ rotate: showMoreTools ? 180 : 0 }}
                  transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
                >
                  <ChevronDown size={14} />
                </motion.div>
              }
              iconPosition="right"
              className="py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 border border-gray-200/50 dark:border-gray-600/50"
            >
              <Typography variant="caption" weight="semibold">
                {showMoreTools ? 'Hide Advanced Tools' : 'Show Advanced Tools'}
              </Typography>
            </AnimatedButton>

            {/* Secondary Actions with Staggered Animation */}
            <AnimatePresence>
              {showMoreTools && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ 
                    duration: 0.5, 
                    ease: "easeInOut",
                    staggerChildren: 0.1
                  }}
                  className="mt-4"
                >
                  <div className="grid grid-cols-2 gap-3">
                    {secondaryActions.slice(0, 4).map((action, index) => (
                      <motion.div
                        key={action.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ 
                          delay: index * 0.1,
                          type: "spring",
                          stiffness: 200,
                          damping: 15
                        }}
                      >
                        {renderActionButton(action, index, true)}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </AnimatedCard>

      <PaywallModal
        isOpen={paywallOpen}
        onClose={() => setPaywallOpen(false)}
        feature={selectedFeature}
      />
    </>
  );
};