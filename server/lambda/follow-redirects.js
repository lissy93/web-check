exports.handler = async (event) => {
  const { url } = event.queryStringParameters;
  const redirects = [url];

  try {
    const got = await import('got');
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
      statusCode: 200,
      body: JSON.stringify({
        redirects: redirects,
      }),
    };
  } catch (error) {
    return errorResponse(`Error: ${error.message}`);
  }
};

const errorResponse = (message, statusCode = 444) => {
  return {
    statusCode: statusCode,
    body: JSON.stringify({ error: message }),
  };
};
