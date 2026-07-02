import type { Analyzer } from '../types';

// Flag missing security.txt and surface useful presence detail
const securityTxt: Analyzer = (d) => {
  if (!d.isPresent) {
    return [
      {
        severity: 'warning',
        title: 'No security.txt published',
        detail: 'Add /.well-known/security.txt with disclosure contact info',
      },
    ];
  }
  const out: ReturnType<Analyzer> = [{ severity: 'pass', title: 'security.txt found' }];
  if (!d.isPgpSigned) {
    out.push({
      severity: 'info',
      title: 'security.txt not PGP signed',
      detail: 'Sign the file to let researchers verify authenticity',
    });
  }
  return out;
};

export default securityTxt;
