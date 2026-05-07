import colors from 'web-check-live/styles/colors';

type Outcome = 'success' | 'error' | 'timed-out';

const HEADING: Record<Outcome, string> = {
  success: 'Success',
  error: 'Error',
  'timed-out': 'Timeout',
};

const VERB: Record<Outcome, string> = {
  success: 'succeeded in',
  error: 'failed after',
  'timed-out': 'timed out after',
};

const ACCENT: Record<Outcome, string> = {
  success: colors.success,
  error: colors.danger,
  'timed-out': colors.info,
};

// HH:MM:SS clock prefix.
const stamp = (d: Date) =>
  `[${`${d.getHours()}`.padStart(2, '0')}:` +
  `${`${d.getMinutes()}`.padStart(2, '0')}:` +
  `${`${d.getSeconds()}`.padStart(2, '0')}]`;

// Fancy console banner showing the result of a job, plus the trailing detail (error or hint).
export const logJobOutcome = (
  outcome: Outcome,
  job: string,
  timeTaken: number,
  detail?: string,
) => {
  const accent = ACCENT[outcome];
  const trail =
    outcome === 'success'
      ? `\n%cRun %cwindow.webCheck['${job}']%c to inspect the raw results`
      : `, with the following error:%c\n${detail || 'Unknown error'}`;
  const styles = [
    `background:${accent};color:${colors.background};padding:4px 8px;font-size:16px;border-radius:2px;`,
    `font-weight:bold;color:${accent};`,
    `color:${accent};`,
  ];
  const trailStyles =
    outcome === 'success'
      ? [`color:#1d8242;`, `color:#1d8242;text-decoration:underline;`, `color:#1d8242;`]
      : [`color:${colors.warning};`];
  console.log(
    `%c${HEADING[outcome]} - ${job}%c\n\n${stamp(new Date())}%c The ${job} job ${VERB[outcome]} ${timeTaken}ms${trail}`,
    ...styles,
    ...trailStyles,
  );
};

export default logJobOutcome;
