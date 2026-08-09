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

export type CvePriorityLevel = 'critical' | 'high' | 'medium' | 'low';

export interface CveService {
  port: number | null;
  transport: string | null;
  product: string | null;
  version: string | null;
  module: string | null;
}

export interface CveKev {
  listed: boolean;
  name?: string | null;
  vendor?: string | null;
  product?: string | null;
  dateAdded?: string | null;
  dueDate?: string | null;
  ransomware?: boolean;
  requiredAction?: string | null;
}

export interface CveEpss {
  score: number;
  percentile: number | null;
  date: string | null;
}

export interface CvePriority {
  level: CvePriorityLevel;
  label: string;
  reason: string;
}

export interface CveEntry {
  id: string;
  cvss: number | null;
  summary: string | null;
  references: string[];
  verified: boolean;
  services: CveService[];
  detectedBy: string[];
  kev: CveKev;
  epss: CveEpss | null;
  priority: CvePriority;
}

export interface CveSummary {
  total: number;
  kevCount: number;
  ransomwareCount: number;
  maxCvss: number | null;
  maxEpss: number | null;
  highestPriority: CvePriorityLevel | null;
}

export interface CveIntel {
  vulns: CveEntry[];
  summary: CveSummary;
  feeds: {
    kev?: { ok: boolean; version?: string | null; released?: string | null };
    epss?: { ok: boolean; date?: string | null };
  };
}

export interface ShodanResults {
  hostnames: HostNames | null;
  serverInfo: ServerInfo | null;
  vulns: CveIntel;
}

const bareCveIds = (vulns: any): string[] => {
  if (Array.isArray(vulns)) return vulns;
  if (vulns && typeof vulns === 'object') return Object.keys(vulns);
  return [];
};

// Older/self-hosted API instances return plain CVE ids with no enrichment, so
// build the same shape from what we have rather than breaking the card
const withoutIntel = (ids: string[]): CveIntel => ({
  vulns: ids.map((id) => ({
    id,
    cvss: null,
    summary: null,
    references: [],
    verified: false,
    services: [],
    detectedBy: ['Shodan'],
    kev: { listed: false },
    epss: null,
    priority: { level: 'low', label: 'Unranked', reason: 'No KEV or EPSS data available' },
  })),
  summary: {
    total: ids.length,
    kevCount: 0,
    ransomwareCount: 0,
    maxCvss: null,
    maxEpss: null,
    highestPriority: null,
  },
  feeds: {},
});

// Accepts either an already-enriched CveIntel or a bare list/map of CVE ids
export const asCveIntel = (value: any): CveIntel => {
  if (value && !Array.isArray(value) && Array.isArray(value.vulns)) return value as CveIntel;
  return withoutIntel(bareCveIds(value));
};

export const getCveIntel = (response: any): CveIntel =>
  asCveIntel(response?.cveIntel ?? response?.vulns);

export const parseShodanResults = (response: any): ShodanResults => {
  return {
    hostnames: getHostNames(response),
    serverInfo: getServerInfo(response),
    vulns: getCveIntel(response),
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

export type Cookie = {
  name: string;
  value: string;
  attributes: Record<string, string>;
};
