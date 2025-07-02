import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ArrowLeft,
  Clock,
  Target,
  CheckCircle
} from 'lucide-react';

interface TimerProps {
  onBack: () => void;
}

export const Timer: React.FC<TimerProps> = ({ onBack }) => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [initialTime, setInitialTime] = useState(25 * 60);
  const [sessionType, setSessionType] = useState<'work' | 'break'>('work');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      // Auto-switch between work and break sessions
      if (sessionType === 'work') {
        setSessionType('break');
        setTimeLeft(5 * 60); // 5 minute break
        setInitialTime(5 * 60);
      } else {
        setSessionType('work');
        setTimeLeft(25 * 60); // 25 minute work session
        setInitialTime(25 * 60);
      }
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, sessionType]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);
  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(initialTime);
  };

  const handleSessionChange = (type: 'work' | 'break') => {
    setIsRunning(false);
    setSessionType(type);
    const newTime = type === 'work' ? 25 * 60 : 5 * 60;
    setTimeLeft(newTime);
    setInitialTime(newTime);
  };

  const progress = ((initialTime - timeLeft) / initialTime) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <button
            onClick={onBack}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Dashboard</span>
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Focus Timer
          </h1>
          <div className="w-32"></div> {/* Spacer for centering */}
        </motion.div>

        {/* Main Timer Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-12 border border-gray-200 dark:border-gray-700 shadow-2xl text-center"
        >
          {/* Session Type Selector */}
          <div className="flex justify-center mb-8">
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-1 flex">
              <button
                onClick={() => handleSessionChange('work')}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  sessionType === 'work'
                    ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
              >
                Work Session
              </button>
              <button
                onClick={() => handleSessionChange('break')}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  sessionType === 'break'
                    ? 'bg-green-500 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
              >
                Break Time
              </button>
            </div>
          </div>

          {/* Timer Display */}
          <div className="relative mb-12">
            <div className="w-80 h-80 mx-auto relative">
              {/* Progress Ring */}
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  className="text-gray-200 dark:text-gray-700"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 45}`}
                  strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
                  className={`transition-all duration-1000 ${
                    sessionType === 'work' ? 'text-primary-500' : 'text-green-500'
                  }`}
                  strokeLinecap="round"
                />
              </svg>
              
              {/* Time Display */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className={`text-6xl font-bold mb-2 ${
                  sessionType === 'work' ? 'text-primary-600' : 'text-green-600'
                } dark:text-white`}>
                  {formatTime(timeLeft)}
                </div>
                <div className="text-lg text-gray-600 dark:text-gray-400 font-medium">
                  {sessionType === 'work' ? 'Time left to finish task' : 'Break time remaining'}
                </div>
              </div>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-center space-x-6 mb-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={isRunning ? handlePause : handleStart}
              className={`flex items-center space-x-2 px-8 py-4 rounded-xl text-white font-semibold text-lg shadow-lg transition-all duration-200 ${
                sessionType === 'work'
                  ? 'bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600'
                  : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
              }`}
            >
              {isRunning ? <Pause size={24} /> : <Play size={24} />}
              <span>{isRunning ? 'Pause' : 'Start'}</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleReset}
              className="flex items-center space-x-2 px-6 py-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-semibold"
            >
              <RotateCcw size={20} />
              <span>Reset</span>
            </motion.button>
          </div>

          {/* Session Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center justify-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <Clock className="w-6 h-6 text-blue-500" />
              <div className="text-left">
                <p className="text-sm text-gray-600 dark:text-gray-400">Session</p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {sessionType === 'work' ? '25 min' : '5 min'}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <Target className="w-6 h-6 text-primary-500" />
              <div className="text-left">
                <p className="text-sm text-gray-600 dark:text-gray-400">Progress</p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {Math.round(progress)}%
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-500" />
              <div className="text-left">
                <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {isRunning ? 'Active' : 'Paused'}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tips Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Pomodoro Technique Tips
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
              <p>Focus on a single task during work sessions</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <p>Take short breaks to recharge your mind</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <p>Eliminate distractions during focus time</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-secondary-500 rounded-full mt-2 flex-shrink-0"></div>
              <p>Track your progress and celebrate wins</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};