import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Settings, 
  Bell, 
  Sun, 
  Moon, 
  Wifi, 
  WifiOff,
  Menu,
  X,
  LogOut,
  Loader
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useApp } from '../../contexts/AppContext';
import { zoomApi } from '../../services/zoomApi';
import toast from 'react-hot-toast';

interface HeaderProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ isMobileMenuOpen, setIsMobileMenuOpen, onLogout }) => {
  const { theme, toggleTheme } = useTheme();
  const { state, dispatch } = useApp();
  const [isConnecting, setIsConnecting] = useState(false);

  // Check if we're in a WebContainer environment
  const isWebContainer = window.location.origin.includes('webcontainer-api.io');

  const handleVideoMeetingToggle = async () => {
    if (state.isZoomConnected) {
      // Disconnect
      zoomApi.disconnect();
      dispatch({ type: 'TOGGLE_ZOOM_CONNECTION' });
      toast.success('Disconnected from Zoom');
      return;
    }

    // Connect to Zoom
    setIsConnecting(true);
    try {
      if (isWebContainer) {
        // For demo purposes in WebContainer
        await zoomApi.simulateConnection();
        dispatch({ type: 'TOGGLE_ZOOM_CONNECTION' });
        toast.success('Connected to Zoom (Demo Mode)');
        
        // Start monitoring for meetings and transcripts
        startMeetingMonitoring();
      } else {
        // Real OAuth flow
        const authUrl = await zoomApi.authorize();
        window.open(authUrl, '_blank', 'width=500,height=600');
        
        // Listen for the callback
        const handleMessage = (event: MessageEvent) => {
          if (event.data.type === 'ZOOM_AUTH_SUCCESS') {
            dispatch({ type: 'TOGGLE_ZOOM_CONNECTION' });
            toast.success('Successfully connected to Zoom!');
            startMeetingMonitoring();
            window.removeEventListener('message', handleMessage);
          }
        };

        window.addEventListener('message', handleMessage);
        
        // Cleanup listener after 5 minutes
        setTimeout(() => {
          window.removeEventListener('message', handleMessage);
        }, 300000);
      }
    } catch (error) {
      console.error('Error connecting to Zoom:', error);
      toast.error('Failed to connect to Zoom');
    } finally {
      setIsConnecting(false);
    }
  };

  const startMeetingMonitoring = async () => {
    try {
      // Get recent meetings
      const meetings = await zoomApi.getMeetings('live');
      
      // Monitor each live meeting for transcripts
      meetings.forEach(async (meeting) => {
        if (meeting.status === 'started' || meeting.status === 'ended') {
          // Try to get transcript
          const transcript = await zoomApi.getMeetingTranscript(meeting.id);
          if (transcript) {
            // Add meeting with transcript to state
            dispatch({
              type: 'ADD_MEETING',
              payload: {
                id: meeting.id,
                title: meeting.topic,
                date: new Date(meeting.start_time),
                duration: meeting.duration,
                transcript: transcript,
                participants: meeting.participants?.map(p => p.name) || [],
                status: meeting.status === 'started' ? 'in-progress' : 'completed'
              }
            });
            
            toast.success(`Transcript available for: ${meeting.topic}`);
          }
        }
      });

      // Set up webhook listener for real-time updates
      const handleWebhook = (event: CustomEvent) => {
        const webhookEvent = event.detail;
        
        if (webhookEvent.event === 'meeting.ended') {
          // Meeting ended, try to get transcript
          setTimeout(async () => {
            const transcript = await zoomApi.getMeetingTranscript(webhookEvent.payload.object.id);
            if (transcript) {
              dispatch({
                type: 'ADD_MEETING',
                payload: {
                  id: webhookEvent.payload.object.id,
                  title: webhookEvent.payload.object.topic,
                  date: new Date(webhookEvent.payload.object.start_time),
                  duration: webhookEvent.payload.object.duration,
                  transcript: transcript,
                  participants: [],
                  status: 'completed'
                }
              });
              
              toast.success(`Transcript ready for: ${webhookEvent.payload.object.topic}`);
            }
          }, 10000); // Wait 10 seconds for recording to be processed
        }
      };

      window.addEventListener('zoom-webhook', handleWebhook as EventListener);
      
      // Cleanup listener when component unmounts
      return () => {
        window.removeEventListener('zoom-webhook', handleWebhook as EventListener);
      };
    } catch (error) {
      console.error('Error starting meeting monitoring:', error);
    }
  };

  // Start monitoring when connected
  useEffect(() => {
    if (state.isZoomConnected) {
      startMeetingMonitoring();
    }
  }, [state.isZoomConnected]);

  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="flex items-center space-x-3">
              {/* Updated Logo */}
              <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg">
                <img 
                  src="/image.png" 
                  alt="FlowCraft Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  FlowCraft
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 -mt-1">
                  AI Productivity Suite
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Video Meeting Connection Status */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleVideoMeetingToggle}
              disabled={isConnecting}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                state.isZoomConnected
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                  : isConnecting
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
              }`}
            >
              {isConnecting ? (
                <Loader size={16} className="animate-spin" />
              ) : state.isZoomConnected ? (
                <Wifi size={16} />
              ) : (
                <WifiOff size={16} />
              )}
              <span className="hidden sm:inline">
                {isConnecting 
                  ? 'Connecting...' 
                  : state.isZoomConnected 
                    ? 'Connected' 
                    : 'Connect'
                }
              </span>
            </motion.button>

            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </motion.button>

            {/* Notifications */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors relative"
            >
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </motion.button>

            {/* User Menu */}
            <div className="flex items-center space-x-3">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {state.user?.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {state.user?.email}
                </p>
              </div>
              <div className="relative group">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-700"
                >
                  {state.user?.avatar ? (
                    <img 
                      src={state.user.avatar} 
                      alt={state.user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                      <User size={20} className="text-white" />
                    </div>
                  )}
                </motion.button>
                
                {/* Dropdown Menu */}
                {onLogout && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="py-2">
                      <button
                        onClick={onLogout}
                        className="w-full flex items-center space-x-2 px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <LogOut size={16} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};