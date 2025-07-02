import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gmailApi } from '../../services/gmailApi';
import toast from 'react-hot-toast';

export const GmailCallback: React.FC = () => {
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const error = urlParams.get('error');

        if (error) {
          console.error('Gmail OAuth error:', error);
          setStatus('error');
          setErrorMessage(`Authentication failed: ${error}`);
          return;
        }

        if (!code) {
          setStatus('error');
          setErrorMessage('No authorization code received');
          return;
        }

        // Exchange code for token
        await gmailApi.exchangeCodeForToken(code);
        
        setStatus('success');
        
        // Notify parent window if this is opened in a popup
        if (window.opener) {
          window.opener.postMessage({
            type: 'GMAIL_AUTH_SUCCESS'
          }, '*');
          
          // Close popup after a short delay
          setTimeout(() => window.close(), 2000);
        } else {
          // Navigate back to email dashboard
          toast.success('Gmail connected successfully!');
          setTimeout(() => navigate('/email'), 2000);
        }
      } catch (error) {
        console.error('Error during Gmail authentication:', error);
        setStatus('error');
        setErrorMessage('Failed to authenticate with Gmail. Please try again.');
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 max-w-md w-full text-center">
        {status === 'processing' && (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Connecting to Gmail...
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Please wait while we complete the authentication process.
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Successfully Connected!
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Your Gmail account has been connected successfully.
            </p>
            {window.opener ? (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                This window will close automatically...
              </p>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                Redirecting back to dashboard...
              </p>
            )}
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Connection Failed
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {errorMessage}
            </p>
            <button
              onClick={() => navigate('/email')}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Return to Email Dashboard
            </button>
          </>
        )}
      </div>
    </div>
  );
};