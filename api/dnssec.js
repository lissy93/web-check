import middleware from './_common/middleware.js';
import { httpGet } from './_common/http.js';
import { parseTarget } from './_common/parse-target.js';

// Query Google's public DNS JSON API for a given record type
const queryDns = async (domain, type) => {
  const res = await httpGet('https://dns.google/resolve', {
    params: { name: domain, type },
    headers: { Accept: 'application/dns-json' },
    timeout: 5000,
  });
  return res.data;
};

const dnsSecHandler = async (url) => {
  const { hostname } = parseTarget(url);
  const [dnskey, ds, aRecord] = await Promise.all([
    queryDns(hostname, 'DNSKEY'),
    queryDns(hostname, 'DS'),
    queryDns(hostname, 'A'),
  ]);
  return {
    DNSKEY: dnskey.Answer
      ? { isFound: true, answer: dnskey.Answer, response: dnskey.Answer }
      : { isFound: false, answer: null, response: dnskey },
    DS: ds.Answer
      ? { isFound: true, answer: ds.Answer, response: ds.Answer }
      : { isFound: false, answer: null, response: ds },
    RRSIG: {
      isFound: !!aRecord.AD,
      answer: null,
      response: aRecord,
    },
  };
};

export const handler = middleware(dnsSecHandler);
export default handler;
