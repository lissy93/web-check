import { promises as dns } from 'dns';
import middleware from './_common/middleware.js';
import { parseTarget } from './_common/parse-target.js';
import { createLogger } from './_common/logger.js';

const log = createLogger('location');
const TIMEOUT = 4000;

// Server-side fetch with no-cors mode so providers don't reject Sec-Fetch-Mode: cors
const getJson = async (url) => {
  const r = await fetch(url, { mode: 'no-cors', signal: AbortSignal.timeout(TIMEOUT) });
  if (!r.ok) throw new Error(`status ${r.status}`);
  return r.json();
};

// Geo providers tried in order, each parser normalises to ipapi.co-shaped fields
const providers = [
  {
    name: 'ipwho.is',
    url: (ip) => `https://ipwho.is/${ip}`,
    parse: (d) => d?.success === false ? null : {
      ip: d.ip,
      city: d.city,
      region: d.region,
      country_name: d.country,
      country_code: d.country_code,
      region_code: d.region_code,
      postal: d.postal,
      latitude: d.latitude,
      longitude: d.longitude,
      org: d.connection?.isp || d.connection?.org,
      timezone: d.timezone?.id,
    },
  },
  {
    name: 'reallyfreegeoip.org',
    url: (ip) => `https://reallyfreegeoip.org/json/${ip}`,
    parse: (d) => d?.country_code ? {
      ip: d.ip,
      city: d.city,
      region: d.region_name,
      country_name: d.country_name,
      country_code: d.country_code,
      region_code: d.region_code,
      postal: d.zip_code,
      latitude: d.latitude,
      longitude: d.longitude,
      timezone: d.time_zone,
    } : null,
  },
  {
    name: 'ipapi.co',
    url: (ip) => `https://ipapi.co/${ip}/json/`,
    parse: (d) => d?.error ? null : {
      ip: d.ip,
      city: d.city,
      region: d.region,
      country_name: d.country_name,
      country_code: d.country_code,
      region_code: d.region_code,
      postal: d.postal,
      latitude: d.latitude,
      longitude: d.longitude,
      org: d.org,
      timezone: d.timezone,
      currency: d.currency,
      currency_name: d.currency_name,
      country_tld: d.country_tld,
      country_area: d.country_area,
      country_population: d.country_population,
      languages: d.languages,
    },
  },
];

// Try each provider sequentially, return first that yields a usable result
const lookupGeo = async (ip) => {
  for (const p of providers) {
    try {
      const data = await getJson(p.url(ip));
      const parsed = p.parse(data);
      if (parsed?.country_code) {
        log.debug(`${p.name} resolved ${ip} to ${parsed.country_code}`);
        return parsed;
      }
      log.warn(`${p.name} returned no usable data for ${ip}`);
    } catch (error) {
      log.warn(`${p.name} failed for ${ip}`, error.message);
    }
  }
  return null;
};

// Fetch country-level metadata to fill fields not provided by every geo source
const enrichCountry = async (code) => {
  if (!code) return {};
  try {
    const data = await getJson(
      `https://restcountries.com/v3.1/alpha/${code}`
        + '?fields=tld,languages,currencies,area,population',
    );
    const c = Array.isArray(data) ? data[0] : data;
    if (!c) {
      log.debug(`restcountries returned no entry for ${code}`);
      return {};
    }
    const languages = c.languages ? Object.values(c.languages).join(', ') : undefined;
    const currCode = c.currencies ? Object.keys(c.currencies)[0] : undefined;
    const curr = currCode ? c.currencies[currCode] : null;
    return {
      country_tld: c.tld?.[0],
      languages,
      currency: currCode,
      currency_name: curr?.name,
      country_area: c.area,
      country_population: c.population,
    };
  } catch (error) {
    log.debug(`restcountries enrichment failed for ${code}`, error.message);
    return {};
  }
};

// Strip empty values so they don't shadow enrichment defaults during merge
const compact = (o) => Object.fromEntries(
  Object.entries(o).filter(([, v]) => v !== undefined && v !== null && v !== ''),
);

// Resolve hostname to IP so providers requiring a numeric address still work
const resolveHost = async (hostname) => {
  try { return (await dns.lookup(hostname)).address }
  catch (error) {
    log.warn(`DNS lookup failed for ${hostname}, falling through with raw host`, error.message);
    return hostname;
  }
};

// Resolve geographic info for a host via a chain of providers with country enrichment
const locationHandler = async (url) => {
  const { hostname } = parseTarget(url);
  const ip = await resolveHost(hostname);
  const geo = await lookupGeo(ip);
  if (!geo) {
    log.error(`all geo providers failed for ${ip}`);
    return { error: 'IP location lookup unavailable across all providers, please try again later' };
  }
  const enrichment = await enrichCountry(geo.country_code);
  return { ...enrichment, ...compact(geo) };
};

export const handler = middleware(locationHandler);
export default handler;
