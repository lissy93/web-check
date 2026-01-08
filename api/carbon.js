import https from 'https';
import middleware from './_common/middleware.js';

const carbonHandler = async (url) => {

  // First, get the size of the website's HTML
  const getHtmlSize = (url) => new Promise((resolve, reject) => {
    https.get(url, res => {
      let data = '';
      res.on('data', chunk => {
        data += chunk;
      });
      res.on('end', () => {
        const sizeInBytes = Buffer.byteLength(data, 'utf8');
        resolve(sizeInBytes);
      });
    }).on('error', reject);
  });

  try {
    const sizeInBytes = await getHtmlSize(url);
    const apiUrl = `https://api.websitecarbon.com/data?bytes=${sizeInBytes}&green=0`;

    // Then use that size to get the carbon data
    const carbonData = await new Promise((resolve, reject) => {
      https.get(apiUrl, res => {
        let data = '';
        res.on('data', chunk => {
          data += chunk;
        });
        res.on('end', () => {
          // Check if response looks like HTML (e.g., Cloudflare challenge page)
          const trimmedData = data.trim();
          if (trimmedData.startsWith('<!DOCTYPE') || trimmedData.startsWith('<html') || trimmedData.startsWith('<')) {
            reject(new Error('WebsiteCarbon API returned HTML instead of JSON. This may be due to Cloudflare protection when running from a datacenter IP.'));
            return;
          }
          try {
            resolve(JSON.parse(data));
          } catch (parseError) {
            reject(new Error(`Failed to parse WebsiteCarbon API response as JSON: ${parseError.message}`));
          }
        });
      }).on('error', reject);
    });

    if (!carbonData.statistics || (carbonData.statistics.adjustedBytes === 0 && carbonData.statistics.energy === 0)) {
      return {
        statusCode: 200,
        body: JSON.stringify({ skipped: 'Not enough info to get carbon data' }),
      };
    }

    carbonData.scanUrl = url;
    return carbonData;
  } catch (error) {
    throw new Error(`Error: ${error.message}`);
  }
};

export const handler = middleware(carbonHandler);
export default handler;
