const STATUS_MESSAGES: Record<number, string> = {
  408: 'Request timed out',
  429: 'Rate limited, try again later',
  500: 'Internal server error',
  502: 'Bad gateway, upstream server failed',
  503: 'Service temporarily unavailable',
  504: 'Gateway timed out',
};

const FALLBACK = 'API request failed. This may be a server error, timeout, or platform limitation.';

// Decode a fetch Response as JSON, returning a structured error on failure
export const parseJson = async (res: Response): Promise<any> => {
  try {
    const json = await res.json();
    if (!res.ok && !json?.error) {
      const detail = json?.errorMessage || json?.message;
      const statusMsg = STATUS_MESSAGES[res.status] || `${FALLBACK} (HTTP ${res.status})`;
      return { error: detail ? `${statusMsg} - ${detail}` : statusMsg };
    }
    return json;
  } catch {
    const statusMsg = STATUS_MESSAGES[res.status] || FALLBACK;
    return { error: `${statusMsg} (HTTP ${res.status})` };
  }
};

export default parseJson;
