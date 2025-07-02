import React from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  Clock, 
  MessageSquare, 
  BookOpen,
  Calendar,
  TrendingUp
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Activity {
  id: string;
  type: 'task' | 'meeting' | 'flashcard' | 'social' | 'achievement';
  title: string;
  description: string;
  timestamp: Date;
  icon: 'check' | 'clock' | 'message' | 'book' | 'calendar' | 'trending';
}

const activities: Activity[] = [
  {
    id: '1',
    type: 'task',
    title: 'Task Completed',
    description: 'Update project documentation',
    timestamp: new Date(Date.now() - 3600000),
    icon: 'check',
  },
  {
    id: '2',
    type: 'meeting',
    title: 'Meeting Scheduled',
    description: 'Weekly Team Sync in 1 hour',
    timestamp: new Date(Date.now() - 1800000),
    icon: 'calendar',
  },
  {
    id: '3',
    type: 'flashcard',
    title: 'Flashcard Created',
    description: 'Software Architecture concepts',
    timestamp: new Date(Date.now() - 7200000),
    icon: 'book',
  },
  {
    id: '4',
    type: 'social',
    title: 'Tweet Drafted',
    description: 'Productivity tips post ready',
    timestamp: new Date(Date.now() - 10800000),
    icon: 'message',
  },
  {
    id: '5',
    type: 'achievement',
    title: 'Goal Achievement',
    description: 'Completed 50 flashcard reviews',
    timestamp: new Date(Date.now() - 14400000),
    icon: 'trending',
  },
];

const iconComponents = {
  check: CheckCircle,
  clock: Clock,
  message: MessageSquare,
  book: BookOpen,
  calendar: Calendar,
  trending: TrendingUp,
};

const iconColors = {
  check: 'text-green-500',
  clock: 'text-blue-500',
  message: 'text-purple-500',
  book: 'text-orange-500',
  calendar: 'text-indigo-500',
  trending: 'text-pink-500',
};

export const RecentActivities: React.FC = () => {
  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Recent Activities
      </h3>
      <div className="space-y-4">
        {activities.map((activity, index) => {
          const IconComponent = iconComponents[activity.icon];
          const iconColor = iconColors[activity.icon];

          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div className={`flex-shrink-0 ${iconColor}`}>
                <IconComponent size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {activity.title}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {activity.description}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};