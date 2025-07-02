import React, { useEffect } from 'react';
import { zoomApi, ZoomWebhookEvent } from '../../services/zoomApi';
import { useApp } from '../../contexts/AppContext';
import toast from 'react-hot-toast';

export const ZoomWebhookHandler: React.FC = () => {
  const { dispatch } = useApp();

  useEffect(() => {
    // Set up webhook event listener
    const handleWebhookEvent = (event: CustomEvent<ZoomWebhookEvent>) => {
      const webhookEvent = event.detail;
      
      switch (webhookEvent.event) {
        case 'meeting.started':
          toast.success(`Meeting "${webhookEvent.payload.object.topic}" has started`);
          break;
          
        case 'meeting.ended':
          toast.info(`Meeting "${webhookEvent.payload.object.topic}" has ended`);
          // Automatically generate insights and flashcards
          setTimeout(async () => {
            try {
              const insights = await zoomApi.generateMeetingInsights(webhookEvent.payload.object.id);
              const flashcards = await zoomApi.generateFlashcardsFromMeeting(webhookEvent.payload.object.id);
              
              // Add flashcards to app state
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
              console.error('Auto-processing error:', error);
            }
          }, 5000); // Wait 5 seconds for recording to be ready
          break;
          
        case 'recording.completed':
          toast.success('Meeting recording is ready for processing');
          break;
          
        case 'meeting.participant_joined':
          // Handle participant events if needed
          break;
          
        default:
          console.log('Unhandled webhook event:', webhookEvent.event);
      }
    };

    // Listen for webhook events
    window.addEventListener('zoom-webhook', handleWebhookEvent as EventListener);

    return () => {
      window.removeEventListener('zoom-webhook', handleWebhookEvent as EventListener);
    };
  }, [dispatch]);

  // This component doesn't render anything visible
  return null;
};