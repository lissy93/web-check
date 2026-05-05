import https from 'https';
import middleware from './_common/middleware.js';

const MIN_MAX_AGE = 10886400;

const verdict = (message, compatible = false, hstsHeader = null) =>
  ({ message, compatible, hstsHeader });

const evaluate = (header) => {
  if (!header) return verdict('Site does not serve any HSTS headers.');
  const maxAge = parseInt(header.match(/max-age=(\d+)/)?.[1] || '0', 10);
  if (maxAge < MIN_MAX_AGE) return verdict(`HSTS max-age is less than ${MIN_MAX_AGE}.`);
  if (!header.includes('includeSubDomains'))
    return verdict('HSTS header does not include all subdomains.');
  if (!header.includes('preload'))
    return verdict('HSTS header does not contain the preload directive.');
  return verdict('Site is compatible with the HSTS preload list!', true, header);
};

const REQUEST_TIMEOUT = 5000;

const hstsHandler = async (url) => new Promise((resolve) => {
  const req = https.request(url, (res) => {
    resolve(evaluate(res.headers['strict-transport-security']));
    res.resume();
  });
  req.setTimeout(REQUEST_TIMEOUT, () => {
    req.destroy();
    resolve({ error: 'HSTS check timed out' });
  });
  req.on('error', (error) => resolve({ error: `HSTS check failed: ${error.message}` }));
  req.end();
});

export const handler = middleware(hstsHandler);
export default handler;
