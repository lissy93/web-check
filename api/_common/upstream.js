// Map axios/network errors to our shared envelope shape
export const upstreamError = (error, context = 'Lookup') => {
  const status = error.response?.status;
  if (status === 404 || status === 410) return { skipped: `No ${context} data for this host` };
  if (status === 401 || status === 403) return { error: `${context} blocked (HTTP ${status})` };
  if (status === 429) return { error: `${context} rate-limited by upstream` };
  if (status && status >= 500) return { error: `${context} upstream is unavailable` };
  if (error.code === 'ECONNABORTED') return { error: `${context} timed out` };
  if (error.code === 'ENOTFOUND') return { skipped: 'Host could not be resolved' };
  if (error.code === 'ECONNREFUSED') return { error: 'Connection refused by upstream' };
  return { error: `${context} failed: ${error.message}` };
};

// Read a required env var, or return a skipped envelope if missing
export const requireEnv = (envVar, service) => {
  const v = process.env[envVar];
  return v ? { value: v } : { skipped: `${service} requires ${envVar} to be set` };
};
