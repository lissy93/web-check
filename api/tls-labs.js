import middleware from './_common/middleware.js';
import { httpGet } from './_common/http.js';
import { parseTarget } from './_common/parse-target.js';
import { upstreamError } from './_common/upstream.js';

const SSL_LABS = 'https://api.ssllabs.com/api/v3/analyze';

// Pull a cached SSL Labs report; skip if no fresh cache available
const tlsLabsHandler = async (url) => {
  const { hostname } = parseTarget(url);
  try {
    const res = await httpGet(SSL_LABS, {
      params: { host: hostname, fromCache: 'on', maxAge: 24, all: 'done' },
      timeout: 8000,
      headers: { 'User-Agent': 'web-check (https://web-check.xyz)' },
    });
    const data = res.data;
    if (!data || data.status !== 'READY' || !data.endpoints?.length) {
      return {
        skipped:
          'No cached SSL Labs report for this host. ' +
          'Run a fresh scan at https://www.ssllabs.com/ssltest/',
      };
    }
    return data;
  } catch (error) {
    return upstreamError(error, 'SSL Labs lookup');
  }
};

export const handler = middleware(tlsLabsHandler);
export default handler;
