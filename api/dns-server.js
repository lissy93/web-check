const dns = require('dns');
const dnsPromises = dns.promises;
// const https = require('https');
const axios = require('axios');

exports.handler = async (event) => {
  const url = (event.queryStringParameters || event.query).url;
  const domain = url.replace(/^(?:https?:\/\/)?/i, "");
  try {
    const addresses = await dnsPromises.resolve4(domain);
    const results = await Promise.all(addresses.map(async (address) => {
      const hostname = await dnsPromises.reverse(address).catch(() => null);
      let dohDirectSupports = false;
      try {
        await axios.get(`https://${address}/dns-query`);
        dohDirectSupports = true;
      } catch (error) {
        dohDirectSupports = false;
      }
      return {
        address,
        hostname,
        dohDirectSupports,
      };
    }));
    // let dohMozillaSupport = false;
    // try {
    //   const mozillaList = await axios.get('https://firefox.settings.services.mozilla.com/v1/buckets/security-state/collections/onecrl/records');
    //   dohMozillaSupport = results.some(({ hostname }) => mozillaList.data.data.some(({ id }) => id.includes(hostname)));
    // } catch (error) {
    //   console.error(error);
    // }
    return {
      statusCode: 200,
      body: JSON.stringify({
        domain,
        dns: results,
        // dohMozillaSupport,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: `An error occurred while resolving DNS. ${error.message}`,
      }),
    };
  }
};
