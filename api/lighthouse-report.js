const axios = require('axios');

exports.handler = function(event, context, callback) {
  const url = (event.queryStringParameters || event.query).url;

  if (!url) {
    callback(null, {
      statusCode: 400,
      body: JSON.stringify({ error: 'URL param is required'}),
    });
  }

  const apiKey = process.env.GOOGLE_CLOUD_API_KEY;

  if (!apiKey) {
    callback(null, {
      statusCode: 500,
      body: JSON.stringify({ error: 'API key (GOOGLE_CLOUD_API_KEY) not set'}),
    });
  }

  const endpoint = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&category=PERFORMANCE&category=ACCESSIBILITY&category=BEST_PRACTICES&category=SEO&category=PWA&strategy=mobile&key=${apiKey}`;
  
  axios.get(endpoint)
  .then(
    (response) => {
      callback(null, {
        statusCode: 200,
        body: JSON.stringify(response.data),
      });
    }
  ).catch(
    () => {
      callback(null, {
        statusCode: 500,
        body: JSON.stringify({ error: 'Error running Lighthouse'}),
      });
    }
  );
};
