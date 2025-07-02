import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Loader } from 'lucide-react';
import { zoomApi } from '../services/zoomApi';

export const ZoomCallback: React.FC = () => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Connecting to Zoom...');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const error = urlParams.get('error');

        if (error) {
          setStatus('error');
          setMessage('Authentication failed. Please try again.');
          return;
        }

        if (!code) {
          setStatus('error');
          setMessage('No authorization code received.');
          return;
        }

        // Exchange code for token
        await zoomApi.exchangeCodeForToken(code);
        
        setStatus('success');
        setMessage('Successfully connected to Zoom!');

        // Notify parent window
        if (window.opener) {
          window.opener.postMessage({ type: 'ZOOM_AUTH_SUCCESS' }, '*');
          
          // Close this window after a short delay
          setTimeout(() => {
            window.close();
          }, 2000);
        }
      } catch (error) {
        console.error('Error in Zoom callback:', error);
        setStatus('error');
        setMessage('Failed to complete authentication. Please try again.');
      }
    };

    handleCallback();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-200 dark:border-gray-700 shadow-2xl text-center max-w-md w-full"
      >
        <div className="mb-6">
          {status === 'loading' && (
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Loader size={32} className="text-blue-500 animate-spin" />
            </div>
          )}
          {status === 'success' && (
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} className="text-green-500" />
            </div>
          )}
          {status === 'error' && (
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle size={32} className="text-red-500" />
            </div>
          )}
        </div>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {status === 'loading' && 'Connecting to Zoom'}
          {status === 'success' && 'Connection Successful'}
          {status === 'error' && 'Connection Failed'}
        </h2>

        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {message}
        </p>

        {status === 'success' && (
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 mb-6">
            <p className="text-sm text-green-700 dark:text-green-400">
              This window will close automatically. You can now return to FlowCraft and start monitoring your meetings!
            </p>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-4">
            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
              <p className="text-sm text-red-700 dark:text-red-400">
                Please try connecting again from the main application.
              </p>
            </div>
            <button
              onClick={() => window.close()}
              className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Close Window
            </button>
          </div>
        )}

        {status === 'loading' && (
          <div className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <p className="text-sm text-blue-700 dark:text-blue-400">
                Please wait while we complete the authentication process...
              </p>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};