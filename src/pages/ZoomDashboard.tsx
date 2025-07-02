import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { VideoMeetingIntegration } from '../components/VideoMeeting/VideoMeetingIntegration';
import { MeetingTranscripts } from '../components/VideoMeeting/MeetingTranscripts';
import { FileText, Video, Calendar, Users } from 'lucide-react';

export const ZoomDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'meetings' | 'transcripts'>('meetings');

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Online/Video Meeting Integration
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          Connect your video meeting platforms (Zoom, Google Meet, Discord, Microsoft Teams) to enable 
          real-time monitoring, automatic transcript processing, and AI-powered insights generation 
          from all your meetings.
        </p>
      </motion.div>

      {/* Supported Platforms */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">
          Supported Platforms
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center justify-center space-x-2 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
            <span className="text-2xl">🔵</span>
            <span className="font-medium text-gray-900 dark:text-white">Zoom</span>
          </div>
          <div className="flex items-center justify-center space-x-2 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
            <span className="text-2xl">🟢</span>
            <span className="font-medium text-gray-900 dark:text-white">Google Meet</span>
          </div>
          <div className="flex items-center justify-center space-x-2 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
            <span className="text-2xl">🟣</span>
            <span className="font-medium text-gray-900 dark:text-white">Discord</span>
          </div>
          <div className="flex items-center justify-center space-x-2 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
            <span className="text-2xl">🟦</span>
            <span className="font-medium text-gray-900 dark:text-white">Teams</span>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex space-x-2 mb-8 bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
        <button
          onClick={() => setActiveTab('meetings')}
          className={`flex items-center space-x-2 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 flex-1 justify-center relative ${
            activeTab === 'meetings'
              ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-soft'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-600/50'
          }`}
        >
          {activeTab === 'meetings' && (
            <motion.div
              layoutId="activeVideoTab"
              className="absolute inset-0 bg-white dark:bg-gray-600 rounded-lg shadow-soft"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
          <div className="relative z-10 flex items-center space-x-2">
            <Video size={16} />
            <span>Meetings</span>
          </div>
        </button>
        
        <button
          onClick={() => setActiveTab('transcripts')}
          className={`flex items-center space-x-2 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 flex-1 justify-center relative ${
            activeTab === 'transcripts'
              ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-soft'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-600/50'
          }`}
        >
          {activeTab === 'transcripts' && (
            <motion.div
              layoutId="activeVideoTab"
              className="absolute inset-0 bg-white dark:bg-gray-600 rounded-lg shadow-soft"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
          <div className="relative z-10 flex items-center space-x-2">
            <FileText size={16} />
            <span>Transcripts</span>
          </div>
        </button>
      </div>

      {/* Content based on active tab */}
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
        {activeTab === 'meetings' ? <VideoMeetingIntegration /> : <MeetingTranscripts />}
      </motion.div>
    </div>
  );
};