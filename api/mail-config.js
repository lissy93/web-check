const middleware = require('./_common/middleware');

const dns = require('dns').promises;
const URL = require('url-parse');

const handler = async (url, event, context) => {
  try {
    const domain = new URL(url).hostname || new URL(url).pathname;

    // Get MX records
    const mxRecords = await dns.resolveMx(domain);

    // Get TXT records
    const txtRecords = await dns.resolveTxt(domain);

    // Filter for only email related TXT records (SPF, DKIM, DMARC, and certain provider verifications)
    const emailTxtRecords = txtRecords.filter(record => {
      const recordString = record.join('');
      return (
        recordString.startsWith('v=spf1') ||
        recordString.startsWith('v=DKIM1') ||
        recordString.startsWith('v=DMARC1') ||
        recordString.startsWith('protonmail-verification=') ||
        recordString.startsWith('google-site-verification=') || // Google Workspace
        recordString.startsWith('MS=') || // Microsoft 365
        recordString.startsWith('zoho-verification=') || // Zoho
        recordString.startsWith('titan-verification=') || // Titan
        recordString.includes('bluehost.com') // BlueHost
      );
    });

    // Identify specific mail services
    const mailServices = emailTxtRecords.map(record => {
      const recordString = record.join('');
      if (recordString.startsWith('protonmail-verification=')) {
        return { provider: 'ProtonMail', value: recordString.split('=')[1] };
      } else if (recordString.startsWith('google-site-verification=')) {
        return { provider: 'Google Workspace', value: recordString.split('=')[1] };
      } else if (recordString.startsWith('MS=')) {
        return { provider: 'Microsoft 365', value: recordString.split('=')[1] };
      } else if (recordString.startsWith('zoho-verification=')) {
        return { provider: 'Zoho', value: recordString.split('=')[1] };
      } else if (recordString.startsWith('titan-verification=')) {
        return { provider: 'Titan', value: recordString.split('=')[1] };
      } else if (recordString.includes('bluehost.com')) {
        return { provider: 'BlueHost', value: recordString };
      } else {
        return null;
      }
    }).filter(record => record !== null);

    // Check MX records for Yahoo
    const yahooMx = mxRecords.filter(record => record.exchange.includes('yahoodns.net'));
    if (yahooMx.length > 0) {
      mailServices.push({ provider: 'Yahoo', value: yahooMx[0].exchange });
    }

    return {
        mxRecords,
        txtRecords: emailTxtRecords,
        mailServices,
      };
  } catch (error) {
    if (error.code === 'ENOTFOUND' || error.code === 'ENODATA') {
      return { skipped: 'No mail server in use on this domain' };
    } else {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: error.message }),
      };
    }
  }
};

module.exports = middleware(handler);
module.exports.handler = middleware(handler);
