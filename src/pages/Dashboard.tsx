import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  Zap,
  Calendar,
  MessageCircle,
  BookOpen,
  Target,
  Award,
  Activity,
  Briefcase,
  Plus,
  HelpCircle,
  FileText,
  Video,
  Flag,
  Edit3,
  GraduationCap,
  Sparkles,
  BarChart3,
  ArrowRight
} from 'lucide-react';
import { QuickActions } from '../components/Dashboard/QuickActions';
import { RecentCreations } from '../components/Dashboard/RecentCreations';
import { RoleSelector } from '../components/Dashboard/RoleSelector';
import { ModularWidgets } from '../components/Dashboard/ModularWidgets';
import { BouncingCircles } from '../components/Dashboard/BouncingCircles';
import { useApp } from '../contexts/AppContext';
import { formatDistanceToNow } from 'date-fns';

interface DashboardProps {
  onStartTimer?: () => void;
  onAddTask?: () => void;
  onCreateFlashcard?: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onStartTimer, onAddTask, onCreateFlashcard }) => {
  const { state, dispatch } = useApp();

  const completedTasks = state.tasks.filter(task => task.completed).length;
  const totalTasks = state.tasks.length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const activeTools = state.tools.filter(tool => tool.isActive).length;
  const upcomingMeetings = state.meetings.filter(meeting => meeting.status === 'scheduled').length;

  // Get today's tasks (due today or overdue)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todaysTasks = state.tasks.filter(task => {
    if (!task.dueDate) return false;
    const taskDate = new Date(task.dueDate);
    taskDate.setHours(0, 0, 0, 0);
    return taskDate <= tomorrow; // Include today and overdue tasks
  }).sort((a, b) => {
    if (!a.dueDate || !b.dueDate) return 0;
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  // Get today's meetings from state
  const todaysMeetings = state.meetings.filter(meeting => {
    const meetingDate = new Date(meeting.date);
    meetingDate.setHours(0, 0, 0, 0);
    return meetingDate.getTime() === today.getTime();
  }).map(meeting => ({
    id: meeting.id,
    time: new Date(meeting.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    title: meeting.title,
    type: 'meeting' as const,
    platform: 'zoom' as const, // Default platform
    duration: meeting.duration,
    status: meeting.status,
    isAutomated: false
  }));

  // Combine and sort today's schedule
  const todaysSchedule = [
    ...todaysMeetings.map(meeting => ({
      ...meeting,
      sortTime: new Date(`${new Date().toDateString()} ${meeting.time}`).getTime()
    })),
    ...todaysTasks.map(task => ({
      id: task.id,
      time: task.dueDate ? new Date(task.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'All day',
      title: task.title,
      type: 'task' as const,
      priority: task.priority,
      completed: task.completed,
      category: task.category,
      description: task.description,
      isAutomated: false,
      sortTime: task.dueDate ? new Date(task.dueDate).getTime() : new Date().getTime()
    }))
  ].sort((a, b) => a.sortTime - b.sortTime);

  const toggleTask = (taskId: string) => {
    dispatch({ type: 'TOGGLE_TASK', payload: taskId });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-rose-500';
      case 'medium': return 'bg-amber-500';
      case 'low': return 'bg-emerald-500';
      default: return 'bg-neutral-500';
    }
  };

  // Role-based welcome message and icon
  const roleConfig = {
    professional: {
      icon: Briefcase,
      title: 'Welcome back, Professional!',
      subtitle: 'Your AI-powered productivity hub is ready to streamline your workflow.',
      gradient: 'from-blue-500 via-indigo-600 to-purple-600',
      particles: ['💼', '📊', '⚡']
    },
    student: {
      icon: GraduationCap,
      title: 'Ready to learn, Scholar!',
      subtitle: 'Your AI-powered learning companion is here to enhance your studies.',
      gradient: 'from-emerald-500 via-green-600 to-teal-600',
      particles: ['📚', '🎓', '✨']
    }
  };

  const currentRole = roleConfig[state.userRole];

  return (
    <div className="space-y-10 min-h-screen">
      {/* Welcome Section with Enhanced Visual Appeal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative bg-gradient-to-br ${currentRole.gradient} rounded-3xl p-10 text-white overflow-hidden shadow-large w-full`}
      >
        {/* Enhanced Background Effects */}
        <BouncingCircles />
        
        {/* Floating Particles */}
        <div className="absolute inset-0 pointer-events-none">
          {currentRole.particles.map((particle, index) => (
            <motion.div
              key={index}
              className="absolute text-2xl"
              style={{
                left: `${20 + index * 25}%`,
                top: `${30 + index * 15}%`,
              }}
              animate={{
                y: [-20, -40, -20],
                rotate: [0, 10, -10, 0],
                opacity: [0.4, 0.8, 0.4],
              }}
              transition={{
                duration: 4 + index,
                repeat: Infinity,
                delay: index * 0.5,
              }}
            >
              {particle}
            </motion.div>
          ))}
        </div>
        
        {/* Content */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex-1">
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl font-bold mb-4"
            >
              {currentRole.title} 👋
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="text-white/90 text-xl leading-relaxed"
            >
              {currentRole.subtitle}
            </motion.p>
          </div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="hidden md:block"
          >
            <div className="w-32 h-32 bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur-sm shadow-soft">
              <currentRole.icon size={64} className="text-white" />
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Main Content Grid - Fixed Layout to Prevent Overlap */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        {/* Left Column - Primary Focus Area (Takes up more space) */}
        <div className="xl:col-span-8 space-y-10">
          {/* Today's Schedule - Enhanced Visual Hierarchy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-3xl p-8 border border-gray-200/50 dark:border-gray-700/50 shadow-soft w-full"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {state.userRole === 'professional' ? "Today's Schedule" : "Today's Study Plan"}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {state.userRole === 'professional' 
                    ? 'Your meetings and priority tasks for today' 
                    : 'Your study sessions and assignments for today'
                  }
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onAddTask}
                  className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-medium"
                  title="Add Task"
                >
                  <Plus size={20} />
                </motion.button>
                <div className="text-right">
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    {todaysSchedule.length}
                  </span>
                  <p className="text-sm text-gray-500 dark:text-gray-400">items</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              {todaysSchedule.length > 0 ? (
                todaysSchedule.slice(0, 5).map((item, index) => (
                  <motion.div
                    key={`${item.type}-${item.id}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex items-center space-x-6 p-6 rounded-2xl transition-all duration-200 hover:shadow-medium ${
                      item.type === 'task' && item.completed
                        ? 'bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/10 dark:to-green-900/10 border border-emerald-200 dark:border-emerald-800'
                        : 'bg-gradient-to-r from-gray-50 to-neutral-50 dark:from-gray-700/50 dark:to-neutral-700/50 border border-gray-200 dark:border-gray-600'
                    }`}
                  >
                    {/* Time */}
                    <div className="text-base font-semibold text-gray-700 dark:text-gray-300 w-24 flex-shrink-0">
                      {item.time}
                    </div>

                    {/* Type Indicator */}
                    <div className="flex-shrink-0">
                      {item.type === 'meeting' ? (
                        <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full shadow-soft"></div>
                      ) : (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => toggleTask(item.id)}
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                            item.completed
                              ? 'bg-gradient-to-r from-emerald-500 to-green-600 border-emerald-500 text-white shadow-soft'
                              : 'border-gray-300 dark:border-gray-600 hover:border-emerald-500 hover:shadow-glow'
                          }`}
                        >
                          {item.completed && <CheckCircle size={14} />}
                        </motion.button>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-1">
                            <p className={`text-base font-semibold ${
                              item.type === 'task' && item.completed
                                ? 'line-through text-gray-500 dark:text-gray-400'
                                : 'text-gray-900 dark:text-white'
                            }`}>
                              {item.title}
                            </p>
                            
                            {/* Automation Indicator */}
                            {item.isAutomated && (
                              <div className="flex items-center space-x-1 px-2 py-1 bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-full">
                                <Zap size={12} className="text-purple-600 dark:text-purple-400" />
                                <span className="text-xs font-medium text-purple-700 dark:text-purple-400">
                                  AI Generated
                                </span>
                              </div>
                            )}
                          </div>
                          
                          {/* Additional Info */}
                          <div className="flex items-center space-x-4 mt-2">
                            {item.type === 'meeting' ? (
                              <>
                                <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                                  {item.platform?.replace('-', ' ')} • {item.duration} min
                                </span>
                                <Video size={14} className="text-blue-500" />
                              </>
                            ) : (
                              <>
                                {item.priority && (
                                  <div className="flex items-center space-x-2">
                                    <div className={`w-3 h-3 rounded-full ${getPriorityColor(item.priority)}`}></div>
                                    <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                                      {item.priority} priority
                                    </span>
                                  </div>
                                )}
                                {item.category && (
                                  <span className="text-sm text-gray-600 dark:text-gray-400">
                                    {item.category}
                                  </span>
                                )}
                              </>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-3 ml-4">
                          {item.type === 'meeting' ? (
                            <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                              item.status === 'scheduled'
                                ? 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 dark:from-blue-900/20 dark:to-indigo-900/20 dark:text-blue-400'
                                : 'bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 dark:from-emerald-900/20 dark:to-green-900/20 dark:text-emerald-400'
                            }`}>
                              {item.status}
                            </span>
                          ) : (
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200"
                              title="Edit Task"
                            >
                              <Edit3 size={16} />
                            </motion.button>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-12">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Calendar size={64} className="mx-auto text-gray-400 mb-6" />
                    <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg">
                      {state.userRole === 'professional' 
                        ? 'No scheduled items for today' 
                        : 'No study sessions planned for today'
                      }
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={onAddTask}
                      className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 font-semibold shadow-medium"
                    >
                      {state.userRole === 'professional' ? 'Add Your First Task' : 'Plan Your Study Session'}
                    </motion.button>
                  </motion.div>
                </div>
              )}
            </div>

            {/* Enhanced Schedule Summary with Progress Indicators */}
            {todaysSchedule.length > 0 && (
              <div className="mt-8 pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
                <div className="grid grid-cols-3 gap-6">
                  {[
                    {
                      label: state.userRole === 'professional' ? 'Meetings' : 'Sessions',
                      value: todaysSchedule.filter(item => item.type === 'meeting').length,
                      total: todaysSchedule.filter(item => item.type === 'meeting').length,
                      color: 'from-blue-500 to-indigo-600'
                    },
                    {
                      label: 'Tasks',
                      value: todaysSchedule.filter(item => item.type === 'task').length,
                      total: todaysSchedule.filter(item => item.type === 'task').length,
                      color: 'from-purple-500 to-violet-600'
                    },
                    {
                      label: 'Completed',
                      value: todaysSchedule.filter(item => item.type === 'task' && item.completed).length,
                      total: todaysSchedule.filter(item => item.type === 'task').length,
                      color: 'from-emerald-500 to-green-600'
                    }
                  ].map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className={`text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-1`}>
                        {stat.value}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{stat.label}</p>
                      {stat.label === 'Completed' && stat.total > 0 && (
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                          <div 
                            className={`bg-gradient-to-r ${stat.color} h-1.5 rounded-full transition-all duration-500`}
                            style={{ width: `${(stat.value / stat.total) * 100}%` }}
                          ></div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Recent Creations - Enhanced Spacing */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="w-full"
          >
            <RecentCreations onAddTask={onAddTask} onCreateFlashcard={onCreateFlashcard} />
          </motion.div>
        </div>

        {/* Right Column - Sidebar (Fixed width, no overlap) */}
        <div className="xl:col-span-4 space-y-8">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full"
          >
            <QuickActions onStartTimer={onStartTimer} onAddTask={onAddTask} onCreateFlashcard={onCreateFlashcard} />
          </motion.div>
          
          {/* Modular Widgets */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="w-full"
          >
            <ModularWidgets onStartTimer={onStartTimer} onAddTask={onAddTask} onCreateFlashcard={onCreateFlashcard} />
          </motion.div>
        </div>
      </div>
    </div>
  );
};