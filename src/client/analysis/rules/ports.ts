import type { Analyzer, Severity } from '../types';

// Port -> [severity, description]. Anything not listed is informational
const RISKY: Record<number, [Severity, string]> = {
  21: ['warning', 'FTP (cleartext file transfer)'],
  23: ['critical', 'Telnet (cleartext shell)'],
  25: ['info', 'SMTP (mail server)'],
  110: ['warning', 'POP3 (cleartext mail)'],
  143: ['warning', 'IMAP (cleartext mail)'],
  3306: ['critical', 'MySQL exposed to the internet'],
  3389: ['warning', 'RDP exposed to the internet'],
  5900: ['warning', 'VNC exposed to the internet'],
};

// Flag risky open ports, ignore the safe defaults like 80/443
const ports: Analyzer = (d) => {
  if (!d || !Array.isArray(d.openPorts)) return [];
  const out: ReturnType<Analyzer> = [];
  for (const p of d.openPorts) {
    const port = Number(p);
    const known = RISKY[port];
    if (known) {
      out.push({
        severity: known[0],
        title: `Port ${port} open: ${known[1]}`,
        detail: 'Close it or restrict access by firewall if not required',
      });
    }
  }
  return out;
};

export default ports;
