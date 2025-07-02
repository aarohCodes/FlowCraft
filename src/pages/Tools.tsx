import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ToolCard } from '../components/Tools/ToolCard';
import { useApp } from '../contexts/AppContext';
import { Sparkles, Zap, MessageCircle, Search, Crown } from 'lucide-react';

export const Tools: React.FC = () => {
  const { state } = useApp();
  const [showAIAssistant, setShowAIAssistant] = useState(false);

  const toolsByCategory = {
    education: state.tools.filter(tool => tool.category === 'education'),
    productivity: state.tools.filter(tool => tool.category === 'productivity'),
    social: state.tools.filter(tool => tool.category === 'social'),
  };

  const categoryLabels = {
    education: 'Education Suite',
    productivity: 'Productivity Tools',
    social: 'Social Media Integration',
  };

  const categoryDescriptions = {
    education: 'Enhance your learning with AI-powered educational tools',
    productivity: 'Streamline your workflow and boost productivity',
    social: 'Manage and optimize your social media presence',
  };

  const isAIToolsUnlocked = state.isPremiumUser || state.unlockedFeatures.includes('AI Tools');
  const isAIAssistantUnlocked = state.isPremiumUser || state.unlockedFeatures.includes('AI Assistant');

  if (!isAIToolsUnlocked) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-8 border border-gray-200 dark:border-gray-700 shadow-lg text-center max-w-md"
        >
          <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Crown size={32} className="text-white" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Premium Feature
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            AI Tools is a premium feature. Please start your free trial to access this functionality.
          </p>
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Go Back
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          AI-Powered Tools
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          Discover and activate powerful AI tools designed to enhance your productivity, 
          learning, and social media management. Each tool integrates seamlessly with your 
          Zoom meetings and daily workflow.
        </p>
      </motion.div>

      {/* Premium Feature Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-indigo-200 dark:border-indigo-800"
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
            <Sparkles size={20} className="text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              AI Tools Unlocked!
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              You now have access to all AI-powered tools and advanced features.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Premium AI Assistant */}
      {isAIAssistantUnlocked && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                <Zap size={20} className="text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  AI Assistant Ready!
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Access advanced AI capabilities for intelligent insights and automation.
                </p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAIAssistant(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg hover:from-green-600 hover:to-blue-600 transition-all duration-200"
            >
              <Zap size={16} />
              <span>Open AI Assistant</span>
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* AI Assistant Interface */}
      {showAIAssistant && isAIAssistantUnlocked && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              AI Assistant
            </h3>
            <button
              onClick={() => setShowAIAssistant(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              ×
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="relative">
              <MessageCircle size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Ask me anything or describe what you need help with..."
                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-left hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                <h4 className="font-medium text-blue-900 dark:text-blue-400 mb-1">Smart Scheduling</h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">Optimize your calendar and find the best meeting times</p>
              </button>
              
              <button className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-left hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
                <h4 className="font-medium text-green-900 dark:text-green-400 mb-1">Content Analysis</h4>
                <p className="text-sm text-green-700 dark:text-green-300">Analyze documents and extract key insights</p>
              </button>
              
              <button className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-left hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors">
                <h4 className="font-medium text-purple-900 dark:text-purple-400 mb-1">Workflow Automation</h4>
                <p className="text-sm text-purple-700 dark:text-purple-300">Automate repetitive tasks and processes</p>
              </button>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowAIAssistant(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                Close
              </button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg hover:from-green-600 hover:to-blue-600 transition-all duration-200"
              >
                <Sparkles size={16} />
                <span>Process Request</span>
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Tools by Category */}
      {Object.entries(toolsByCategory).map(([category, tools], categoryIndex) => (
        <motion.section
          key={category}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: categoryIndex * 0.1 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {categoryLabels[category as keyof typeof categoryLabels]}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {categoryDescriptions[category as keyof typeof categoryDescriptions]}
              </p>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {tools.filter(tool => tool.isActive).length} of {tools.length} active
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool, toolIndex) => (
              <ToolCard key={tool.id} tool={tool} index={toolIndex} />
            ))}
          </div>
        </motion.section>
      ))}

      {/* Integration Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-xl p-8 border border-primary-200 dark:border-primary-800"
      >
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Seamless Zoom Integration
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            All tools work together with your Zoom meetings to provide real-time insights, 
            automated note-taking, and intelligent content generation based on your conversations.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center justify-center space-x-2 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-700 dark:text-gray-300">Real-time Processing</span>
            </div>
            <div className="flex items-center justify-center space-x-2 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-gray-700 dark:text-gray-300">Auto-generated Content</span>
            </div>
            <div className="flex items-center justify-center space-x-2 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-gray-700 dark:text-gray-300">Smart Insights</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};