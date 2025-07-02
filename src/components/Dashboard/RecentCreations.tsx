import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  BookOpen, 
  HelpCircle, 
  Play, 
  Edit3, 
  Trash2, 
  CheckCircle, 
  Clock, 
  Calendar,
  Target,
  RotateCcw,
  ChevronRight,
  Plus,
  Eye,
  Award,
  Mail,
  Users,
  BarChart3
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { formatDistanceToNow } from 'date-fns';
import { AnimatedCard } from '../UI/AnimatedCard';
import { AnimatedButton } from '../UI/AnimatedButton';
import { IconWrapper } from '../UI/IconWrapper';
import { Typography } from '../UI/Typography';
import { useCelebration } from '../../hooks/useCelebration';

interface RecentCreationsProps {
  onAddTask?: () => void;
  onCreateFlashcard?: () => void;
}

export const RecentCreations: React.FC<RecentCreationsProps> = ({ onAddTask, onCreateFlashcard }) => {
  const { state, dispatch } = useApp();
  const { celebrate } = useCelebration();
  const [activeTab, setActiveTab] = useState<'tasks' | 'flashcards' | 'quizzes' | 'emails' | 'meetings'>('tasks');
  const [selectedFlashcard, setSelectedFlashcard] = useState<string | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);

  // Get recent items (last 5 of each type)
  const recentTasks = state.tasks
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);
  
  const recentFlashcards = state.flashcards.slice(-5).reverse();
  
  // Mock recent quizzes (since we don't have quiz data structure yet)
  const recentQuizzes = [
    { 
      id: '1', 
      title: 'JavaScript Fundamentals Quiz', 
      createdAt: new Date(Date.now() - 3600000), 
      questions: 10,
      difficulty: 'medium',
      category: 'Programming',
      completed: false,
      score: null
    },
    { 
      id: '2', 
      title: 'React Hooks Quiz', 
      createdAt: new Date(Date.now() - 7200000), 
      questions: 8,
      difficulty: 'hard',
      category: 'React',
      completed: true,
      score: 85
    },
    { 
      id: '3', 
      title: 'CSS Flexbox Quiz', 
      createdAt: new Date(Date.now() - 14400000), 
      questions: 12,
      difficulty: 'easy',
      category: 'CSS',
      completed: false,
      score: null
    },
  ];

  // Mock recent emails for professional mode
  const recentEmails = [
    {
      id: '1',
      subject: 'Meeting Summary: Q4 Planning',
      recipients: ['team@company.com'],
      status: 'sent',
      createdAt: new Date(Date.now() - 1800000),
      type: 'meeting_summary'
    },
    {
      id: '2',
      subject: 'Action Items Follow-up',
      recipients: ['john@company.com'],
      status: 'pending_approval',
      createdAt: new Date(Date.now() - 3600000),
      type: 'action_items'
    },
    {
      id: '3',
      subject: 'Client Thank You Note',
      recipients: ['client@external.com'],
      status: 'draft',
      createdAt: new Date(Date.now() - 7200000),
      type: 'thank_you'
    }
  ];

  // Mock recent meetings for professional mode
  const recentMeetings = [
    {
      id: '1',
      title: 'Weekly Team Sync',
      date: new Date(Date.now() + 3600000),
      duration: 30,
      participants: 5,
      status: 'scheduled',
      platform: 'zoom'
    },
    {
      id: '2',
      title: 'Client Presentation',
      date: new Date(Date.now() - 3600000),
      duration: 60,
      participants: 8,
      status: 'completed',
      platform: 'google-meet'
    },
    {
      id: '3',
      title: 'Project Review',
      date: new Date(Date.now() - 7200000),
      duration: 45,
      participants: 6,
      status: 'completed',
      platform: 'teams'
    }
  ];

  const toggleTask = (taskId: string) => {
    const task = state.tasks.find(t => t.id === taskId);
    if (task && !task.completed) {
      // Celebrate task completion
      celebrate('taskComplete', `Great job completing "${task.title}"!`);
    }
    dispatch({ type: 'TOGGLE_TASK', payload: taskId });
  };

  const deleteTask = (taskId: string) => {
    dispatch({ type: 'DELETE_TASK', payload: taskId });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-500 bg-red-100 dark:bg-red-900/20';
      case 'medium': return 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/20';
      case 'low': return 'text-green-500 bg-green-100 dark:bg-green-900/20';
      default: return 'text-gray-500 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'hard': return 'text-red-500 bg-red-100 dark:bg-red-900/20';
      case 'medium': return 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/20';
      case 'easy': return 'text-green-500 bg-green-100 dark:bg-green-900/20';
      default: return 'text-gray-500 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'text-green-500 bg-green-100 dark:bg-green-900/20';
      case 'pending_approval': return 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/20';
      case 'draft': return 'text-gray-500 bg-gray-100 dark:bg-gray-900/20';
      case 'scheduled': return 'text-blue-500 bg-blue-100 dark:bg-blue-900/20';
      case 'completed': return 'text-green-500 bg-green-100 dark:bg-green-900/20';
      default: return 'text-gray-500 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const handleFlashcardClick = (flashcardId: string) => {
    if (selectedFlashcard === flashcardId) {
      setIsFlipped(!isFlipped);
    } else {
      setSelectedFlashcard(flashcardId);
      setIsFlipped(false);
    }
  };

  const startQuiz = (quizId: string) => {
    console.log('Starting quiz:', quizId);
  };

  // Define tabs based on user role
  const professionalTabs = [
    { id: 'tasks', label: 'Tasks', icon: FileText, count: recentTasks.length },
    { id: 'emails', label: 'Emails', icon: Mail, count: recentEmails.length },
    { id: 'meetings', label: 'Meetings', icon: Users, count: recentMeetings.length },
  ];

  const studentTabs = [
    { id: 'tasks', label: 'Tasks', icon: FileText, count: recentTasks.length },
    { id: 'flashcards', label: 'Flashcards', icon: BookOpen, count: recentFlashcards.length },
    { id: 'quizzes', label: 'Quizzes', icon: HelpCircle, count: recentQuizzes.length },
  ];

  const tabs = state.userRole === 'professional' ? professionalTabs : studentTabs;

  // Set default tab based on role
  React.useEffect(() => {
    if (state.userRole === 'professional' && (activeTab === 'flashcards' || activeTab === 'quizzes')) {
      setActiveTab('tasks');
    } else if (state.userRole === 'student' && (activeTab === 'emails' || activeTab === 'meetings')) {
      setActiveTab('tasks');
    }
  }, [state.userRole, activeTab]);

  const renderTaskContent = () => (
    <div className="space-y-4">
      {recentTasks.length > 0 ? (
        recentTasks.map((task, index) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              delay: index * 0.1,
              type: "spring",
              stiffness: 200,
              damping: 15
            }}
            className={`p-5 rounded-xl border transition-all duration-300 hover:shadow-medium ${
              task.completed 
                ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800' 
                : 'bg-white dark:bg-gray-700/50 border-gray-200 dark:border-gray-600'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4 flex-1">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => toggleTask(task.id)}
                  className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                    task.completed
                      ? 'bg-green-500 border-green-500 text-white shadow-soft'
                      : 'border-gray-300 dark:border-gray-600 hover:border-green-500 hover:shadow-glow'
                  }`}
                >
                  {task.completed && <CheckCircle size={14} />}
                </motion.button>

                <div className="flex-1 min-w-0">
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
                    <Typography variant="body2" className="text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                      {task.description}
                    </Typography>
                  )}
                  <div className="flex items-center space-x-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                    <Typography variant="caption" className="text-gray-500 dark:text-gray-400">
                      {task.category}
                    </Typography>
                    {task.dueDate && (
                      <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                        <Calendar size={12} />
                        <span>Due {formatDistanceToNow(task.dueDate, { addSuffix: true })}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 ml-4">
                <IconWrapper
                  icon={Edit3}
                  size={16}
                  hover
                  className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200"
                />
                <IconWrapper
                  icon={Trash2}
                  size={16}
                  hover
                  onClick={() => deleteTask(task.id)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
                />
              </div>
            </div>
          </motion.div>
        ))
      ) : (
        <div className="text-center py-12">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            <FileText size={64} className="mx-auto text-gray-400 mb-6" />
            <Typography variant="body1" className="text-gray-600 dark:text-gray-400 mb-6">
              No tasks created yet
            </Typography>
            <AnimatedButton
              variant="primary"
              gradient
              onClick={onAddTask}
              icon={<Plus size={16} />}
            >
              Create Your First Task
            </AnimatedButton>
          </motion.div>
        </div>
      )}
    </div>
  );

  const renderFlashcardContent = () => (
    <div className="space-y-4">
      {recentFlashcards.length > 0 ? (
        recentFlashcards.map((flashcard, index) => (
          <motion.div
            key={flashcard.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              delay: index * 0.1,
              type: "spring",
              stiffness: 200,
              damping: 15
            }}
            className="p-5 bg-white dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600 hover:shadow-medium transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(flashcard.difficulty)}`}>
                    {flashcard.difficulty}
                  </span>
                  <Typography variant="caption" className="text-gray-500 dark:text-gray-400">
                    {flashcard.category}
                  </Typography>
                  {flashcard.totalAttempts > 0 && (
                    <div className="flex items-center space-x-1">
                      <Award size={12} className="text-yellow-500" />
                      <Typography variant="caption" className="text-gray-500 dark:text-gray-400">
                        {Math.round((flashcard.correctCount / flashcard.totalAttempts) * 100)}% accuracy
                      </Typography>
                    </div>
                  )}
                </div>
                
                <motion.div
                  className="cursor-pointer"
                  onClick={() => handleFlashcardClick(flashcard.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <AnimatePresence mode="wait">
                    {selectedFlashcard === flashcard.id && isFlipped ? (
                      <motion.div
                        key="answer"
                        initial={{ rotateY: 180, opacity: 0 }}
                        animate={{ rotateY: 0, opacity: 1 }}
                        exit={{ rotateY: -180, opacity: 0 }}
                        transition={{ duration: 0.4, type: "spring", stiffness: 200 }}
                        className="p-5 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl border border-green-200 dark:border-green-800"
                      >
                        <div className="flex items-center space-x-2 mb-3">
                          <CheckCircle size={18} className="text-green-500" />
                          <Typography variant="body2" weight="semibold" className="text-green-700 dark:text-green-400">
                            Answer
                          </Typography>
                        </div>
                        <Typography variant="body1" weight="medium" className="text-gray-900 dark:text-white">
                          {flashcard.answer}
                        </Typography>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="question"
                        initial={{ rotateY: 180, opacity: 0 }}
                        animate={{ rotateY: 0, opacity: 1 }}
                        exit={{ rotateY: -180, opacity: 0 }}
                        transition={{ duration: 0.4, type: "spring", stiffness: 200 }}
                        className="p-5 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-blue-200 dark:border-blue-800"
                      >
                        <div className="flex items-center space-x-2 mb-3">
                          <HelpCircle size={18} className="text-blue-500" />
                          <Typography variant="body2" weight="semibold" className="text-blue-700 dark:text-blue-400">
                            Question
                          </Typography>
                        </div>
                        <Typography variant="body1" weight="medium" className="text-gray-900 dark:text-white mb-2">
                          {flashcard.question}
                        </Typography>
                        <Typography variant="caption" className="text-gray-500 dark:text-gray-400">
                          Click to reveal answer
                        </Typography>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>

              <div className="flex items-center space-x-2 ml-4">
                <IconWrapper
                  icon={Eye}
                  size={16}
                  hover
                  onClick={() => handleFlashcardClick(flashcard.id)}
                  className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200"
                />
                <IconWrapper
                  icon={Play}
                  size={16}
                  hover
                  className="p-2 text-gray-400 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-all duration-200"
                />
              </div>
            </div>
          </motion.div>
        ))
      ) : (
        <div className="text-center py-12">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            <BookOpen size={64} className="mx-auto text-gray-400 mb-6" />
            <Typography variant="body1" className="text-gray-600 dark:text-gray-400 mb-6">
              No flashcards created yet
            </Typography>
            <AnimatedButton
              variant="warning"
              gradient
              onClick={onCreateFlashcard}
              icon={<BookOpen size={16} />}
            >
              Create Your First Flashcard
            </AnimatedButton>
          </motion.div>
        </div>
      )}
    </div>
  );

  const renderQuizContent = () => (
    <div className="space-y-4">
      {recentQuizzes.length > 0 ? (
        recentQuizzes.map((quiz, index) => (
          <motion.div
            key={quiz.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              delay: index * 0.1,
              type: "spring",
              stiffness: 200,
              damping: 15
            }}
            className="p-5 bg-white dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600 hover:shadow-medium transition-all duration-300"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <Typography variant="body1" weight="semibold" className="text-gray-900 dark:text-white mb-3">
                  {quiz.title}
                </Typography>
                <div className="flex items-center space-x-4 mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(quiz.difficulty)}`}>
                    {quiz.difficulty}
                  </span>
                  <Typography variant="caption" className="text-gray-500 dark:text-gray-400">
                    {quiz.category}
                  </Typography>
                  <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                    <HelpCircle size={12} />
                    <span>{quiz.questions} questions</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <Typography variant="caption" className="text-gray-500 dark:text-gray-400">
                      Created {formatDistanceToNow(quiz.createdAt, { addSuffix: true })}
                    </Typography>
                    {quiz.completed && quiz.score !== null && (
                      <div className="flex items-center space-x-1">
                        <Target size={12} className="text-green-500" />
                        <Typography variant="caption" weight="semibold" className="text-green-600 dark:text-green-400">
                          Score: {quiz.score}%
                        </Typography>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {quiz.completed ? (
                      <AnimatedButton
                        variant="secondary"
                        size="sm"
                        onClick={() => startQuiz(quiz.id)}
                        icon={<RotateCcw size={14} />}
                      >
                        Retake
                      </AnimatedButton>
                    ) : (
                      <AnimatedButton
                        variant="success"
                        size="sm"
                        onClick={() => startQuiz(quiz.id)}
                        icon={<Play size={14} />}
                      >
                        Start Quiz
                      </AnimatedButton>
                    )}
                    
                    <IconWrapper
                      icon={Edit3}
                      size={16}
                      hover
                      className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200"
                    />
                  </div>
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
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            <HelpCircle size={64} className="mx-auto text-gray-400 mb-6" />
            <Typography variant="body1" className="text-gray-600 dark:text-gray-400 mb-6">
              No quizzes created yet
            </Typography>
            <AnimatedButton
              variant="success"
              gradient
              icon={<HelpCircle size={16} />}
            >
              Generate Your First Quiz
            </AnimatedButton>
          </motion.div>
        </div>
      )}
    </div>
  );

  const renderEmailContent = () => (
    <div className="space-y-4">
      {recentEmails.length > 0 ? (
        recentEmails.map((email, index) => (
          <motion.div
            key={email.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              delay: index * 0.1,
              type: "spring",
              stiffness: 200,
              damping: 15
            }}
            className="p-5 bg-white dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600 hover:shadow-medium transition-all duration-300"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <Typography variant="body1" weight="semibold" className="text-gray-900 dark:text-white mb-3">
                  {email.subject}
                </Typography>
                <div className="flex items-center space-x-4 mb-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(email.status)}`}>
                    {email.status.replace('_', ' ')}
                  </span>
                  <Typography variant="caption" className="text-gray-500 dark:text-gray-400">
                    To: {email.recipients.join(', ')}
                  </Typography>
                </div>
                <div className="flex items-center justify-between">
                  <Typography variant="caption" className="text-gray-500 dark:text-gray-400">
                    {formatDistanceToNow(email.createdAt, { addSuffix: true })}
                  </Typography>
                  <div className="flex items-center space-x-2">
                    <IconWrapper
                      icon={Eye}
                      size={16}
                      hover
                      className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200"
                    />
                    <IconWrapper
                      icon={Edit3}
                      size={16}
                      hover
                      className="p-2 text-gray-400 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-all duration-200"
                    />
                  </div>
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
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            <Mail size={64} className="mx-auto text-gray-400 mb-6" />
            <Typography variant="body1" className="text-gray-600 dark:text-gray-400 mb-6">
              No emails generated yet
            </Typography>
            <AnimatedButton
              variant="primary"
              gradient
              icon={<Mail size={16} />}
            >
              Generate from Meeting
            </AnimatedButton>
          </motion.div>
        </div>
      )}
    </div>
  );

  const renderMeetingContent = () => (
    <div className="space-y-4">
      {recentMeetings.length > 0 ? (
        recentMeetings.map((meeting, index) => (
          <motion.div
            key={meeting.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              delay: index * 0.1,
              type: "spring",
              stiffness: 200,
              damping: 15
            }}
            className="p-5 bg-white dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600 hover:shadow-medium transition-all duration-300"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <Typography variant="body1" weight="semibold" className="text-gray-900 dark:text-white mb-3">
                  {meeting.title}
                </Typography>
                <div className="flex items-center space-x-4 mb-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(meeting.status)}`}>
                    {meeting.status}
                  </span>
                  <Typography variant="caption" className="text-gray-500 dark:text-gray-400">
                    {meeting.participants} participants
                  </Typography>
                  <Typography variant="caption" className="text-gray-500 dark:text-gray-400">
                    {meeting.duration} min
                  </Typography>
                </div>
                <div className="flex items-center justify-between">
                  <Typography variant="caption" className="text-gray-500 dark:text-gray-400">
                    {formatDistanceToNow(meeting.date, { addSuffix: true })}
                  </Typography>
                  <div className="flex items-center space-x-2">
                    <IconWrapper
                      icon={BarChart3}
                      size={16}
                      hover
                      className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200"
                    />
                    <IconWrapper
                      icon={Play}
                      size={16}
                      hover
                      className="p-2 text-gray-400 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-all duration-200"
                    />
                  </div>
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
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            <Users size={64} className="mx-auto text-gray-400 mb-6" />
            <Typography variant="body1" className="text-gray-600 dark:text-gray-400 mb-6">
              No meetings scheduled yet
            </Typography>
            <AnimatedButton
              variant="primary"
              gradient
              icon={<Calendar size={16} />}
            >
              Schedule Meeting
            </AnimatedButton>
          </motion.div>
        </div>
      )}
    </div>
  );

  return (
    <AnimatedCard variant="glass" className="p-8 w-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Typography variant="h5" weight="bold" className="mb-2">
            Recent Creations
          </Typography>
          <Typography variant="body2" className="text-gray-600 dark:text-gray-400">
            Your latest work and progress
          </Typography>
        </div>
        <div className="flex items-center space-x-3">
          <IconWrapper
            icon={Plus}
            size={16}
            hover
            onClick={onAddTask}
            className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200"
          />
          {state.userRole === 'student' && (
            <IconWrapper
              icon={BookOpen}
              size={16}
              hover
              onClick={onCreateFlashcard}
              className="p-2 text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-all duration-200"
            />
          )}
        </div>
      </div>

      {/* Enhanced Tabs with Animations */}
      <div className="flex space-x-2 mb-8 bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
        {tabs.map((tab, index) => {
          const Icon = tab.icon;
          return (
            <motion.button
              key={tab.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 flex-1 justify-center relative ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-soft'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-600/50'
              }`}
            >
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-white dark:bg-gray-600 rounded-lg shadow-soft"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <div className="relative z-10 flex items-center space-x-2">
                <Icon size={16} />
                <span>{tab.label}</span>
                {tab.count > 0 && (
                  <motion.span 
                    className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                      activeTab === tab.id
                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                        : 'bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400'
                    }`}
                    whileHover={{ scale: 1.1 }}
                  >
                    {tab.count}
                  </motion.span>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Content with Enhanced Animations */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ 
            duration: 0.3,
            type: "spring",
            stiffness: 200,
            damping: 20
          }}
        >
          {activeTab === 'tasks' && renderTaskContent()}
          {activeTab === 'flashcards' && renderFlashcardContent()}
          {activeTab === 'quizzes' && renderQuizContent()}
          {activeTab === 'emails' && renderEmailContent()}
          {activeTab === 'meetings' && renderMeetingContent()}
        </motion.div>
      </AnimatePresence>

      {/* Enhanced Footer with Better Spacing */}
      <div className="mt-8 pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
        <div className="flex items-center justify-between">
          <Typography variant="caption" className="text-gray-500 dark:text-gray-400">
            {activeTab === 'tasks' && `${recentTasks.filter(t => !t.completed).length} active tasks`}
            {activeTab === 'flashcards' && `${recentFlashcards.length} flashcards ready to study`}
            {activeTab === 'quizzes' && `${recentQuizzes.filter(q => !q.completed).length} quizzes pending`}
            {activeTab === 'emails' && `${recentEmails.filter(e => e.status === 'pending_approval').length} emails pending approval`}
            {activeTab === 'meetings' && `${recentMeetings.filter(m => m.status === 'scheduled').length} meetings scheduled`}
          </Typography>
          <motion.button
            whileHover={{ scale: 1.05, x: 2 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-1 text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors font-semibold"
          >
            <span>View All</span>
            <ChevronRight size={12} />
          </motion.button>
        </div>
      </div>
    </AnimatedCard>
  );
};