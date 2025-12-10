const http = require('http');
const https = require('https');

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { url } = req.query;
  
  if (!url) {
    return res.status(400).json({ error: 'URL parameter required' });
  }

  try {
    const result = await checkServerStatus(url);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ 
      status: 'down', 
      responseTime: 0, 
      uptime: 0,
      error: error.message 
    });
  }
};

function checkServerStatus(url) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    const protocol = url.startsWith('https') ? https : http;
    
    const request = protocol.get(url, { timeout: 5000 }, (response) => {
      const responseTime = Date.now() - startTime;
      
      // Konsumsi response data untuk mencegah memory leak
      response.on('data', () => {});
      response.on('end', () => {
        resolve({
          status: 'operational',
          responseTime: responseTime,
          uptime: 99.9,
          statusCode: response.statusCode
        });
      });
    });

    request.on('timeout', () => {
      request.destroy();
      resolve({
        status: 'slow',
        responseTime: 5000,
        uptime: 85
      });
    });

    request.on('error', (error) => {
      const responseTime = Date.now() - startTime;
      resolve({
        status: 'down',
        responseTime: responseTime,
        uptime: 0,
        error: error.message
      });
    });
  });
}
