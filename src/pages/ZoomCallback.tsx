import React, { useEffect } from 'react';
import { zoomApi } from '../services/zoomApi';

export const ZoomCallback: React.FC = () => {
  useEffect(() => {
    const handleCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const error = urlParams.get('error');

      if (error) {
        console.error('Zoom OAuth error:', error);
        window.opener?.postMessage({ type: 'ZOOM_AUTH_ERROR', error }, '*');
        window.close();
        return;
      }

      if (code) {
        try {
          await zoomApi.exchangeCodeForToken(code);
          window.opener?.postMessage({ type: 'ZOOM_AUTH_SUCCESS' }, '*');
          window.close();
        } catch (error) {
          console.error('Token exchange error:', error);
          window.opener?.postMessage({ type: 'ZOOM_AUTH_ERROR', error }, '*');
          window.close();
        }
      }
    };

    handleCallback();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Connecting to Zoom...</p>
      </div>
    </div>
  );
};