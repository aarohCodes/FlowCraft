import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Check, 
  Trash2, 
  Calendar, 
  Flag,
  Filter,
  Search
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { Task } from '../../types';
import { formatDistanceToNow } from 'date-fns';
import { useCelebration } from '../../hooks/useCelebration';
import { AnimatedButton } from '../UI/AnimatedButton';
import { AnimatedCard } from '../UI/AnimatedCard';
import { IconWrapper } from '../UI/IconWrapper';
import { Typography } from '../UI/Typography';

export const TaskManager: React.FC = () => {
  const { state, dispatch } = useApp();
  const { celebrate } = useCelebration();
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as Task['priority'],
    category: 'General',
    dueDate: '',
  });

  const filteredTasks = state.tasks.filter(task => {
    const matchesFilter = filter === 'all' || 
      (filter === 'active' && !task.completed) || 
      (filter === 'completed' && task.completed);
    
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const handleAddTask = () => {
    if (!newTask.title.trim()) return;

    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      completed: false,
      priority: newTask.priority,
      category: newTask.category,
      dueDate: newTask.dueDate ? new Date(newTask.dueDate) : undefined,
      createdAt: new Date(),
    };

    dispatch({ type: 'ADD_TASK', payload: task });
    
    // Notify task creation
    celebrate('taskComplete', 'New task created successfully!');
    
    setNewTask({
      title: '',
      description: '',
      priority: 'medium',
      category: 'General',
      dueDate: '',
    });
    setShowAddForm(false);
  };

  const toggleTask = (taskId: string) => {
    const task = state.tasks.find(t => t.id === taskId);
    if (task && !task.completed) {
      // Notify task completion
      celebrate('taskComplete', `Task "${task.title}" completed!`);
    }
    dispatch({ type: 'TOGGLE_TASK', payload: taskId });
  };

  const deleteTask = (taskId: string) => {
    dispatch({ type: 'DELETE_TASK', payload: taskId });
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return 'text-rose-500';
      case 'medium': return 'text-amber-500';
      case 'low': return 'text-emerald-500';
      default: return 'text-gray-500';
    }
  };

  const getPriorityBg = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return 'bg-rose-100 dark:bg-rose-900/20';
      case 'medium': return 'bg-amber-100 dark:bg-amber-900/20';
      case 'low': return 'bg-emerald-100 dark:bg-emerald-900/20';
      default: return 'bg-gray-100 dark:bg-gray-900/20';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header with Enhanced Typography */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <Typography variant="h3" weight="bold" className="mb-2">
            Task Manager
          </Typography>
          <Typography variant="body1" className="text-gray-600 dark:text-gray-400">
            Manage your tasks and stay organized
          </Typography>
        </div>
        <AnimatedButton
          variant="primary"
          gradient
          onClick={() => setShowAddForm(true)}
          icon={<Plus size={18} />}
        >
          Add Task
        </AnimatedButton>
      </div>

      {/* Filters and Search with Enhanced UI */}
      <AnimatedCard variant="glass" className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          {/* Enhanced Search with Animations */}
          <div className="relative flex-1 max-w-md">
            <Search size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <motion.input
              initial={{ boxShadow: "0 0 0 rgba(59, 130, 246, 0)" }}
              whileFocus={{ boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.3)" }}
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          {/* Enhanced Filters with Micro-animations */}
          <div className="flex items-center space-x-3">
            <IconWrapper
              icon={Filter}
              size={16}
              color="text-gray-400"
              className="mr-1"
            />
            {['all', 'active', 'completed'].map((filterOption) => (
              <motion.button
                key={filterOption}
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilter(filterOption as typeof filter)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  filter === filterOption
                    ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-medium'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
              </motion.button>
            ))}
          </div>
        </div>
      </AnimatedCard>

      {/* Add Task Form with Enhanced Animations */}
      <AnimatePresence>
        {showAddForm && (
          <AnimatedCard variant="glass" className="p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="flex items-center justify-between mb-6">
                <Typography variant="h4" weight="bold">
                  Add New Task
                </Typography>
                <motion.button
                  whileHover={{ rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowAddForm(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <Trash2 size={20} />
                </motion.button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <Typography variant="body2" weight="semibold" className="text-gray-700 dark:text-gray-300 mb-2">
                    Title
                  </Typography>
                  <motion.input
                    type="text"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter task title"
                    whileFocus={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                  />
                </div>
                
                <div>
                  <Typography variant="body2" weight="semibold" className="text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </Typography>
                  <motion.textarea
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter task description"
                    rows={3}
                    whileFocus={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div>
                    <Typography variant="body2" weight="semibold" className="text-gray-700 dark:text-gray-300 mb-2">
                      Priority
                    </Typography>
                    <motion.select
                      value={newTask.priority}
                      onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as Task['priority'] })}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      whileFocus={{ scale: 1.01 }}
                      transition={{ duration: 0.2 }}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </motion.select>
                  </div>
                  
                  <div>
                    <Typography variant="body2" weight="semibold" className="text-gray-700 dark:text-gray-300 mb-2">
                      Category
                    </Typography>
                    <motion.input
                      type="text"
                      value={newTask.category}
                      onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Category"
                      whileFocus={{ scale: 1.01 }}
                      transition={{ duration: 0.2 }}
                    />
                  </div>
                  
                  <div>
                    <Typography variant="body2" weight="semibold" className="text-gray-700 dark:text-gray-300 mb-2">
                      Due Date
                    </Typography>
                    <motion.input
                      type="date"
                      value={newTask.dueDate}
                      onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      whileFocus={{ scale: 1.01 }}
                      transition={{ duration: 0.2 }}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-4 pt-4">
                  <AnimatedButton
                    variant="ghost"
                    onClick={() => setShowAddForm(false)}
                  >
                    Cancel
                  </AnimatedButton>
                  <AnimatedButton
                    variant="primary"
                    gradient
                    onClick={handleAddTask}
                    icon={<Plus size={16} />}
                  >
                    Add Task
                  </AnimatedButton>
                </div>
              </div>
            </motion.div>
          </AnimatedCard>
        )}
      </AnimatePresence>

      {/* Tasks List with Enhanced Animations */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredTasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ 
                delay: index * 0.05,
                type: "spring",
                stiffness: 300,
                damping: 25
              }}
              layout
              className={`bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-soft hover:shadow-medium transition-all duration-300 ${
                task.completed ? 'opacity-80' : ''
              }`}
            >
              <div className="flex items-start space-x-5">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => toggleTask(task.id)}
                  className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                    task.completed
                      ? 'bg-gradient-to-r from-emerald-500 to-green-600 border-emerald-500 text-white shadow-soft'
                      : 'border-gray-300 dark:border-gray-600 hover:border-emerald-500 hover:shadow-glow'
                  }`}
                >
                  {task.completed && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ 
                        type: "spring",
                        stiffness: 500,
                        damping: 15
                      }}
                    >
                      <Check size={14} />
                    </motion.div>
                  )}
                </motion.button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <Typography 
                        variant="body1" 
                        weight="semibold"
                        className={`mb-2 ${
                          task.completed 
                            ? 'line-through text-gray-500 dark:text-gray-400' 
                            : 'text-gray-900 dark:text-white'
                        }`}
                      >
                        {task.title}
                      </Typography>
                      {task.description && (
                        <Typography 
                          variant="body2" 
                          className="text-gray-600 dark:text-gray-400 mb-4"
                        >
                          {task.description}
                        </Typography>
                      )}
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 15 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => deleteTask(task.id)}
                      className="text-gray-400 hover:text-rose-500 transition-colors ml-4 p-2 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg"
                    >
                      <Trash2 size={18} />
                    </motion.button>
                  </div>

                  <div className="flex items-center flex-wrap gap-4 mt-3">
                    <div className="flex items-center space-x-2">
                      <Flag size={14} className={getPriorityColor(task.priority)} />
                      <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${getPriorityBg(task.priority)} ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    </div>
                    <span className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full text-xs font-medium">
                      {task.category}
                    </span>
                    {task.dueDate && (
                      <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                        <Calendar size={14} />
                        <span>Due {formatDistanceToNow(task.dueDate, { addSuffix: true })}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredTasks.length === 0 && (
          <AnimatedCard variant="glass" className="p-12 text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                type: "spring",
                stiffness: 300,
                damping: 25
              }}
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="mb-6"
              >
                <Check size={64} className="mx-auto text-gray-400" />
              </motion.div>
              <Typography variant="h5" weight="semibold" className="text-gray-600 dark:text-gray-400 mb-6">
                {searchTerm || filter !== 'all' 
                  ? 'No tasks match your criteria' 
                  : 'No tasks yet. Add your first task to get started!'
                }
              </Typography>
              <AnimatedButton
                variant="primary"
                gradient
                onClick={() => setShowAddForm(true)}
                icon={<Plus size={18} />}
              >
                Create Your First Task
              </AnimatedButton>
            </motion.div>
          </AnimatedCard>
        )}
      </div>
    </div>
  );
};