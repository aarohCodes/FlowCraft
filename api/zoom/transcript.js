import axios from 'axios';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { meetingId } = req.query;
      const accessToken = req.headers.authorization?.replace('Bearer ', '');

      if (!meetingId) {
        return res.status(400).json({ error: 'Meeting ID is required' });
      }

      if (!accessToken) {
        return res.status(401).json({ error: 'Access token is required' });
      }

      // Get meeting recordings first
      const recordingsResponse = await axios.get(
        `https://api.zoom.us/v2/meetings/${meetingId}/recordings`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      const recordings = recordingsResponse.data.recording_files || [];
      const transcriptFile = recordings.find(r => r.file_type === 'TRANSCRIPT');

      if (!transcriptFile) {
        return res.status(404).json({ error: 'No transcript found for this meeting' });
      }

      // Get the transcript content
      const transcriptResponse = await axios.get(transcriptFile.download_url, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      res.status(200).json({
        transcript: transcriptResponse.data,
        meetingId,
        recordingId: transcriptFile.id
      });

    } catch (error) {
      console.error('Error fetching transcript:', error.response?.data || error.message);
      
      if (error.response?.status === 404) {
        return res.status(404).json({ error: 'Meeting or transcript not found' });
      }
      
      res.status(500).json({ 
        error: 'Failed to fetch transcript',
        details: error.response?.data || error.message
      });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 