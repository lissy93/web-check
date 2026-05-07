import { execFile } from 'child_process';
import middleware from './_common/middleware.js';
import { parseTarget } from './_common/parse-target.js';

const LOCAL_TIMEOUT = 8000;

// Parse traceroute -n output into [{ip, time}] entries, skipping unanswered hops
const parseHops = (stdout) => {
  const hops = [];
  for (const line of stdout.split('\n')) {
    const m = line.match(/^\s*\d+\s+([\d.]+|\S*::\S*)\s+([\d.]+)\s*ms/);
    if (m) hops.push({ ip: m[1], time: Number(m[2]) });
  }
  return hops;
};

// Run the system traceroute binary via execFile (no shell, no injection)
const runTraceroute = (host) =>
  new Promise((resolve, reject) => {
    execFile(
      'traceroute',
      ['-q', '1', '-n', '-w', '2', host],
      { timeout: LOCAL_TIMEOUT },
      (err, stdout) => (err ? reject(err) : resolve(parseHops(stdout))),
    );
  });

const isMissingBinary = (err) =>
  err?.code === 'ENOENT' || /command not found|not installed/i.test(err?.message || '');

const traceRouteHandler = async (url) => {
  const start = Date.now();
  const { hostname } = parseTarget(url);
  let hops;
  try {
    hops = await runTraceroute(hostname);
  } catch (err) {
    if (isMissingBinary(err)) {
      return {
        skipped:
          'Traceroute is not installed in this environment. ' +
          'Install via your package manager, or run web-check via Docker.',
      };
    }
    return { error: `Traceroute failed: ${err.message}` };
  }
  if (!hops.length) {
    return { skipped: 'Traceroute returned no answered hops for this host' };
  }
  return {
    message: 'Traceroute completed!',
    result: hops.map(({ ip, time }) => ({ [ip]: [time] })),
    timeTaken: Date.now() - start,
  };
};

export const handler = middleware(traceRouteHandler);
export default handler;
