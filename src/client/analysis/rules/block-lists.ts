import type { Analyzer } from '../types';

// Domain is suspicious when blocked by family/security DNS resolvers
const blockLists: Analyzer = (d) => {
  if (!d || !Array.isArray(d.blocklists)) return [];
  const blocked = d.blocklists.filter((b: any) => b?.isBlocked);
  if (!blocked.length) return [{ severity: 'pass', title: 'Not on any tested DNS blocklist' }];
  const names = blocked.map((b: any) => b.server).join(', ');
  const severity = blocked.length >= 3 ? 'critical' : 'issue';
  return [
    {
      severity,
      title: `Blocked by ${blocked.length} DNS resolver(s)`,
      detail: `Listed by ${names}`,
    },
  ];
};

export default blockLists;
