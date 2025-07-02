import React from 'react';
import { motion } from 'framer-motion';
import { Tool } from '../../types';
import { 
  BookOpen, 
  Search, 
  Calendar, 
  CheckSquare, 
  Clock, 
  MessageCircle,
  Settings,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

interface ToolCardProps {
  tool: Tool;
  index: number;
}

const iconComponents = {
  BookOpen,
  Search,
  Calendar,
  CheckSquare,
  Clock,
  MessageCircle,
  Settings,
};

const categoryColors = {
  education: 'from-primary-500 to-primary-600',
  productivity: 'from-secondary-500 to-secondary-600',
  email: 'from-blue-500 to-blue-600',
};

export const ToolCard: React.FC<ToolCardProps> = ({ tool, index }) => {
  const { dispatch } = useApp();
  const IconComponent = iconComponents[tool.icon as keyof typeof iconComponents] || Settings;

  const handleToggle = () => {
    dispatch({ type: 'TOGGLE_TOOL', payload: tool.id });
  };

  const handleConfigure = () => {
    // Track tool usage when configured/used
    dispatch({ 
      type: 'TRACK_TOOL_USAGE', 
      payload: { 
        toolId: tool.id, 
        success: Math.random() > 0.1 // 90% success rate for demo
      } 
    });
    
    // Simulate tool configuration/usage
    console.log(`Configuring ${tool.name}...`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-12 h-12 bg-gradient-to-br ${categoryColors[tool.category]} rounded-lg flex items-center justify-center`}>
            <IconComponent size={24} className="text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {tool.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
              {tool.category}
            </p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleToggle}
          className={`p-1 rounded-full transition-colors ${
            tool.isActive
              ? 'text-green-500 hover:text-green-600'
              : 'text-gray-400 hover:text-gray-500'
          }`}
        >
          {tool.isActive ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
        </motion.button>
      </div>

      <p className="text-gray-700 dark:text-gray-300 mb-4 text-sm leading-relaxed">
        {tool.description}
      </p>

      <div className="space-y-2">
        <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
          Features
        </h4>
        <ul className="space-y-1">
          {tool.features.map((feature, featureIndex) => (
            <li key={featureIndex} className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="w-1.5 h-1.5 bg-primary-500 rounded-full flex-shrink-0"></div>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            tool.isActive
              ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
              : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
          }`}>
            {tool.isActive ? 'Active' : 'Inactive'}
          </span>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-4 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg text-sm font-medium hover:from-primary-600 hover:to-secondary-600 transition-all duration-200"
            onClick={handleConfigure}
          >
            Configure
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};