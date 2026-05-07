const LEVELS = { debug: 10, info: 20, warn: 30, error: 40, silent: 99 };
const THRESHOLD = LEVELS[(process.env.LOG_LEVEL || 'info').toLowerCase()] ?? LEVELS.info;

const fmt = (level, scope, msg, extra) => {
  const ts = new Date().toISOString();
  const tag = scope ? `[${scope}] ` : '';
  const body = typeof msg === 'string' ? msg : JSON.stringify(msg);
  const tail =
    extra === undefined ? '' : ` ${typeof extra === 'string' ? extra : JSON.stringify(extra)}`;
  return `${ts} ${level.toUpperCase().padEnd(5)} ${tag}${body}${tail}`;
};

const write = (level, stream, scope, msg, extra) => {
  if (LEVELS[level] < THRESHOLD) return;
  stream.write(fmt(level, scope, msg, extra) + '\n');
};

// Logger scoped to a route name, honours LOG_LEVEL env
export const createLogger = (scope) => ({
  debug: (msg, extra) => write('debug', process.stdout, scope, msg, extra),
  info: (msg, extra) => write('info', process.stdout, scope, msg, extra),
  warn: (msg, extra) => write('warn', process.stderr, scope, msg, extra),
  error: (msg, extra) => write('error', process.stderr, scope, msg, extra),
});

export default createLogger;
