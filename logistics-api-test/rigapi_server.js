const express = require('express');
const axios = require('axios');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = 3000;

const API_KEY = process.env.API_KEY;
const USDOT = process.env.USDOT;

app.use(express.static(__dirname));

// Serve login page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'rigapi_test.html'));
});

// PIN-based access to chat
app.get('/chat', (req, res) => {
  const pin = req.query.pin;
  if (pin === '1234') {
    res.sendFile(path.join(__dirname, 'rigapi_login.html'));
  } else {
    res.redirect('/?error=1');
  }
});

// Utility function for API requests
const fetchRigbotData = async (type) => {
  const url = `https://api.rigbot.com/assetdata/${type}/${USDOT}`;
  return axios.get(url, {
    headers: {
      'x-api-key': API_KEY,
      'accept': 'application/json',
    },
  });
};

// Unified route handler
const handleAssetRequest = (type) => async (req, res) => {
  try {
    const response = await fetchRigbotData(type);
    console.log(`${type.charAt(0).toUpperCase() + type.slice(1)} data:`, response.data);

    res.json({
      success: true,
      data: response.data,
    });
  } catch (error) {
    console.error(`Error fetching ${type}:`, error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      success: false,
      message: error.message,
      details: error.response?.data || {},
    });
  }
};

// API endpoints
app.get('/api/drivers', handleAssetRequest('drivers'));
app.get('/api/trucks', handleAssetRequest('trucks'));
app.get('/api/trailers', handleAssetRequest('trailers'));

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
