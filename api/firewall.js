import middleware from './_common/middleware.js';
import { httpGet } from './_common/http.js';
import { parseTarget } from './_common/parse-target.js';
import { upstreamError } from './_common/upstream.js';

// WAF signatures as [header, needle, name]; needle is a lowercase substring
// Ported from wafw00f's passive header/cookie fingerprints :)
const WAF_SIGNATURES = [
  ['server', 'cloudflare', 'Cloudflare'],
  ['cf-ray', null, 'Cloudflare'],
  ['set-cookie', '__cfduid', 'Cloudflare'],
  ['server', 'sucuri', 'Sucuri CloudProxy WAF'],
  ['x-sucuri-id', null, 'Sucuri CloudProxy WAF'],
  ['x-sucuri-cache', null, 'Sucuri CloudProxy WAF'],
  ['server', 'imperva', 'Imperva SecureSphere WAF'],
  ['x-iinfo', null, 'Imperva Incapsula'],
  ['x-cdn', 'incapsula', 'Imperva Incapsula'],
  ['set-cookie', 'incap_ses', 'Imperva Incapsula'],
  ['set-cookie', 'visid_incap', 'Imperva Incapsula'],
  ['server', 'akamaighost', 'Akamai'],
  ['x-powered-by', 'aws lambda', 'AWS WAF'],
  ['server', 'big-ip', 'F5 BIG-IP'],
  ['set-cookie', 'bigipserver', 'F5 BIG-IP'],
  ['server', 'barracudawaf', 'Barracuda WAF'],
  ['set-cookie', 'barra_counter_session', 'Barracuda WAF'],
  ['set-cookie', 'bni_persistence', 'Barracuda WAF'],
  ['set-cookie', 'bni__barracuda_lb_cookie', 'Barracuda WAF'],
  ['server', 'fortiweb', 'Fortinet FortiWeb WAF'],
  ['set-cookie', 'fortiwafsid', 'Fortinet FortiWeb WAF'],
  ['via', 'ns-cache', 'Citrix NetScaler'],
  ['set-cookie', 'citrix_ns_id', 'Citrix NetScaler'],
  ['set-cookie', 'ns_af=', 'Citrix NetScaler'],
  ['server', 'reblaze secure web gateway', 'Reblaze WAF'],
  ['x-waf-event-info', null, 'Reblaze WAF'],
  ['set-cookie', 'rbzid', 'Reblaze WAF'],
  ['x-sl-compstate', null, 'Radware AppWall'],
  ['server', 'wallarm', 'Wallarm WAF'],
  ['server', 'mod_security', 'ModSecurity'],
  ['x-protected-by', 'sqreen', 'Sqreen'],
  ['server', 'ddos-guard', 'DDoS-Guard WAF'],
  ['set-cookie', '__ddg', 'DDoS-Guard WAF'],
  ['server', 'qrator', 'QRATOR WAF'],
  ['server', 'protected by comodo waf', 'Comodo cWatch WAF'],
  ['server', 'zscaler', 'Zscaler'],
  ['server', 'imunify360', 'Imunify360 WAF'],
  ['server', 'arvancloud', 'ArvanCloud WAF'],
  ['server', 'sonicwall', 'SonicWall'],
  ['x-datapower-transactionid', null, 'IBM WebSphere DataPower'],
  ['server', 'naxsi', 'NAXSI WAF'],
  ['server', 'safe3waf', 'Safe3 Web Application Firewall'],
  ['x-webcoment', null, 'Webcoment Firewall'],
  ['server', 'yundun', 'Yundun WAF'],
  ['x-yd-waf-info', null, 'Yundun WAF'],
  ['x-yd-info', null, 'Yundun WAF'],
  ['server', 'qianxin-waf', '360 WangZhanBao WAF'],
  ['wzws-ray', null, '360 WangZhanBao WAF'],
  ['x-powered-by-360wzb', null, '360 WangZhanBao WAF'],
  ['x-denied-reason', null, 'WangZhanBao WAF'],
  ['x-wzws-requested-method', null, 'WangZhanBao WAF'],
  ['x-powered-by-anquanbao', null, 'Anquanbao WAF'],
  ['server', 'yunjiasu', 'Baidu Yunjiasu WAF'],
  ['server', 'nsfocus', 'NSFocus WAF'],
  ['server', 'jiasule-waf', 'Jiasule WAF'],
  ['set-cookie', '__jsluid', 'Jiasule WAF'],
  ['set-cookie', 'jsl_tracking', 'Jiasule WAF'],
  ['server', 'safedog', 'SafeDog WAF'],
  ['set-cookie', 'safedog-flow-item', 'SafeDog WAF'],
  ['set-cookie', 'yunsuo_session', 'Yunsuo WAF'],
];

// Match a header value (string or array) against a needle, case-insensitively
const matches = (value, needle) => {
  if (!value) return false;
  const values = Array.isArray(value) ? value : [value];
  return values.some((v) => !needle || String(v).toLowerCase().includes(needle));
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
