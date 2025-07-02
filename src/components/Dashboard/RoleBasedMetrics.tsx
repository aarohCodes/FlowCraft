import React from 'react';
import { motion } from 'framer-motion';
import { 
  Clock, 
  CheckCircle, 
  TrendingUp, 
  Target,
  BookOpen,
  Award,
  Users,
  Calendar,
  Zap,
  BarChart3
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { Typography } from '../UI/Typography';
import { IconWrapper } from '../UI/IconWrapper';
import { AnimatedCard } from '../UI/AnimatedCard';

export const RoleBasedMetrics: React.FC = () => {
  const { state } = useApp();

  const professionalMetrics = [
    {
      id: 'time-saved',
      title: 'Time Saved',
      value: '12.5 hrs',
      change: { value: 15, type: 'increase' as const },
      icon: Clock,
      color: 'text-blue-500',
      description: 'This week'
    },
    {
      id: 'tasks-automated',
      title: 'Tasks Automated',
      value: '47',
      change: { value: 23, type: 'increase' as const },
      icon: Zap,
      color: 'text-purple-500',
      description: 'AI-generated'
    },
    {
      id: 'meetings-processed',
      title: 'Meetings',
      value: '18',
      change: { value: 8, type: 'increase' as const },
      icon: Users,
      color: 'text-green-500',
      description: 'Processed'
    },
    {
      id: 'productivity-score',
      title: 'Productivity',
      value: '94%',
      change: { value: 12, type: 'increase' as const },
      icon: TrendingUp,
      color: 'text-orange-500',
      description: 'Score'
    }
  ];

  const studentMetrics = [
    {
      id: 'study-streak',
      title: 'Study Streak',
      value: '7 days',
      change: { value: 0, type: 'increase' as const },
      icon: Target,
      color: 'text-green-500',
      description: 'Consecutive'
    },
    {
      id: 'flashcards-mastered',
      title: 'Cards Mastered',
      value: '156',
      change: { value: 28, type: 'increase' as const },
      icon: BookOpen,
      color: 'text-blue-500',
      description: '90%+ accuracy'
    },
    {
      id: 'quiz-accuracy',
      title: 'Quiz Accuracy',
      value: '87%',
      change: { value: 5, type: 'increase' as const },
      icon: Award,
      color: 'text-purple-500',
      description: 'Average'
    },
    {
      id: 'learning-hours',
      title: 'Learning Hours',
      value: '24.5 hrs',
      change: { value: 18, type: 'increase' as const },
      icon: Clock,
      color: 'text-orange-500',
      description: 'This week'
    }
  ];

  const metrics = state.userRole === 'professional' ? professionalMetrics : studentMetrics;

  return (
    <AnimatedCard variant="glass" className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Typography variant="h5" weight="bold" className="mb-2">
            {state.userRole === 'professional' ? 'Productivity' : 'Learning Progress'}
          </Typography>
          <Typography variant="body2" className="text-gray-600 dark:text-gray-400">
            Key metrics and insights
          </Typography>
        </div>
        <div className="flex items-center space-x-2">
          <IconWrapper
            icon={BarChart3}
            size={16}
            color="text-primary-500"
            hover
            className="p-2 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-all duration-200"
          />
          <Typography variant="caption" className="text-gray-600 dark:text-gray-400">
            Week
          </Typography>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={metric.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                delay: index * 0.1,
                type: "spring",
                stiffness: 200,
                damping: 15
              }}
              whileHover={{ 
                y: -2,
                boxShadow: '0 4px 20px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                transition: { duration: 0.2 }
              }}
              className="p-5 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:shadow-medium transition-all duration-300 border border-gray-200/50 dark:border-gray-600/50"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-600 flex items-center justify-center`}>
                    <motion.div
                      whileHover={{ rotate: 15 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Icon size={18} className={metric.color} />
                    </motion.div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <Typography variant="caption" weight="medium" className="text-gray-600 dark:text-gray-400 mb-1">
                      {metric.title}
                    </Typography>
                    <Typography variant="h5" weight="bold" className="text-gray-900 dark:text-white leading-none">
                      {metric.value}
                    </Typography>
                  </div>
                </div>
                {metric.change.value > 0 && (
                  <motion.div 
                    className="flex items-center space-x-1"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <TrendingUp size={14} className="text-green-500" />
                    <Typography variant="caption" weight="semibold" className="text-green-600 dark:text-green-400">
                      +{metric.change.value}%
                    </Typography>
                  </motion.div>
                )}
              </div>
              <Typography variant="caption" className="text-gray-500 dark:text-gray-400">
                {metric.description}
              </Typography>
            </motion.div>
          );
        })}
      </div>

      {/* Role-specific insights with enhanced typography */}
      <div className="mt-8 pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
          <Typography variant="body2" weight="semibold" className="text-gray-900 dark:text-white">
            {state.userRole === 'professional' ? 'Insights' : 'Study Tips'}
          </Typography>
        </div>
        <div className="space-y-3">
          {state.userRole === 'professional' ? (
            <>
              <div className="flex items-start space-x-3">
                <motion.div 
                  className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <Typography variant="body2" className="text-gray-600 dark:text-gray-400">
                  AI saved 2.5 hours on email drafting
                </Typography>
              </div>
              <div className="flex items-start space-x-3">
                <motion.div 
                  className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                />
                <Typography variant="body2" className="text-gray-600 dark:text-gray-400">
                  Meeting efficiency up 18%
                </Typography>
              </div>
              <div className="flex items-start space-x-3">
                <motion.div 
                  className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                />
                <Typography variant="body2" className="text-gray-600 dark:text-gray-400">
                  23% above team average completion
                </Typography>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-start space-x-3">
                <motion.div 
                  className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <Typography variant="body2" className="text-gray-600 dark:text-gray-400">
                  Retention improved 15% with spaced repetition
                </Typography>
              </div>
              <div className="flex items-start space-x-3">
                <motion.div 
                  className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                />
                <Typography variant="body2" className="text-gray-600 dark:text-gray-400">
                  Best performance in Software Architecture
                </Typography>
              </div>
              <div className="flex items-start space-x-3">
                <motion.div 
                  className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                />
                <Typography variant="body2" className="text-gray-600 dark:text-gray-400">
                  Most effective study time: 2-4 PM
                </Typography>
              </div>
            </>
          )}
        </div>
      </div>
    </AnimatedCard>
  );
};