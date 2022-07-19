const fetch = require('node-fetch');


const endpoints = {
  dnsRecords: 'https://api.securitytrails.com/v1/domain/{address}',
  subDomains: 'https://api.securitytrails.com/v1/domain/{address}/subdomains?include_inactive=true',
};

const apiKeys = {
  shodan: process.env.SHODAN_API_KEY,
  securityTrails: process.env.SECURITY_TRAILS_API_KEY,
};

const makeEndpoint = (endpoint, address) => endpoint.replace('{address}', address);

const errorObject = (msg, status) => {
  return {
    statusCode: status || 500,
    body: JSON.stringify({ error: true, errorMsg: msg }),
  }
};

/* Fetches list of DNS records for a given URL from SecurityTrails API */
const getDnsInfo = async (url) => {
  const stOptions = {
    method: 'GET',
    headers: { Accept: 'application/json', APIKEY: apiKeys.securityTrails }
  };
  const dnsInfoRequest = await fetch(makeEndpoint(endpoints.dnsRecords, url), stOptions);
  const dnsInfoResponse = await dnsInfoRequest.json();
  if (dnsInfoResponse) return null;
  return dnsInfoResponse?.current_dns;
};

/* Fetches a list of a domain's sub-domains from SecurityTrails API */
const getSubDomains = async (url) => {
  const stOptions = {
    method: 'GET',
    headers: { Accept: 'application/json', APIKEY: apiKeys.securityTrails }
  };
  const subDomainRequest = await fetch(makeEndpoint(endpoints.subDomains, url), stOptions);
  const subDomainResponse = await subDomainRequest.json();
  if (!subDomainResponse.subdomains) return null;
  return {
    count: subDomainResponse?.subdomain_count,
    list: subDomainResponse?.subdomains,
  };
};

exports.handler = async (event, context) => {
  const addressParam = event.queryStringParameters.address;
  if (!addressParam) return errorObject('An address must be specified');
  const address = decodeURIComponent(addressParam)
    .replaceAll('https://', '')
    .replaceAll('http://', '');

  try {
    const results = {};
    if (apiKeys.securityTrails) {
      results.dnsRecords = await getDnsInfo(address);
      results.subDomains = await getSubDomains(address);
    }

    return {
      statusCode: 200,
      body: JSON.stringify(results),
    };
  } catch (error) {
    return errorObject('Failed to fetch data');
  }
};
