// Thin fetch wrapper matching the axios shape used across the api: opts.params,
// opts.headers, opts.auth, opts.timeout, opts.validateStatus; returns
// { data, status, statusText, headers }; throws errors with response/code

const DEFAULT_TIMEOUT = 60000;

const buildAuth = (auth) => {
  if (!auth?.username) return null;
  return 'Basic ' + Buffer.from(`${auth.username}:${auth.password}`).toString('base64');
};

const appendParams = (url, params) => {
  if (!params) return url;
  const u = new URL(url);
  for (const [k, v] of Object.entries(params)) u.searchParams.set(k, v);
  return u.href;
};

const headersToObject = (headers) => {
  const out = {};
  for (const [k, v] of headers.entries()) {
    const key = k.toLowerCase();
    if (key === 'set-cookie') {
      out[key] = headers.getSetCookie ? headers.getSetCookie() : v.split(/, (?=[^;]+=)/);
    } else {
      out[key] = v;
    }
  }
  return out;
};

// Auto-parse JSON when the response advertises it, fall back to raw text
const parseBody = async (response) => {
  const ct = (response.headers.get('content-type') || '').toLowerCase();
  const text = await response.text();
  if (!text) return ct.includes('json') ? null : '';
  if (ct.includes('json')) {
    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  }
  return text;
};

const isOk = (status, validate) => (validate ? validate(status) : status >= 200 && status < 300);

const wrapNetworkError = (error) => {
  if (error.name === 'TimeoutError' || error.name === 'AbortError') {
    const e = new Error(error.message || 'Request timed out');
    e.code = 'ECONNABORTED';
    return e;
  }
  const code = error.cause?.code;
  if (code) {
    const e = new Error(error.message);
    e.code = code;
    return e;
  }
  return error;
};

const UA = 'web-check/1.0 (https://web-check.xyz)';

const send = async (method, url, body, opts = {}) => {
  const finalUrl = appendParams(url, opts.params);
  const headers = { 'user-agent': UA, ...opts.headers };
  const authHeader = buildAuth(opts.auth);
  if (authHeader) headers.authorization = authHeader;

  const init = {
    method,
    headers,
    signal: AbortSignal.timeout(opts.timeout || DEFAULT_TIMEOUT),
  };

  if (body !== undefined && body !== null) {
    if (typeof body === 'object') {
      init.body = JSON.stringify(body);
      const hasCt = Object.keys(headers).some((k) => k.toLowerCase() === 'content-type');
      if (!hasCt) init.headers['content-type'] = 'application/json';
    } else {
      init.body = body;
    }
  }

  let response;
  try {
    response = await fetch(finalUrl, init);
  } catch (error) {
    throw wrapNetworkError(error);
  }

  const data = await parseBody(response);
  const result = {
    data,
    status: response.status,
    statusText: response.statusText,
    headers: headersToObject(response.headers),
  };

  if (!isOk(response.status, opts.validateStatus)) {
    const err = new Error(`Request failed with status code ${response.status}`);
    err.response = result;
    throw err;
  }

  return result;
};

export const httpGet = (url, opts) => send('GET', url, null, opts);
export const httpPost = (url, body, opts) => send('POST', url, body, opts);
