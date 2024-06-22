import axios from 'axios';
import middleware from './_common/middleware.js';

const rankHandler = async (url) => { 
  const domain = url ? new URL(url).hostname : null;
  if (!domain) throw new Error('Invalid URL');

  try {
    const auth = process.env.TRANCO_API_KEY ? // Auth is optional.
      { auth: { username: process.env.TRANCO_USERNAME, password: process.env.TRANCO_API_KEY } }
      : {};
    const response = await axios.get(
      `https://tranco-list.eu/api/ranks/domain/${domain}`, { timeout: 5000 }, auth,
      );
    if (!response.data || !response.data.ranks || response.data.ranks.length === 0) {
      return { skipped: `Skipping, as ${domain} isn't ranked in the top 100 million sites yet.`};
    }
    return response.data;
  } catch (error) {
    return { error: `Unable to fetch rank, ${error.message}` };
  }
};

export const handler = middleware(rankHandler);
export default handler;

