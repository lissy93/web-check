const axios = require('axios');
const unzipper = require('unzipper');
const csv = require('csv-parser');
const fs = require('fs');
const middleware = require('./_common/middleware');

// Should also work with the following sources:
// https://www.domcop.com/files/top/top10milliondomains.csv.zip
// https://tranco-list.eu/top-1m.csv.zip
// https://www.domcop.com/files/top/top10milliondomains.csv.zip
// https://radar.cloudflare.com/charts/LargerTopDomainsTable/attachment?id=525&top=1000000
// https://statvoo.com/dl/top-1million-sites.csv.zip

const FILE_URL = 'https://s3-us-west-1.amazonaws.com/umbrella-static/top-1m.csv.zip';
const TEMP_FILE_PATH = '/tmp/top-1m.csv';

const handler = async (url) => {
  let domain = null;

  try {
    domain = new URL(url).hostname;
  } catch (e) {
    throw new Error('Invalid URL');
  }

// Download and unzip the file if not in cache
if (!fs.existsSync(TEMP_FILE_PATH)) {
  const response = await axios({
    method: 'GET',
    url: FILE_URL,
    responseType: 'stream'
  });

  await new Promise((resolve, reject) => {
    response.data
      .pipe(unzipper.Extract({ path: '/tmp' }))
      .on('close', resolve)
      .on('error', reject);
  });
}

// Parse the CSV and find the rank
return new Promise((resolve, reject) => {
  const csvStream = fs.createReadStream(TEMP_FILE_PATH)
    .pipe(csv({
      headers: ['rank', 'domain'],
    }))
    .on('data', (row) => {
      if (row.domain === domain) {
        csvStream.destroy();
        resolve({
          domain: domain,
          rank: row.rank,
          isFound: true,
        });
      }
    })
    .on('end', () => {
      resolve({
        skipped: `Skipping, as ${domain} is not present in the Umbrella top 1M list.`,
        domain: domain,
        isFound: false,
      });
    })
    .on('error', reject);
});
};

module.exports = middleware(handler);
module.exports.handler = middleware(handler);

