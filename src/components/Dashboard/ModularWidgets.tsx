import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  X, 
  Search, 
  Settings, 
  Grid3X3,
  Clock,
  CheckSquare,
  BarChart3,
  BookOpen,
  Mail,
  Users,
  Calendar,
  Target,
  Zap,
  Award,
  TrendingUp,
  MessageCircle,
  FileText,
  Sparkles,
  CheckCircle
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { AnimatedCard } from '../UI/AnimatedCard';
import { AnimatedButton } from '../UI/AnimatedButton';
import { IconWrapper } from '../UI/IconWrapper';
import { Typography } from '../UI/Typography';
import { useCelebration } from '../../hooks/useCelebration';

interface Widget {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  category: 'productivity' | 'learning' | 'analytics' | 'communication';
  size: 'small' | 'medium' | 'large';
  isPremium?: boolean;
  roles: ('professional' | 'student')[];
  component: React.ComponentType<any>;
}

interface ModularWidgetsProps {
  onStartTimer?: () => void;
  onAddTask?: () => void;
  onCreateFlashcard?: () => void;
}

// Widget Components
const TimerWidget: React.FC<{ onStartTimer?: () => void }> = ({ onStartTimer }) => (
  <div className="p-4 bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 rounded-xl border border-rose-200/50 dark:border-rose-800/50 h-full">
    <div className="flex items-center justify-between mb-3">
      <IconWrapper icon={Clock} size={16} color="text-rose-500" />
      <Typography variant="caption" weight="semibold" className="text-rose-600 dark:text-rose-400">
        Timer
      </Typography>
    </div>
    <Typography variant="caption" className="text-gray-600 dark:text-gray-400 mb-3">
      Start focused work
    </Typography>
    <AnimatedButton
      variant="danger"
      gradient
      size="sm"
      fullWidth
      onClick={onStartTimer}
      icon={<Clock size={12} />}
    >
      Start Timer
    </AnimatedButton>
  </div>
);

const TaskWidget: React.FC<{ onAddTask?: () => void }> = ({ onAddTask }) => {
  const { state } = useApp();
  const completedTasks = state.tasks.filter(task => task.completed).length;
  const totalTasks = state.tasks.length;
  
  return (
    <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200/50 dark:border-blue-800/50 h-full">
      <div className="flex items-center justify-between mb-3">
        <IconWrapper icon={CheckSquare} size={16} color="text-blue-500" />
        <Typography variant="caption" weight="semibold" className="text-blue-600 dark:text-blue-400">
          Tasks
        </Typography>
      </div>
      <div className="mb-3">
        <Typography variant="h6" weight="bold" className="text-gray-900 dark:text-white">
          {completedTasks}/{totalTasks}
        </Typography>
        <Typography variant="caption" className="text-gray-600 dark:text-gray-400">
          Completed
        </Typography>
      </div>
      <AnimatedButton
        variant="primary"
        gradient
        size="sm"
        fullWidth
        onClick={onAddTask}
        icon={<Plus size={12} />}
      >
        Add Task
      </AnimatedButton>
    </div>
  );
};

const AnalyticsWidget: React.FC = () => {
  const { state } = useApp();
  const metric = state.userRole === 'professional' ? '94%' : '87%';
  const label = state.userRole === 'professional' ? 'Productivity' : 'Accuracy';
  
  return (
    <div className="p-4 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-xl border border-emerald-200/50 dark:border-emerald-800/50 h-full">
      <div className="flex items-center justify-between mb-3">
        <IconWrapper icon={BarChart3} size={16} color="text-emerald-500" />
        <Typography variant="caption" weight="semibold" className="text-emerald-600 dark:text-emerald-400">
          {label}
        </Typography>
      </div>
      <div className="text-center mb-2">
        <Typography variant="h6" weight="bold" className="text-gray-900 dark:text-white">
          {metric}
        </Typography>
        <Typography variant="caption" className="text-gray-600 dark:text-gray-400">
          This week
        </Typography>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-2">
        <motion.div 
          className="bg-gradient-to-r from-emerald-500 to-green-600 h-1.5 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: metric }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};

const FlashcardWidget: React.FC<{ onCreateFlashcard?: () => void }> = ({ onCreateFlashcard }) => {
  const { state } = useApp();
  const flashcardCount = state.flashcards.length;
  
  return (
    <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl border border-amber-200/50 dark:border-amber-800/50 h-full">
      <div className="flex items-center justify-between mb-3">
        <IconWrapper icon={BookOpen} size={16} color="text-amber-500" />
        <Typography variant="caption" weight="semibold" className="text-amber-600 dark:text-amber-400">
          Cards
        </Typography>
      </div>
      <div className="mb-3">
        <Typography variant="h6" weight="bold" className="text-gray-900 dark:text-white">
          {flashcardCount}
        </Typography>
        <Typography variant="caption" className="text-gray-600 dark:text-gray-400">
          Ready to study
        </Typography>
      </div>
      <AnimatedButton
        variant="warning"
        gradient
        size="sm"
        fullWidth
        onClick={onCreateFlashcard}
        icon={<BookOpen size={12} />}
      >
        Create Card
      </AnimatedButton>
    </div>
  );
};

const EmailWidget: React.FC = () => (
  <div className="p-4 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-xl border border-purple-200/50 dark:border-purple-800/50 h-full">
    <div className="flex items-center justify-between mb-3">
      <IconWrapper icon={Mail} size={16} color="text-purple-500" />
      <Typography variant="caption" weight="semibold" className="text-purple-600 dark:text-purple-400">
        Email
      </Typography>
    </div>
    <div className="mb-3">
      <Typography variant="h6" weight="bold" className="text-gray-900 dark:text-white">
        3
      </Typography>
      <Typography variant="caption" className="text-gray-600 dark:text-gray-400">
        Pending
      </Typography>
    </div>
    <AnimatedButton
      variant="secondary"
      gradient
      size="sm"
      fullWidth
      icon={<Mail size={12} />}
    >
      Review
    </AnimatedButton>
  </div>
);

export const ModularWidgets: React.FC<ModularWidgetsProps> = ({ onStartTimer, onAddTask, onCreateFlashcard }) => {
  const { state } = useApp();
  const { celebrate } = useCelebration();
  const [showWidgetSelector, setShowWidgetSelector] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeWidgets, setActiveWidgets] = useState<string[]>(['timer', 'tasks', 'analytics']);

  const availableWidgets: Widget[] = [
    {
      id: 'timer',
      name: 'Focus Timer',
      description: 'Pomodoro timer for focused work sessions',
      icon: Clock,
      category: 'productivity',
      size: 'small',
      roles: ['professional', 'student'],
      component: TimerWidget
    },
    {
      id: 'tasks',
      name: 'Task Manager',
      description: 'Quick task overview and creation',
      icon: CheckSquare,
      category: 'productivity',
      size: 'small',
      roles: ['professional', 'student'],
      component: TaskWidget
    },
    {
      id: 'analytics',
      name: 'Analytics',
      description: 'Performance metrics and insights',
      icon: BarChart3,
      category: 'analytics',
      size: 'small',
      roles: ['professional', 'student'],
      component: AnalyticsWidget
    },
    {
      id: 'flashcards',
      name: 'Flashcards',
      description: 'Study card creation and review',
      icon: BookOpen,
      category: 'learning',
      size: 'small',
      roles: ['student'],
      component: FlashcardWidget
    },
    {
      id: 'email',
      name: 'Email Assistant',
      description: 'AI-powered email management',
      icon: Mail,
      category: 'communication',
      size: 'small',
      isPremium: true,
      roles: ['professional'],
      component: EmailWidget
    }
  ];

  const roleFilteredWidgets = availableWidgets.filter(widget => 
    widget.roles.includes(state.userRole)
  );

  const filteredWidgets = roleFilteredWidgets.filter(widget =>
    widget.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    widget.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addWidget = (widgetId: string) => {
    if (!activeWidgets.includes(widgetId)) {
      setActiveWidgets([...activeWidgets, widgetId]);
      
      // Celebrate adding a new widget
      setTimeout(() => {
        celebrate('taskComplete', 'Widget added to your dashboard!');
      }, 300);
    }
    setShowWidgetSelector(false);
  };

  const removeWidget = (widgetId: string) => {
    setActiveWidgets(activeWidgets.filter(id => id !== widgetId));
  };

  const renderWidget = (widgetId: string) => {
    const widget = availableWidgets.find(w => w.id === widgetId);
    if (!widget) return null;

    const WidgetComponent = widget.component;
    
    return (
      <motion.div
        key={widgetId}
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ 
          type: "spring",
          stiffness: 300,
          damping: 25
        }}
        className="relative group"
      >
        <WidgetComponent 
          onStartTimer={onStartTimer}
          onAddTask={onAddTask}
          onCreateFlashcard={onCreateFlashcard}
        />
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => removeWidget(widgetId)}
          className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-medium"
        >
          <X size={10} />
        </motion.button>
      </motion.div>
    );
  };

  return (
    <AnimatedCard variant="glass" className="p-6 w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Typography variant="h6" weight="bold" className="mb-1">
            Quick Widgets
          </Typography>
          <Typography variant="caption" className="text-gray-600 dark:text-gray-400">
            Customize your workspace
          </Typography>
        </div>
        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.05, rotate: 90 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400 }}
            onClick={() => setShowWidgetSelector(true)}
            className="p-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg hover:from-primary-600 hover:to-secondary-600 transition-all duration-200 shadow-medium"
            title="Add Widget"
          >
            <Plus size={14} />
          </motion.button>
          <Typography variant="caption" weight="semibold" className="text-gray-500 dark:text-gray-400">
            {activeWidgets.length}
          </Typography>
        </div>
      </div>

      {/* Active Widgets Grid with Layout Animation */}
      <motion.div 
        layout
        className="grid grid-cols-2 gap-3"
      >
        <AnimatePresence>
          {activeWidgets.map(widgetId => renderWidget(widgetId))}
        </AnimatePresence>
      </motion.div>

      {/* Widget Selector Modal with Enhanced Animations */}
      <AnimatePresence>
        {showWidgetSelector && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowWidgetSelector(false)}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ 
                type: "spring",
                stiffness: 300,
                damping: 25
              }}
              className="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <Typography variant="h5" weight="bold">
                    Add Widget
                  </Typography>
                  <motion.button
                    whileHover={{ rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowWidgetSelector(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <X size={20} />
                  </motion.button>
                </div>
                
                {/* Enhanced Search with Animations */}
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <motion.input
                    initial={{ boxShadow: "0 0 0 rgba(59, 130, 246, 0)" }}
                    whileFocus={{ boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.3)" }}
                    type="text"
                    placeholder="Search widgets..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>

              <div className="p-6 max-h-96 overflow-y-auto scrollbar-thin">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredWidgets.map((widget, index) => {
                    const Icon = widget.icon;
                    const isActive = activeWidgets.includes(widget.id);
                    const isUnlocked = !widget.isPremium || state.isPremiumUser || state.unlockedFeatures.includes('AI Tools');
                    
                    return (
                      <motion.button
                        key={widget.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ 
                          delay: index * 0.05,
                          type: "spring",
                          stiffness: 200,
                          damping: 15
                        }}
                        whileHover={!isActive && isUnlocked ? { 
                          scale: 1.02,
                          y: -2,
                          transition: { duration: 0.2 }
                        } : undefined}
                        whileTap={!isActive && isUnlocked ? { 
                          scale: 0.98,
                          transition: { duration: 0.1 }
                        } : undefined}
                        onClick={() => isUnlocked && !isActive ? addWidget(widget.id) : null}
                        disabled={isActive || !isUnlocked}
                        className={`p-4 rounded-xl border-2 text-left transition-all duration-300 ${
                          isActive
                            ? 'border-green-500 bg-green-50 dark:bg-green-900/20 opacity-80'
                            : !isUnlocked
                            ? 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 opacity-70'
                            : 'border-gray-200 dark:border-gray-700 hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20'
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            isActive ? 'bg-green-500' : 'bg-gray-100 dark:bg-gray-600'
                          }`}>
                            <motion.div
                              animate={isActive ? { rotate: 360 } : { rotate: 0 }}
                              transition={{ duration: 0.5, type: "spring" }}
                            >
                              <Icon size={20} className={isActive ? 'text-white' : 'text-gray-600 dark:text-gray-400'} />
                            </motion.div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <Typography variant="body2" weight="semibold" className="text-gray-900 dark:text-white">
                                {widget.name}
                              </Typography>
                              {widget.isPremium && (
                                <div className="flex items-center space-x-1">
                                  {isUnlocked ? (
                                    <motion.div
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      transition={{ type: "spring", stiffness: 300 }}
                                    >
                                      <Sparkles size={12} className="text-emerald-500" />
                                    </motion.div>
                                  ) : (
                                    <span className="px-2 py-0.5 bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400 rounded-full text-xs font-semibold">
                                      Premium
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                            <Typography variant="caption" className="text-gray-600 dark:text-gray-400 mb-2">
                              {widget.description}
                            </Typography>
                            {isActive && (
                              <div className="flex items-center space-x-2">
                                <CheckCircle size={12} className="text-green-500" />
                                <Typography variant="caption" weight="semibold" className="text-green-600 dark:text-green-400">
                                  Already added
                                </Typography>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AnimatedCard>
  );
};