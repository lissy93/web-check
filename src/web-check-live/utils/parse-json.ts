const FRIENDLY =
  'API request failed. This may be a server error, timeout, or platform limitation.';

// Decode a fetch Response as JSON, returning a structured error on failure
export const parseJson = async (res: Response): Promise<any> => {
  try {
    const json = await res.json();
    if (!res.ok && !json?.error) {
      return { error: json?.errorMessage || json?.message || `${FRIENDLY} (HTTP ${res.status})` };
    }
    return json;
  } catch {
    const status = res.status ? ` (HTTP ${res.status})` : '';
    return { error: `API responded with ${status}. ${FRIENDLY}` };
  }
};

export default parseJson;
