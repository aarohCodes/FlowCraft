import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Search, 
  Calendar, 
  Clock, 
  Download,
  BookOpen,
  Mail,
  HelpCircle,
  Zap,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Copy,
  Filter,
  SortAsc,
  SortDesc,
  Users,
  Play,
  CheckCircle
} from 'lucide-react';
import { videoMeetingApi } from '../../services/videoMeetingApi';
import { zoomApi } from '../../services/zoomApi';
import { useApp } from '../../contexts/AppContext';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';

interface Transcript {
  id: string;
  meetingId: string;
  meetingTopic: string;
  platform: string;
  date: Date;
  content: string;
  duration: number;
  participants: number;
  isProcessed: boolean;
}

export const MeetingTranscripts: React.FC = () => {
  const { state, dispatch } = useApp();
  const [selectedTranscript, setSelectedTranscript] = useState<Transcript | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'zoom' | 'google-meet' | 'discord' | 'microsoft-teams'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'platform' | 'duration'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [showGenerateOptions, setShowGenerateOptions] = useState(false);

  // Convert meetings from state to transcripts format
  const transcripts: Transcript[] = state.meetings
    .filter(meeting => meeting.transcript) // Only show meetings with transcripts
    .map(meeting => ({
      id: meeting.id,
      meetingId: meeting.id,
      meetingTopic: meeting.title,
      platform: 'zoom', // Default to zoom for now
      date: meeting.date,
      content: meeting.transcript || '',
      duration: meeting.duration,
      participants: meeting.participants.length,
      isProcessed: true
    }));

  const handleGenerateFlashcards = async (transcript: Transcript) => {
    setLoading(true);
    try {
      const flashcards = await videoMeetingApi.generateFlashcardsFromMeeting(transcript.meetingId);
      
      flashcards.forEach(flashcard => {
        dispatch({
          type: 'ADD_FLASHCARD',
          payload: {
            id: Date.now().toString() + Math.random(),
            ...flashcard,
            correctCount: 0,
            totalAttempts: 0
          }
        });
      });
      
      toast.success(`Generated ${flashcards.length} flashcards from "${transcript.meetingTopic}"!`);
      setShowGenerateOptions(false);
    } catch (error) {
      console.error('Error generating flashcards:', error);
      toast.error('Failed to generate flashcards');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateQuiz = async (transcript: Transcript) => {
    setLoading(true);
    try {
      // In a real implementation, you would call an API to generate a quiz
      // For demo purposes, we'll just show a success message
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success(`Generated quiz from "${transcript.meetingTopic}"!`);
      setShowGenerateOptions(false);
    } catch (error) {
      console.error('Error generating quiz:', error);
      toast.error('Failed to generate quiz');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateEmail = async (transcript: Transcript) => {
    setLoading(true);
    try {
      // In a real implementation, you would call an API to generate an email
      // For demo purposes, we'll just show a success message
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success(`Generated email summary from "${transcript.meetingTopic}"!`);
      setShowGenerateOptions(false);
    } catch (error) {
      console.error('Error generating email:', error);
      toast.error('Failed to generate email');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyTranscript = (transcript: Transcript) => {
    navigator.clipboard.writeText(transcript.content);
    toast.success('Transcript copied to clipboard!');
  };

  const handleDownloadTranscript = (transcript: Transcript) => {
    const element = document.createElement('a');
    const file = new Blob([transcript.content], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${transcript.meetingTopic.replace(/\s+/g, '_')}_transcript.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success('Transcript downloaded!');
  };

  const filteredTranscripts = transcripts.filter(transcript => {
    const matchesSearch = transcript.meetingTopic.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transcript.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || transcript.platform === filter;
    return matchesSearch && matchesFilter;
  });

  const sortedTranscripts = [...filteredTranscripts].sort((a, b) => {
    let comparison = 0;
    
    if (sortBy === 'date') {
      comparison = a.date.getTime() - b.date.getTime();
    } else if (sortBy === 'platform') {
      comparison = a.platform.localeCompare(b.platform);
    } else if (sortBy === 'duration') {
      comparison = a.duration - b.duration;
    }
    
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'zoom': return '🔵';
      case 'google-meet': return '🟢';
      case 'discord': return '🟣';
      case 'microsoft-teams': return '🟦';
      default: return '📝';
    }
  };

  const getPlatformName = (platform: string) => {
    switch (platform) {
      case 'zoom': return 'Zoom';
      case 'google-meet': return 'Google Meet';
      case 'discord': return 'Discord';
      case 'microsoft-teams': return 'Microsoft Teams';
      default: return platform;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Meeting Transcripts
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {transcripts.length} transcript{transcripts.length !== 1 ? 's' : ''} available
          </p>
        </div>
        
        {transcripts.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center">
                <FileText size={20} className="text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                  No transcripts yet
                </h3>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Connect to Zoom and join meetings to see transcripts here
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {transcripts.length > 0 && (
        <>
          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              {/* Enhanced Search with Animations */}
              <div className="relative flex-1 max-w-md">
                <Search size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <motion.input
                  initial={{ boxShadow: "0 0 0 rgba(59, 130, 246, 0)" }}
                  whileFocus={{ boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.3)" }}
                  type="text"
                  placeholder="Search transcripts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* Enhanced Filters with Micro-animations */}
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Filter size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value as any)}
                    className="pl-10 pr-8 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none cursor-pointer"
                  >
                    <option value="all">All Platforms</option>
                    <option value="zoom">Zoom</option>
                    <option value="google-meet">Google Meet</option>
                    <option value="discord">Discord</option>
                    <option value="microsoft-teams">Microsoft Teams</option>
                  </select>
                </div>

                <div className="relative">
                  <button
                    onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
                    className="p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    {sortDirection === 'asc' ? <SortAsc size={16} /> : <SortDesc size={16} />}
                  </button>
                </div>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none cursor-pointer"
                >
                  <option value="date">Date</option>
                  <option value="platform">Platform</option>
                  <option value="duration">Duration</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Transcripts List */}
          <div className="space-y-4">
            <AnimatePresence>
              {sortedTranscripts.map((transcript, index) => (
                <motion.div
                  key={transcript.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-xl">
                          {getPlatformIcon(transcript.platform)}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                            {transcript.meetingTopic}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                            <span className="flex items-center space-x-1">
                              <Calendar size={14} />
                              <span>{formatDistanceToNow(transcript.date, { addSuffix: true })}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Clock size={14} />
                              <span>{Math.floor(transcript.duration / 60)}m {transcript.duration % 60}s</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Users size={14} />
                              <span>{transcript.participants} participants</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                              <span>Processed</span>
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleCopyTranscript(transcript)}
                          className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                          <Copy size={16} />
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleDownloadTranscript(transcript)}
                          className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                          <Download size={16} />
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSelectedTranscript(selectedTranscript?.id === transcript.id ? null : transcript)}
                          className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                          {selectedTranscript?.id === transcript.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </motion.button>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-3 mb-4">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowGenerateOptions(true)}
                        className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg hover:from-primary-600 hover:to-secondary-600 transition-all duration-200 text-sm font-medium"
                      >
                        <Zap size={16} />
                        <span>Generate Content</span>
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleGenerateFlashcards(transcript)}
                        className="flex items-center space-x-2 px-4 py-2 bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 rounded-lg hover:bg-orange-200 dark:hover:bg-orange-900/30 transition-colors text-sm font-medium"
                      >
                        <BookOpen size={16} />
                        <span>Flashcards</span>
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleGenerateEmail(transcript)}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/30 transition-colors text-sm font-medium"
                      >
                        <Mail size={16} />
                        <span>Email Summary</span>
                      </motion.button>
                    </div>

                    {/* Transcript Content */}
                    <AnimatePresence>
                      {selectedTranscript?.id === transcript.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600"
                        >
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                            Transcript Content
                          </h4>
                          <div className="max-h-64 overflow-y-auto text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                            {transcript.content}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </>
      )}

      {/* Generate Options Modal */}
      <AnimatePresence>
        {showGenerateOptions && selectedTranscript && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowGenerateOptions(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Generate Content from Transcript
              </h3>
              
              <div className="space-y-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleGenerateFlashcards(selectedTranscript)}
                  disabled={loading}
                  className="w-full flex items-center space-x-3 p-4 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors"
                >
                  <BookOpen size={20} />
                  <div className="text-left">
                    <div className="font-medium">Flashcards</div>
                    <div className="text-sm opacity-75">Create study cards from key points</div>
                  </div>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleGenerateQuiz(selectedTranscript)}
                  disabled={loading}
                  className="w-full flex items-center space-x-3 p-4 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
                >
                  <HelpCircle size={20} />
                  <div className="text-left">
                    <div className="font-medium">Quiz</div>
                    <div className="text-sm opacity-75">Generate questions from content</div>
                  </div>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleGenerateEmail(selectedTranscript)}
                  disabled={loading}
                  className="w-full flex items-center space-x-3 p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                >
                  <Mail size={20} />
                  <div className="text-left">
                    <div className="font-medium">Email Summary</div>
                    <div className="text-sm opacity-75">Create meeting summary email</div>
                  </div>
                </motion.button>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowGenerateOptions(false)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};