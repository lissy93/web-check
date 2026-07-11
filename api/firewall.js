import middleware from './_common/middleware.js';
import { httpGet } from './_common/http.js';
import { parseTarget } from './_common/parse-target.js';
import { upstreamError } from './_common/upstream.js';

// WAF signatures as [header, needle, name], a null needle matches any value
const WAF_SIGNATURES = [
  ['server', 'cloudflare', 'Cloudflare'],
  ['x-powered-by', 'AWS Lambda', 'AWS WAF'],
  ['server', 'AkamaiGHost', 'Akamai'],
  ['server', 'Sucuri', 'Sucuri'],
  ['server', 'BarracudaWAF', 'Barracuda WAF'],
  ['server', 'BIG-IP', 'F5 BIG-IP'],
  ['x-sucuri-id', null, 'Sucuri CloudProxy WAF'],
  ['x-sucuri-cache', null, 'Sucuri CloudProxy WAF'],
  ['server', 'FortiWeb', 'Fortinet FortiWeb WAF'],
  ['server', 'Imperva', 'Imperva SecureSphere WAF'],
  ['x-protected-by', 'Sqreen', 'Sqreen'],
  ['x-waf-event-info', null, 'Reblaze WAF'],
  ['set-cookie', '_citrix_ns_id', 'Citrix NetScaler'],
  ['x-denied-reason', null, 'WangZhanBao WAF'],
  ['x-wzws-requested-method', null, 'WangZhanBao WAF'],
  ['x-webcoment', null, 'Webcoment Firewall'],
  ['server', 'Yundun', 'Yundun WAF'],
  ['x-yd-waf-info', null, 'Yundun WAF'],
  ['x-yd-info', null, 'Yundun WAF'],
  ['server', 'Safe3WAF', 'Safe3 Web Application Firewall'],
  ['server', 'NAXSI', 'NAXSI WAF'],
  ['x-datapower-transactionid', null, 'IBM WebSphere DataPower'],
  ['server', 'QRATOR', 'QRATOR WAF'],
  ['server', 'ddos-guard', 'DDoS-Guard WAF'],
];

// Match a header value (string or array) against a needle
const matches = (value, needle) => {
  if (!value) return false;
  const values = Array.isArray(value) ? value : [value];
  return values.some((v) => !needle || String(v).includes(needle));
};

const firewallHandler = async (url) => {
  const { href } = parseTarget(url);
  try {
    const { headers } = await httpGet(href, { validateStatus: () => true });
    const match = WAF_SIGNATURES.find(([header, needle]) => matches(headers[header], needle));
    return match ? { hasWaf: true, waf: match[2] } : { hasWaf: false };
  } catch (error) {
    return upstreamError(error, 'Firewall check');
  }
};

export const handler = middleware(firewallHandler);
export default handler;
