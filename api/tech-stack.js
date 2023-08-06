const Wappalyzer = require('wappalyzer');

const analyze = async (url) => {

  const options = {};

  const wappalyzer = new Wappalyzer(options);
  return (async function() {
    try {
      await wappalyzer.init()
      const headers = {}
      const storage = {
        local: {},
        session: {},
      }
      const site = await wappalyzer.open(url, headers, storage)
      const results = await site.analyze()
      return results;
    } catch (error) {
      return error;
    } finally {
      await wappalyzer.destroy()
    }
  })();
}

exports.handler = async (event, context, callback) => {
  // Validate URL parameter
  if (!(event.queryStringParameters || event.query).url) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing url parameter' }),
    };
  }

  // Get URL from param
  let url = (event.queryStringParameters || event.query).url;
  if (!/^https?:\/\//i.test(url)) {
    url = 'http://' + url;
  }
  
  try {
    return analyze(url).then(
      (results) => {
        if (!results.technologies || results.technologies.length === 0) {
          return {
            statusCode: 200,
            body: JSON.stringify({ error: 'Unable to find any technologies for site' }),
          };
        }
        return {
          statusCode: 200,
          body: JSON.stringify(results),
        }
      }
    )
    .catch((error) => {
      return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
      };
    });
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
