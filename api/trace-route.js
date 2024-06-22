import url from 'url';
import traceroute from 'traceroute';
import middleware from './_common/middleware.js';

const traceRouteHandler = async (urlString, context) => {
  // Parse the URL and get the hostname
  const urlObject = url.parse(urlString);
  const host = urlObject.hostname;

  if (!host) {
    throw new Error('Invalid URL provided');
  }

  // Traceroute with callback
  const result = await new Promise((resolve, reject) => {
    traceroute.trace(host, (err, hops) => {
      if (err || !hops) {
        reject(err || new Error('No hops found'));
      } else {
        resolve(hops);
      }
    });
  });

  return {
    message: "Traceroute completed!",
    result,
  };
};

export const handler = middleware(traceRouteHandler);
export default handler;
