// Days until an ISO/parseable date string, or null when unparseable
export const daysUntil = (raw: unknown): number | null => {
  if (typeof raw !== 'string') return null;
  const t = Date.parse(raw);
  if (!Number.isFinite(t)) return null;
  return Math.floor((t - Date.now()) / 86_400_000);
};
