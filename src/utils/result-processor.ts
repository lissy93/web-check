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

export interface Whois {
  created: string,
  expires: string,
  updated: string,
  nameservers: string[],
}

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
  ip?: string,
  ports?: string,
};

export const getServerInfo = (response: any): ServerInfo => {
  return {
    org: response.org,
    asn: response.asn,
    isp: response.isp,
    os: response.os,
    ip: response.ip_str,
    ports: response.ports.toString(),
  };
};

export interface HostNames {
  domains: string[],
  hostnames: string[],
};

export const getHostNames = (response: any): HostNames => {
  const { hostnames, domains } = response;
  const results: HostNames = {
    domains: domains || [],
    hostnames: hostnames || [],
  };
  return results;
};

export interface Technology {
  Categories?: string[];
  Parent?: string;
  Name: string;
  Description: string;
  Link: string;
  Tag: string;
  FirstDetected: number;
  LastDetected: number;
  IsPremium: string;
}

export interface TechnologyGroup {
  tag: string;
  technologies: Technology[];
}

export const makeTechnologies = (response: any): TechnologyGroup[] => {
  let flatArray = response.Results[0].Result.Paths
    .reduce((accumulator: any, obj: any) => accumulator.concat(obj.Technologies), []);
  let technologies = flatArray.reduce((groups: any, item: any) => {
    let tag = item.Tag;
    if (!groups[tag]) groups[tag] = [];
    groups[tag].push(item);
    return groups;
  }, {});
  return technologies;
};
