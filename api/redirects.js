const handler = async (url) => {
  const redirects = [url];
  const got = await import('got');

  try {
    await got.default(url, {
      followRedirect: true,
      maxRedirects: 12,
      hooks: {
        beforeRedirect: [
          (options, response) => {
            redirects.push(response.headers.location);
          },
        ],
      },
    });

    return {
      redirects: redirects,
    };
  } catch (error) {
    throw new Error(`Error: ${error.message}`);
  }
};

const middleware = require('./_common/middleware');

module.exports = middleware(handler);
module.exports.handler = middleware(handler);
