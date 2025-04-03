const express = require('express');
const InnerTube = require('innertube.js');
const cors = require('cors');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS
app.use(cors());

// Initialize InnerTube
const yt = new InnerTube();

// Basic route for checking if API is running
app.get('/', (req, res) => {
  res.json({ status: 'YouTube Streams API is running' });
});

// Route to get video streams by ID
app.get('/streams/:id', async (req, res) => {
  try {
    const videoId = req.params.id;
    
    // Validate videoId format (basic validation)
    if (!videoId || !videoId.match(/^[a-zA-Z0-9_-]{11}$/)) {
      return res.status(400).json({ 
        error: 'Invalid YouTube video ID format' 
      });
    }
    
    // Get video player information using InnerTube
    const playerInfo = await yt.player({ videoId });
    
    // Extract stream data
    const streamData = {
      videoId: videoId,
      title: playerInfo.videoDetails?.title || 'Unknown',
      author: playerInfo.videoDetails?.author || 'Unknown',
      lengthSeconds: playerInfo.videoDetails?.lengthSeconds || 0,
      formats: playerInfo.streamingData?.formats || [],
      adaptiveFormats: playerInfo.streamingData?.adaptiveFormats || [],
    };
    
    res.json(streamData);
  } catch (error) {
    console.error('Error fetching video streams:', error);
    res.status(500).json({ 
      error: 'Failed to fetch video streams', 
      message: error.message 
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
