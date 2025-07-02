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
  SortDesc
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

interface Meeting {
  id: string;
  topic: string;
  start_time: string;
}

export const MeetingTranscripts: React.FC = () => {
  const { state, dispatch } = useApp();
  const [transcripts, setTranscripts] = useState<Transcript[]>([]);
  const [selectedTranscript, setSelectedTranscript] = useState<Transcript | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'zoom' | 'google-meet' | 'discord' | 'microsoft-teams'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'platform' | 'duration'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [showGenerateOptions, setShowGenerateOptions] = useState(false);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [selectedMeetingId, setSelectedMeetingId] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedMeetingId) return;
    setLoading(true);
    setTranscript(null);
    setError(null);
    fetch(`http://localhost:3001/api/zoom/transcript/${selectedMeetingId}`)
      .then(res => res.json())
      .then(data => {
        if (data.transcript) {
          setTranscript(typeof data.transcript === 'string' ? data.transcript : JSON.stringify(data.transcript));
        } else {
          setError(data.error || 'No transcript found');
        }
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch transcript');
        setLoading(false);
      });
  }, [selectedMeetingId]);

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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0"
      >
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Meeting Transcripts
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            View and analyze your meeting transcripts to generate learning materials and insights
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setSelectedMeetingId(null);
            setTranscript(null);
            setError(null);
          }}
          disabled={loading}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg hover:from-primary-600 hover:to-secondary-600 transition-all duration-200 disabled:opacity-50"
        >
          {loading ? (
            <span>Refreshing...</span>
          ) : (
            <>
              <Zap size={16} />
              <span>Refresh Transcripts</span>
            </>
          )}
        </motion.button>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search transcripts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            {/* Platform Filter */}
            <div className="flex items-center space-x-2">
              <Filter size={16} className="text-gray-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Platforms</option>
                <option value="zoom">Zoom</option>
                <option value="google-meet">Google Meet</option>
                <option value="discord">Discord</option>
                <option value="microsoft-teams">Microsoft Teams</option>
              </select>
            </div>

            {/* Sort Options */}
            <div className="flex items-center space-x-2">
              {sortDirection === 'asc' ? (
                <SortAsc size={16} className="text-gray-400" />
              ) : (
                <SortDesc size={16} className="text-gray-400" />
              )}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="date">Date</option>
                <option value="platform">Platform</option>
                <option value="duration">Duration</option>
              </select>
              <button
                onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
                className="p-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                {sortDirection === 'asc' ? <SortAsc size={16} /> : <SortDesc size={16} />}
              </button>
            </div>
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
              transition={{ delay: index * 0.05 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="flex-shrink-0 text-2xl">
                    {getPlatformIcon(transcript.platform)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                      {transcript.meetingTopic}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Calendar size={14} />
                        <span>{formatDistanceToNow(transcript.date, { addSuffix: true })}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock size={14} />
                        <span>{transcript.duration} min</span>
                      </div>
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs">
                        {getPlatformName(transcript.platform)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedTranscript(transcript)}
                    className="px-3 py-2 bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/30 transition-colors text-sm"
                  >
                    <FileText size={14} className="mr-1 inline-block" />
                    View
                  </motion.button>
                  
                  <div className="relative">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowGenerateOptions(transcript.id)}
                      className="px-3 py-2 bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/30 transition-colors text-sm"
                    >
                      <Zap size={14} className="mr-1 inline-block" />
                      Generate
                    </motion.button>
                    
                    <AnimatePresence>
                      {showGenerateOptions === transcript.id && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10"
                        >
                          <div className="p-1">
                            <button
                              onClick={() => handleGenerateFlashcards(transcript)}
                              className="flex items-center space-x-2 w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                            >
                              <BookOpen size={14} className="text-orange-500" />
                              <span>Flashcards</span>
                            </button>
                            <button
                              onClick={() => handleGenerateQuiz(transcript)}
                              className="flex items-center space-x-2 w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                            >
                              <HelpCircle size={14} className="text-green-500" />
                              <span>Quiz</span>
                            </button>
                            <button
                              onClick={() => handleGenerateEmail(transcript)}
                              className="flex items-center space-x-2 w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                            >
                              <Mail size={14} className="text-blue-500" />
                              <span>Email Summary</span>
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              {/* Preview of transcript content */}
              <div className="mt-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 text-sm text-gray-600 dark:text-gray-400 line-clamp-3 font-mono">
                {transcript.content.trim().split('\n').slice(0, 3).join('\n')}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {sortedTranscripts.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-8 border border-gray-200 dark:border-gray-700 shadow-lg text-center"
          >
            <FileText size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {searchTerm || filter !== 'all'
                ? 'No transcripts match your search criteria'
                : 'No meeting transcripts found. Join a meeting with recording enabled to generate transcripts.'}
            </p>
            {searchTerm || filter !== 'all' ? (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilter('all');
                }}
                className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                Clear Filters
              </button>
            ) : null}
          </motion.div>
        )}

        {loading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          </div>
        )}
      </div>

      {/* Transcript Viewer Modal */}
      <AnimatePresence>
        {selectedTranscript && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTranscript(null)}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{getPlatformIcon(selectedTranscript.platform)}</span>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {selectedTranscript.meetingTopic}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {formatDistanceToNow(selectedTranscript.date, { addSuffix: true })} • {selectedTranscript.duration} min
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedTranscript(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  ×
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <pre className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 font-mono text-sm leading-relaxed">
                  {selectedTranscript.content}
                </pre>
              </div>

              <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                <div className="flex items-center space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleCopyTranscript(selectedTranscript)}
                    className="flex items-center space-x-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <Copy size={16} />
                    <span>Copy</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDownloadTranscript(selectedTranscript)}
                    className="flex items-center space-x-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <Download size={16} />
                    <span>Download</span>
                  </motion.button>
                </div>
                <div className="flex items-center space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleGenerateFlashcards(selectedTranscript)}
                    className="flex items-center space-x-2 px-3 py-2 bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400 rounded-lg hover:bg-orange-200 dark:hover:bg-orange-900/30 transition-colors"
                  >
                    <BookOpen size={16} />
                    <span>Flashcards</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleGenerateQuiz(selectedTranscript)}
                    className="flex items-center space-x-2 px-3 py-2 bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/30 transition-colors"
                  >
                    <HelpCircle size={16} />
                    <span>Quiz</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleGenerateEmail(selectedTranscript)}
                    className="flex items-center space-x-2 px-3 py-2 bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/30 transition-colors"
                  >
                    <Mail size={16} />
                    <span>Email</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};