import type { Analyzer } from '../types';

// Locate first TXT record matching prefix (case-insensitive), null when absent
const findTxt = (records: string[][], prefix: string): string | null => {
  if (!Array.isArray(records)) return null;
  const re = new RegExp(`^${prefix}`, 'i');
  for (const chunks of records) {
    const full = Array.isArray(chunks) ? chunks.join('') : String(chunks);
    if (re.test(full)) return full;
  }
  return null;
};

// Audit SPF, DMARC, DKIM presence and DMARC policy strength
const mailConfig: Analyzer = (d) => {
  const txt = d.txtRecords || [];
  const out: ReturnType<Analyzer> = [];

  const spf = findTxt(txt, 'v=spf1');
  if (!spf) {
    out.push({
      severity: 'issue',
      title: 'No SPF record found',
      detail: 'Publish v=spf1 to authorise legitimate mail senders',
    });
  } else if (/[+?]all\b/i.test(spf)) {
    out.push({
      severity: 'warning',
      title: 'SPF policy permits unauthorised senders',
      detail: 'Tighten the SPF policy to ~all or -all',
    });
  } else {
    out.push({ severity: 'pass', title: 'SPF record published' });
  }

  const dmarc = findTxt(txt, 'v=DMARC1');
  if (!dmarc) {
    out.push({
      severity: 'issue',
      title: 'No DMARC record found',
      detail: 'Publish v=DMARC1 on _dmarc subdomain to prevent spoofing',
    });
  } else {
    const policy = dmarc.match(/p=(\w+)/i)?.[1]?.toLowerCase();
    if (policy === 'reject') out.push({ severity: 'pass', title: 'DMARC policy: reject' });
    else if (policy === 'quarantine')
      out.push({ severity: 'info', title: 'DMARC policy: quarantine' });
    else if (policy === 'none') {
      out.push({
        severity: 'warning',
        title: 'DMARC policy is monitor-only',
        detail: 'Move from p=none to p=quarantine or p=reject when ready',
      });
    }
  }

  // DKIM detection is best-effort: only flag absence as a soft warning
  const hasDkim = txt.some((r: string[]) => Array.isArray(r) && /v=DKIM1/i.test(r.join('')));
  if (!hasDkim) {
    out.push({
      severity: 'warning',
      title: 'No DKIM record discovered on common selectors',
      detail: 'Publish a DKIM key so receivers can verify message signatures',
    });
  } else {
    out.push({ severity: 'pass', title: 'DKIM key found' });
  }

  return out;
};

export default mailConfig;
