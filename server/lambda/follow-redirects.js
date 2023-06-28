exports.handler = async (event) => {
  const { url } = event.queryStringParameters;
  const redirects = [];

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
    return {
      statusCode: 500,
      body: `Error: ${error.message}`,
    };
  }
};
