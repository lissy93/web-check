import middleware from './_common/middleware.js';
import { httpGet } from './_common/http.js';
import { parseTarget } from './_common/parse-target.js';
import { upstreamError } from './_common/upstream.js';

// Extract User-agent / Allow / Disallow rules from a robots.txt body
const parseRobotsTxt = (content) => {
  const rules = [];
  for (let line of content.split('\n')) {
    line = line.trim();
    const ruleMatch = line.match(/^(Allow|Disallow|User-agent):\s*(\S*)$/i);
    if (ruleMatch) rules.push({ lbl: ruleMatch[1], val: ruleMatch[2] });
  }
  return { robots: rules };
};

const robotsHandler = async (url) => {
  const { protocol, hostname } = parseTarget(url);
  const host = hostname.includes(':') ? `[${hostname}]` : hostname;
  try {
    const res = await httpGet(`${protocol}//${host}/robots.txt`);
    const parsed = parseRobotsTxt(res.data || '');
    return parsed.robots.length ? parsed : { skipped: 'No robots.txt rules found for this host' };
  } catch (error) {
    if (error.response?.status === 404) {
      return { skipped: 'No robots.txt file present on this host' };
    }
    return upstreamError(error, 'robots.txt fetch');
  }
};

export const handler = middleware(robotsHandler);
export default handler;
