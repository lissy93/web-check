import type { Analyzer } from '../types';

// Any positive hit on a reputable threat feed is critical
const threats: Analyzer = (d) => {
  const out: ReturnType<Analyzer> = [];
  if (d.safeBrowsing?.unsafe) {
    out.push({
      severity: 'critical',
      title: 'Listed by Google Safe Browsing',
      detail: 'Site flagged for malware, phishing or unwanted software',
    });
  }
  if (Array.isArray(d.urlHaus?.urls) && d.urlHaus.urls.length) {
    out.push({ severity: 'critical', title: 'Listed on URLhaus malware feed' });
  }
  const phishUrl = d.phishTank?.url0?.in_database;
  if (phishUrl === 'true' || phishUrl === true) {
    out.push({ severity: 'critical', title: 'Listed on PhishTank' });
  }
  if (d.cloudmersive?.CleanResult === false) {
    out.push({ severity: 'critical', title: 'Cloudmersive flagged this site as unsafe' });
  }
  if (!out.length) out.push({ severity: 'pass', title: 'No threat feed matches' });
  return out;
};

export default threats;
