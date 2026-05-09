import type { RowProps } from 'client/components/Form/Row';

export interface ServerLocation {
  city: string;
  region: string;
  country: string;
  postCode: string;
  regionCode: string;
  countryCode: string;
  coords: {
    latitude: number;
    longitude: number;
  };
  isp: string;
  timezone: string;
  languages: string;
  currency: string;
  currencyCode: string;
  countryDomain: string;
  countryAreaSize: number;
  countryPopulation: number;
}

export interface Whois {
  created: string;
  expires: string;
  updated: string;
  nameservers: string[];
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
  org: string;
  asn: string;
  isp: string;
  os?: string;
  ip?: string;
  ports?: string;
  loc?: string;
  type?: string;
}

// Whether a result has any meaningful value worth rendering a card for
export const hasData = (r: any): boolean => {
  if (r === null || r === undefined) return false;
  if (typeof r === 'boolean' || typeof r === 'number') return true;
  if (typeof r === 'string') return r.trim().length > 0;
  if (Array.isArray(r)) return r.some(hasData);
  if (typeof r === 'object') return Object.values(r).some(hasData);
  return true;
};

export const getServerInfo = (response: any): ServerInfo | null => {
  const info: ServerInfo = {
    org: response.org,
    asn: response.asn,
    isp: response.isp,
    os: response.os,
    ip: response.ip_str,
    ports: response?.ports?.toString(),
    loc: response.city ? `${response.city}, ${response.country_name}` : '',
    type: response.tags ? response.tags.toString() : '',
  };
  return Object.values(info).some(Boolean) ? info : null;
};

export interface HostNames {
  domains: string[];
  hostnames: string[];
}

export const getHostNames = (response: any): HostNames | null => {
  const { hostnames, domains } = response;
  if ((!domains || domains.length < 1) && (!hostnames || hostnames.length < 1)) {
    return null;
  }
  const results: HostNames = {
    domains: domains || [],
    hostnames: hostnames || [],
  };
  return results;
};

export interface ShodanResults {
  hostnames: HostNames | null;
  serverInfo: ServerInfo | null;
  vulns: string[];
}

export const parseShodanResults = (response: any): ShodanResults => {
  return {
    hostnames: getHostNames(response),
    serverInfo: getServerInfo(response),
    vulns: Array.isArray(response?.vulns)
      ? response.vulns
      : response?.vulns && typeof response.vulns === 'object'
        ? Object.keys(response.vulns)
        : [],
  };
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
  let flatArray = response.Results[0].Result.Paths.reduce(
    (accumulator: any, obj: any) => accumulator.concat(obj.Technologies),
    [],
  );
  let technologies = flatArray.reduce((groups: any, item: any) => {
    let tag = item.Tag;
    if (!groups[tag]) groups[tag] = [];
    groups[tag].push(item);
    return groups;
  }, {});
  return technologies;
};

export type Cookie = {
  name: string;
  value: string;
  attributes: Record<string, string>;
};

export const parseRobotsTxt = (content: string): { robots: RowProps[] } => {
  const lines = content.split('\n');
  const rules: RowProps[] = [];

  lines.forEach((line) => {
    line = line.trim(); // This removes trailing and leading whitespaces

    let match = line.match(/^(Allow|Disallow):\s*(\S*)$/i);
    if (match) {
      const rule: RowProps = {
        lbl: match[1],
        val: match[2],
      };

      rules.push(rule);
    } else {
      match = line.match(/^(User-agent):\s*(\S*)$/i);
      if (match) {
        const rule: RowProps = {
          lbl: match[1],
          val: match[2],
        };

        rules.push(rule);
      }
    }
  });

  return { robots: rules };
};
