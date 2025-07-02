import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Video, 
  Users, 
  Calendar, 
  Download,
  Play,
  Pause,
  FileText,
  BookOpen,
  Zap,
  Clock,
  MessageSquare,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  ExternalLink,
  Settings,
  Info
} from 'lucide-react';
import { zoomApi, ZoomMeeting, ZoomParticipant } from '../../services/zoomApi';
import { useApp } from '../../contexts/AppContext';
import toast from 'react-hot-toast';

export const ZoomIntegration: React.FC = () => {
  const { state, dispatch } = useApp();
  const [meetings, setMeetings] = useState<ZoomMeeting[]>([]);
  const [activeMeeting, setActiveMeeting] = useState<ZoomMeeting | null>(null);
  const [participants, setParticipants] = useState<ZoomParticipant[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState<any>(null);
  const [showSetupInstructions, setShowSetupInstructions] = useState(false);

  useEffect(() => {
    if (state.isZoomConnected) {
      loadMeetings();
    }
  }, [state.isZoomConnected]);

  const handleConnect = async () => {
    try {
      // Check if we're in a WebContainer environment
      if (window.location.origin.includes('webcontainer-api.io')) {
        setShowSetupInstructions(true);
        return;
      }

      const authUrl = await zoomApi.authorize();
      
      if (authUrl.includes('marketplace.zoom.us')) {
        // Show setup instructions instead of trying to open OAuth
        setShowSetupInstructions(true);
        return;
      }

      window.open(authUrl, '_blank', 'width=500,height=600');
      
      // Listen for the callback
      const handleMessage = (event: MessageEvent) => {
        if (event.data.type === 'ZOOM_AUTH_SUCCESS') {
          dispatch({ type: 'TOGGLE_ZOOM_CONNECTION' });
          toast.success('Successfully connected to Zoom!');
          loadMeetings();
        }
      };

      window.addEventListener('message', handleMessage);
      
      // Cleanup listener after 5 minutes
      setTimeout(() => {
        window.removeEventListener('message', handleMessage);
      }, 300000);
    } catch (error) {
      toast.error('Failed to connect to Zoom');
      console.error('Zoom connection error:', error);
    }
  };

  const handleDisconnect = () => {
    zoomApi.disconnect();
    dispatch({ type: 'TOGGLE_ZOOM_CONNECTION' });
    setMeetings([]);
    setActiveMeeting(null);
    setParticipants([]);
    setIsMonitoring(false);
    toast.success('Disconnected from Zoom');
  };

  const loadMeetings = async () => {
    setLoading(true);
    try {
      const [scheduled, live] = await Promise.all([
        zoomApi.getMeetings('scheduled'),
        zoomApi.getMeetings('live')
      ]);
      setMeetings([...live, ...scheduled]);
    } catch (error) {
      toast.error('Failed to load meetings');
      console.error('Error loading meetings:', error);
    } finally {
      setLoading(false);
    }
  };

  const startMonitoring = async (meeting: ZoomMeeting) => {
    setActiveMeeting(meeting);
    setIsMonitoring(true);
    
    try {
      await zoomApi.startRealTimeMonitoring(meeting.id, (data) => {
        setParticipants(data.participants);
        // Update meeting status if needed
        if (data.meeting.status !== meeting.status) {
          setActiveMeeting(data.meeting);
        }
      });
      
      toast.success(`Monitoring ${meeting.topic}`);
    } catch (error) {
      toast.error('Failed to start monitoring');
      console.error('Monitoring error:', error);
      setIsMonitoring(false);
    }
  };

  const stopMonitoring = () => {
    zoomApi.stopRealTimeMonitoring();
    setIsMonitoring(false);
    setActiveMeeting(null);
    setParticipants([]);
    toast.success('Stopped monitoring');
  };

  const generateInsights = async (meeting: ZoomMeeting) => {
    setLoading(true);
    try {
      const meetingInsights = await zoomApi.generateMeetingInsights(meeting.id);
      setInsights(meetingInsights);
      toast.success('Meeting insights generated!');
    } catch (error) {
      toast.error('Failed to generate insights');
      console.error('Insights error:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateFlashcards = async (meeting: ZoomMeeting) => {
    setLoading(true);
    try {
      const flashcards = await zoomApi.generateFlashcardsFromMeeting(meeting.id);
      
      // Add flashcards to the app state
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
      
      toast.success(`Generated ${flashcards.length} flashcards from meeting!`);
    } catch (error) {
      toast.error('Failed to generate flashcards');
      console.error('Flashcard generation error:', error);
    } finally {
      setLoading(false);
    }
  };

  const createMeeting = async () => {
    try {
      const meeting = await zoomApi.createMeeting({
        topic: 'FlowCraft Meeting',
        type: 2, // Scheduled meeting
        start_time: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
        duration: 60,
        agenda: 'Meeting created from FlowCraft'
      });
      
      setMeetings(prev => [meeting, ...prev]);
      toast.success('Meeting created successfully!');
    } catch (error) {
      toast.error('Failed to create meeting');
      console.error('Meeting creation error:', error);
    }
  };

  // Setup Instructions Modal
  if (showSetupInstructions) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-8 border border-gray-200 dark:border-gray-700 shadow-lg"
      >
        <div className="flex items-center space-x-3 mb-6">
          <Settings size={24} className="text-blue-500" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Zoom Setup Required
          </h3>
        </div>
        
        <div className="space-y-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
            <div className="flex items-start space-x-3">
              <Info size={20} className="text-blue-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-blue-900 dark:text-blue-400 mb-2">
                  WebContainer Environment Detected
                </h4>
                <p className="text-blue-800 dark:text-blue-300 text-sm">
                  Due to the dynamic nature of this environment, you'll need to update your Zoom app settings.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 dark:text-white">
              To connect your real Zoom account:
            </h4>
            <ol className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-medium">1</span>
                <div>
                  <p>Go to <a href="https://marketplace.zoom.us/develop/apps" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Zoom Marketplace</a></p>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-medium">2</span>
                <div>
                  <p>Select your app with Client ID: <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs">{import.meta.env.VITE_ZOOM_CLIENT_ID}</code></p>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-medium">3</span>
                <div>
                  <p>Update the Redirect URI to:</p>
                  <code className="block bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded mt-1 text-xs break-all">
                    {window.location.origin}/zoom/callback
                  </code>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-medium">4</span>
                <div>
                  <p>Save the changes and try connecting again</p>
                </div>
              </li>
            </ol>
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setShowSetupInstructions(false)}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              Cancel
            </button>
            <div className="flex items-center space-x-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleConnect}
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 font-medium"
              >
                Try Again
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  if (!state.isZoomConnected) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-8 border border-gray-200 dark:border-gray-700 shadow-lg text-center"
      >
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Video size={32} className="text-white" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Connect to Zoom
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Connect your Zoom account to enable real-time meeting monitoring, 
          transcript analysis, and AI-powered insights.
        </p>
        <div className="flex items-center justify-center space-x-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleConnect}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 font-semibold"
          >
            Connect Zoom Account
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-gray-900 dark:text-white font-medium">
              Connected to Zoom {zoomApi.isConnected() && localStorage.getItem('zoom_access_token') === 'mock_access_token_for_demo' && '(Demo Mode)'}
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={createMeeting}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Create Meeting
            </motion.button>
            <button
              onClick={handleDisconnect}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Disconnect
            </button>
          </div>
        </div>
      </div>

      {/* Active Monitoring */}
      {isMonitoring && activeMeeting && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Monitoring: {activeMeeting.topic}
              </h3>
            </div>
            <button
              onClick={stopMonitoring}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Stop Monitoring
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Users size={16} className="text-blue-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {participants.length} participants
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock size={16} className="text-green-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {activeMeeting.status}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap size={16} className="text-purple-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Real-time processing
              </span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Meetings List */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Your Meetings
          </h3>
          <button
            onClick={loadMeetings}
            disabled={loading}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>

        <div className="space-y-4">
          {meetings.map((meeting) => (
            <motion.div
              key={meeting.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {meeting.topic}
                  </h4>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                    <span className="flex items-center space-x-1">
                      <Calendar size={14} />
                      <span>{new Date(meeting.start_time).toLocaleString()}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock size={14} />
                      <span>{meeting.duration} min</span>
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      meeting.status === 'started' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                        : meeting.status === 'ended'
                        ? 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                    }`}>
                      {meeting.status}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {meeting.status === 'started' && !isMonitoring && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => startMonitoring(meeting)}
                      className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                    >
                      <Play size={14} className="mr-1" />
                      Monitor
                    </motion.button>
                  )}
                  
                  {meeting.status === 'ended' && (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => generateInsights(meeting)}
                        disabled={loading}
                        className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm disabled:opacity-50"
                      >
                        <TrendingUp size={14} className="mr-1" />
                        Insights
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => generateFlashcards(meeting)}
                        disabled={loading}
                        className="px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm disabled:opacity-50"
                      >
                        <BookOpen size={14} className="mr-1" />
                        Flashcards
                      </motion.button>
                    </>
                  )}
                  
                  <a
                    href={meeting.join_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm"
                  >
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
          
          {meetings.length === 0 && !loading && (
            <div className="text-center py-8">
              <Video size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                No meetings found. Create a meeting to get started.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Meeting Insights */}
      <AnimatePresence>
        {insights && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Meeting Insights
              </h3>
              <button
                onClick={() => setInsights(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                ×
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">Summary</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {insights.summary}
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">Key Points</h4>
                <ul className="space-y-2">
                  {insights.keyPoints.map((point: string, index: number) => (
                    <li key={index} className="flex items-start space-x-2 text-sm">
                      <CheckCircle size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600 dark:text-gray-400">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">Action Items</h4>
                <ul className="space-y-2">
                  {insights.actionItems.map((item: string, index: number) => (
                    <li key={index} className="flex items-start space-x-2 text-sm">
                      <AlertCircle size={14} className="text-orange-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600 dark:text-gray-400">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">Meeting Stats</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Duration:</span>
                    <span className="text-gray-900 dark:text-white">{Math.round(insights.duration / 60)} min</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Participants:</span>
                    <span className="text-gray-900 dark:text-white">{insights.participants.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Sentiment:</span>
                    <span className={`font-medium ${
                      insights.sentiment === 'positive' ? 'text-green-600' :
                      insights.sentiment === 'negative' ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {insights.sentiment}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};