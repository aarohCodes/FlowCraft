import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SocialMediaDashboard } from '../components/Social/SocialMediaDashboard';
import { useApp } from '../contexts/AppContext';
import { Sparkles, Crown } from 'lucide-react';

export const Social: React.FC = () => {
  const { state } = useApp();
  
  const isSocialUnlocked = state.isPremiumUser || state.unlockedFeatures.includes('Social Media Management');

  if (!isSocialUnlocked) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-8 border border-gray-200 dark:border-gray-700 shadow-lg text-center max-w-md"
        >
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Crown size={32} className="text-white" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Premium Feature
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Social Media Management is a premium feature. Please start your free trial to access this functionality.
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
    <div className="space-y-6">
      {/* Premium Feature Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800"
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Sparkles size={20} className="text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Social Media Management Unlocked!
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              You now have access to AI-powered social media tools and content creation.
            </p>
          </div>
        </div>
      </motion.div>

      <SocialMediaDashboard />
    </div>
  );
};