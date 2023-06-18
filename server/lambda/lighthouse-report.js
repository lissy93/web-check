const fetch = require('node-fetch');

exports.handler = function(event, context, callback) {
  const { url } = event.queryStringParameters;

  if (!url) {
    callback(null, {
      statusCode: 400,
      body: JSON.stringify({ error: 'URL param is required'}),
    });
  }

  const apiKey = process.env.GOOGLE_CLOUD_API_KEY;
  const endpoint = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&category=PERFORMANCE&category=ACCESSIBILITY&category=BEST_PRACTICES&category=SEO&category=PWA&strategy=mobile&key=${apiKey}`;
  fetch(endpoint)
  .then((res) => res.json() )
  .then(
    (data) => {
      callback(null, {
        statusCode: 200,
        body: JSON.stringify(data),
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

