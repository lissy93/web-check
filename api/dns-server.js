import { promises as dnsPromises, lookup } from 'dns';
import axios from 'axios';
import middleware from './_common/middleware.js';

const dnsHandler = async (url) => {
  try {
    const domain = url.replace(/^(?:https?:\/\/)?/i, "");
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
      domain,
      dns: results,
      // dohMozillaSupport,
    };
  } catch (error) {
    throw new Error(`An error occurred while resolving DNS. ${error.message}`); // This will be caught and handled by the commonMiddleware
  }
};


export const handler = middleware(dnsHandler);
export default handler;

