module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Parse website config dari environment variables
  const websites = [];
  
  // Format: SITE_1_NAME, SITE_1_URL, SITE_1_IP, SITE_1_CHECK_URL, SITE_1_CATEGORY, SITE_1_MAINTENANCE
  let i = 1;
  while (process.env[`SITE_${i}_NAME`]) {
    const site = {
      name: process.env[`SITE_${i}_NAME`],
      url: process.env[`SITE_${i}_URL`],
      ip: process.env[`SITE_${i}_IP`],
      checkUrl: process.env[`SITE_${i}_CHECK_URL`] || null,
      category: process.env[`SITE_${i}_CATEGORY`] || 'Service',
      maintenance: process.env[`SITE_${i}_MAINTENANCE`] === 'true'
    };
    websites.push(site);
    i++;
  }

  return res.status(200).json({ websites });
};
