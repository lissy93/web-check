import middleware from './_common/middleware.js';
import { httpGet } from './_common/http.js';
import { parseTarget } from './_common/parse-target.js';
import { upstreamError } from './_common/upstream.js';

const SSL_LABS = 'https://api.ssllabs.com/api/v3/analyze';

// Return cached report if ready, pending status while a scan is running, else skip
const tlsLabsHandler = async (url) => {
  const { hostname } = parseTarget(url);
  try {
    const res = await httpGet(SSL_LABS, {
      params: { host: hostname, fromCache: 'on', maxAge: 168, all: 'done' },
      timeout: 8000,
      headers: { 'User-Agent': 'web-check (https://web-check.xyz)' },
    });
    const data = res.data;
    if (data?.status === 'READY' && data.endpoints?.length) return data;
    if (data?.status === 'DNS' || data?.status === 'IN_PROGRESS') {
      return { pending: true };
    }
    if (data?.status === 'ERROR') {
      return { error: `SSL Labs: ${data.statusMessage || 'Assessment failed'}` };
    }
    return { skipped: 'No SSL Labs report available for this host' };
  } catch (error) {
    return upstreamError(error, 'SSL Labs lookup');
  }
};

export const handler = middleware(tlsLabsHandler);
export default handler;
