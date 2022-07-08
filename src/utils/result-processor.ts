export interface ServerLocation {
  city: string,
  region: string,
  country: string,
  postCode: string,
  regionCode: string,
  countryCode: string,
  coords: {
    latitude: number,
    longitude: number,
  },
  isp: string,
  timezone: string,
  languages: string,
  currency: string,
  currencyCode: string,
  countryDomain: string,
  countryAreaSize: number,
  countryPopulation: number,
};

export const getLocation = (response: any): ServerLocation => {
  return {
    city: response.city,
    region: response.region,
    country: response.country_name,
    postCode: response.postal,
    regionCode: response.region_code,
    countryCode: response.country_code,
    coords: {
      latitude: response.latitude,
      longitude: response.longitude,
    },
    isp: response.org,
    timezone: response.timezone,
    languages: response.languages,
    currencyCode: response.currency,
    currency: response.currency_name,
    countryDomain: response.country_tld,
    countryAreaSize: response.country_area,
    countryPopulation: response.country_population,
  };
};


export interface ServerInfo {
  org: string,
  asn: string,
  isp: string,
  os?: string,
};

export const getServerInfo = (response: any): ServerInfo => {
  return {
    org: response.org,
    asn: response.asn,
    isp: response.isp,
    os: response.os,
  };
};

export interface HostNames {
  domains: string[],
  hostnames: string[],
};

export const getHostNames = (response: any): HostNames => {
  const { hostnames, domains } = response;
  const results: HostNames = {
    domains: [],
    hostnames: [],
  };
  if (!hostnames || !domains) return results;
  hostnames.forEach((host: string) => {
    if (domains.includes(host)) {
      results.domains.push(host);
    } else {
      results.hostnames.push(host);
    }
  });

  return results;
};
