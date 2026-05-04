const FRIENDLY = 'Failed to get a valid response. This may be due to the '
  + 'target not exposing the required data, or limitations imposed by the '
  + 'infrastructure of this Web Check instance.';

// Decode a fetch Response as JSON, returning a structured error on failure
export const parseJson = async (res: Response): Promise<any> => {
  try {
    return await res.json();
  } catch {
    const status = res.status ? ` (HTTP ${res.status})` : '';
    return { error: `${FRIENDLY}${status}` };
  }
};

export default parseJson;
