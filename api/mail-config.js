import dns from 'dns/promises';
import middleware from './_common/middleware.js';
import { parseTarget } from './_common/parse-target.js';

// Safely query TXT, returning [] on ENODATA/ENOTFOUND
const safeTxt = (name) => dns.resolveTxt(name).catch(() => []);

// Try common DKIM selectors to detect if DKIM is configured
const DKIM_SELECTORS = [
  'default',
  'google',
  'selector1',
  'selector2',
  'k1',
  'k2',
  'k3',
  's1',
  's2',
  'dkim',
  'mail',
];
const findDkim = async (domain) => {
  const checks = DKIM_SELECTORS.map((s) =>
    safeTxt(`${s}._domainkey.${domain}`).then((r) => {
      if (!r.length) return null;
      const txt = r[0].join('');
      // Skip revoked keys (empty p= value)
      if (/p=\s*(;|$)/.test(txt)) return null;
      return { selector: s, record: r[0] };
    }),
  );
  const results = await Promise.all(checks);
  return results.filter(Boolean);
};

// Detect mail provider from MX exchange hostnames
const MX_PROVIDERS = [
  [/google(mail)?\.com$/i, 'Google Workspace'],
  [/outlook\.com$|microsoft\.com$/i, 'Microsoft 365'],
  [/protonmail\.ch$|protonme\.ch$/i, 'ProtonMail'],
  [/zoho\.(com|eu|in)$/i, 'Zoho Mail'],
  [/yahoodns\.net$/i, 'Yahoo Mail'],
  [/mimecast\.com$/i, 'Mimecast'],
  [/pphosted\.com$/i, 'Proofpoint'],
  [/messagelabs\.com$/i, 'Broadcom Email Security'],
  [/iphmx\.com$/i, 'Cisco Email Security'],
  [/mailgun\.org$/i, 'Mailgun'],
  [/sendgrid\.net$/i, 'SendGrid'],
  [/fireeyecloud\.com$/i, 'Trellix Email Security'],
  [/barracudanetworks\.com$/i, 'Barracuda'],
];

const detectProviders = (mxRecords) => {
  const seen = new Set();
  return mxRecords.reduce((out, { exchange }) => {
    const match = MX_PROVIDERS.find(([re]) => re.test(exchange));
    if (match && !seen.has(match[1])) {
      seen.add(match[1]);
      out.push({ provider: match[1], value: exchange });
    }
    return out;
  }, []);
};

const mailConfigHandler = async (url) => {
  const { hostname: domain } = parseTarget(url);
  try {
    const [mxRecords, rootTxt, dmarcTxt, bimiTxt, dkimResults] = await Promise.all([
      dns.resolveMx(domain),
      safeTxt(domain),
      safeTxt(`_dmarc.${domain}`),
      safeTxt(`default._bimi.${domain}`),
      findDkim(domain),
    ]);

    // Collect email-relevant TXT records
    const emailTxt = rootTxt.filter((r) => {
      const s = r.join('').toLowerCase();
      return s.startsWith('v=spf1');
    });
    dmarcTxt.forEach((r) => emailTxt.push(r));
    bimiTxt.forEach((r) => emailTxt.push(r));
    dkimResults.forEach(({ record }) => emailTxt.push(record));

    return {
      mxRecords,
      txtRecords: emailTxt,
      mailServices: detectProviders(mxRecords),
    };
  } catch (error) {
    if (error.code === 'ENOTFOUND' || error.code === 'ENODATA') {
      return { skipped: 'No mail server in use on this domain' };
    }
    return { error: `Mail config lookup failed: ${error.message}` };
  }
};

export const handler = middleware(mailConfigHandler);
export default handler;
