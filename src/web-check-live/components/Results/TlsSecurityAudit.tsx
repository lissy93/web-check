import { Card } from 'web-check-live/components/Form/Card';
import Row from 'web-check-live/components/Form/Row';

// Booleans are direct, ints follow SSL Labs scheme: 1 = safe, 2/3 = vulnerable
const isVulnerable = (v: any): boolean => {
  if (typeof v === 'boolean') return v;
  if (typeof v === 'number') return v === 2 || v === 3;
  return false;
};

const yesNo = (v: any) => (v ? '✅ Yes' : '❌ No');
const yesNoVuln = (v: any) => (v ? '⚠️ Yes' : '✅ No');

const fwdSecrecy = (n: number): string => {
  if (!n) return '❌ No';
  if (n & 4) return '✅ With all browsers';
  if (n & 2) return '⚠️ With most modern browsers';
  if (n & 1) return '⚠️ Limited';
  return '❌ No';
};

const hsts = (policy?: any): string => {
  if (!policy || policy.status !== 'present') return '❌ Not set';
  const days = Math.round((policy.maxAge || 0) / 86400);
  const sub = policy.includeSubDomains ? ' + includeSubDomains' : '';
  return days >= 365 ? `✅ ${days} days${sub}` : `⚠️ ${days} days${sub} (recommend >= 365)`;
};

const reneg = (n?: number): string => {
  if (!n) return '⚠️ Insecure';
  const flags = [];
  if (n & 1) flags.push('secure');
  if (n & 2) flags.push('client-init');
  if (n & 4) flags.push('server-required');
  return `✅ ${flags.join(', ') || 'unknown'}`;
};

const sessionResumption = (n?: number): string =>
  n === 1 ? '✅ Tickets' : n === 2 ? '✅ Tickets (no client cert)' : '❌ Disabled';

const compression = (n?: number): string => (n ? '⚠️ Supported (CRIME risk)' : '✅ Disabled');

// Each entry returns the value string, or null/undefined to hide the row entirely
const POSTURE: Array<[string, (d: any) => string | null | undefined]> = [
  ['Forward Secrecy', (d) => fwdSecrecy(d.forwardSecrecy)],
  ['HSTS', (d) => hsts(d.hstsPolicy)],
  ['Session Resumption', (d) => sessionResumption(d.sessionResumption)],
  ['OCSP Stapling', (d) => yesNo(d.ocspStapling)],
  ['Renegotiation', (d) => reneg(d.renegSupport)],
  ['Fallback SCSV (downgrade protection)', (d) => yesNo(d.fallbackScsv)],
  ['Certificate Transparency', (d) => yesNo(d.hasSct)],
  ['HTTP -> HTTPS Forwarding', (d) => (d.httpForwarding == null ? null : yesNo(d.httpForwarding))],
  ['ChaCha20 Preferred', (d) => yesNo(d.chaCha20Preference)],
  ['AEAD Cipher Support', (d) => yesNo(d.supportsAead)],
  ['Legacy CBC Cipher Support', (d) => yesNoVuln(d.supportsCBC)],
  ['TLS Compression', (d) => compression(d.compressionMethods)],
  ['Static DH Key Reuse', (d) => yesNoVuln(d.dhYsReuse)],
  ['Weak DH Primes', (d) => yesNoVuln(d.dhUsesKnownPrimes)],
  ['Static ECDH Parameter Reuse', (d) => yesNoVuln(d.ecdhParameterReuse)],
];

const VULNS: Array<[string, string]> = [
  ['heartbleed', 'Heartbleed'],
  ['poodle', 'POODLE (SSLv3)'],
  ['poodleTls', 'POODLE (TLS)'],
  ['zombiePoodle', 'Zombie POODLE'],
  ['goldenDoodle', 'GOLDENDOODLE'],
  ['sleepingPoodle', 'Sleeping POODLE'],
  ['zeroLengthPaddingOracle', 'Zero-Length Padding Oracle'],
  ['freak', 'FREAK'],
  ['logjam', 'LOGJAM'],
  ['drownVulnerable', 'DROWN'],
  ['openSslCcs', 'OpenSSL CCS Injection'],
  ['openSSLLuckyMinus20', 'Lucky13'],
  ['bleichenbacher', 'ROBOT (Bleichenbacher)'],
  ['ticketbleed', 'Ticketbleed'],
];

const TlsSecurityAuditCard = (props: {
  data: any;
  title: string;
  actionButtons: any;
}): JSX.Element | null => {
  const ep = props.data?.endpoints?.[0];
  if (!ep?.details) return null;
  const d = ep.details;
  const protocols = (d.protocols || []).map((p: any) => `${p.name} ${p.version}`).join(', ');
  return (
    <Card heading={props.title} actionButtons={props.actionButtons}>
      {ep.grade && <Row lbl="Grade" val={ep.grade} />}
      {ep.gradeTrustIgnored && ep.gradeTrustIgnored !== ep.grade && (
        <Row lbl="Grade (trust ignored)" val={ep.gradeTrustIgnored} />
      )}
      {protocols && <Row lbl="Protocols" val={protocols} />}
      {POSTURE.map(([label, getter]) => {
        const val = getter(d);
        return val ? <Row key={label} lbl={label} val={val} /> : null;
      })}
      {VULNS.map(([key, label]) => (
        <Row key={key} lbl={label} val={isVulnerable(d[key]) ? '⚠️ Vulnerable' : '✅ Safe'} />
      ))}
    </Card>
  );
};

export default TlsSecurityAuditCard;
