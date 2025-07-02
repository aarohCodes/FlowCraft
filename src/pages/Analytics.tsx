import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Calendar, 
  Clock,
  Users,
  Zap,
  Target,
  Award
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';

export const Analytics: React.FC = () => {
  const { state } = useApp();

  // Calculate real analytics from state data
  const totalTasks = state.tasks.length;
  const completedTasks = state.tasks.filter(task => task.completed).length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  const totalFlashcards = state.flashcards.length;
  const totalAttempts = state.flashcards.reduce((sum, card) => sum + card.totalAttempts, 0);
  const correctAttempts = state.flashcards.reduce((sum, card) => sum + card.correctCount, 0);
  const flashcardAccuracy = totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 0;
  
  const totalMeetings = state.meetings.length;
  const completedMeetings = state.meetings.filter(meeting => meeting.status === 'completed').length;
  
  const totalEmails = state.emails.length;
  const sentEmails = state.emails.filter(email => email.status === 'sent').length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Analytics Dashboard
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          Track your productivity, learning progress, and AI tool effectiveness with 
          comprehensive analytics and insights.
        </p>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Tasks This Month
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {totalTasks}
              </p>
              <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                {completionRate}% completed
              </p>
            </div>
            <Target className="w-8 h-8 text-blue-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Meetings Attended
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {completedMeetings}
              </p>
              <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                {Math.round((completedMeetings / totalMeetings) * 100)}% completed
              </p>
            </div>
            <Users className="w-8 h-8 text-green-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Flashcards Studied
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {totalFlashcards}
              </p>
              <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                {flashcardAccuracy}% accuracy
              </p>
            </div>
            <Award className="w-8 h-8 text-orange-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Social Posts
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {sentEmails}
              </p>
              <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                {Math.round((sentEmails / totalEmails) * 100)}% sent
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-500" />
          </div>
        </motion.div>
      </div>

      {/* Charts and Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Weekly Activity Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Weekly Activity Overview
          </h3>
                      <div className="space-y-4">
             {state.tasks.slice(0, 7).map((task, index) => (
               <div key={task.id} className="space-y-2">
                  <div className="flex justify-between text-sm">
                   <span className="text-gray-600 dark:text-gray-400">{task.title}</span>
                   <span className="text-gray-900 dark:text-white font-medium">
                     {task.completed ? 'Completed' : 'In Progress'}
                   </span>
                  </div>
                  <div className="flex space-x-1 h-2">
                   <div 
                     className="bg-blue-500 rounded-sm"
                     style={{ width: `${task.completed ? 100 : 50}%` }}
                   ></div>
                  </div>
                </div>
              ))}
            </div>
        </motion.div>

        {/* Productivity Metrics */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Productivity Insights
          </h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-blue-500" />
                <span className="text-gray-700 dark:text-gray-300">Avg. Task Time</span>
              </div>
              <span className="text-gray-900 dark:text-white font-semibold">
                {totalTasks > 0 ? Math.round(totalTasks / 7) : 0} tasks/day
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Users className="w-5 h-5 text-green-500" />
                <span className="text-gray-700 dark:text-gray-300">Meeting Efficiency</span>
              </div>
              <span className="text-gray-900 dark:text-white font-semibold">
                {totalMeetings > 0 ? Math.round((completedMeetings / totalMeetings) * 100) : 0}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Award className="w-5 h-5 text-orange-500" />
                <span className="text-gray-700 dark:text-gray-300">Study Accuracy</span>
              </div>
              <span className="text-gray-900 dark:text-white font-semibold">
                {flashcardAccuracy}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <TrendingUp className="w-5 h-5 text-purple-500" />
                <span className="text-gray-700 dark:text-gray-300">Email Success Rate</span>
              </div>
              <span className="text-gray-900 dark:text-white font-semibold">
                {totalEmails > 0 ? Math.round((sentEmails / totalEmails) * 100) : 0}%
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* AI Tools Performance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          AI Tools Performance
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {state.tools.filter(tool => tool.isActive).map((tool, index) => (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 + index * 0.1 }}
              className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
            >
              <div className="flex items-center space-x-3 mb-3">
                <Zap className="w-5 h-5 text-primary-500" />
                <span className="font-medium text-gray-900 dark:text-white">{tool.name}</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Usage</span>
                  <span className="text-gray-900 dark:text-white font-medium">
                    {Math.floor(Math.random() * 100) + 50} times
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Efficiency</span>
                  <span className="text-green-600 dark:text-green-400 font-medium">
                    {Math.floor(Math.random() * 20) + 80}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Last Used</span>
                  <span className="text-gray-900 dark:text-white font-medium">
                    {Math.floor(Math.random() * 24)} hours ago
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};