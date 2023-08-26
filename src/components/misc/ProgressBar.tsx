import styled from 'styled-components';
import colors from 'styles/colors';
import Card from 'components/Form/Card';
import Heading from 'components/Form/Heading';
import { useState, useEffect, ReactNode } from 'react';


const LoadCard = styled(Card)`
  margin: 0 auto 1rem auto;
  width: 95vw;
  position: relative;
  transition: all 0.2s ease-in-out;
  &.hidden {
    height: 0;
    overflow: hidden;
    margin: 0;
    padding: 0;
  }
`;

const ProgressBarContainer = styled.div`
  width: 100%;
  height: 0.5rem;
  background: ${colors.bgShadowColor};
  border-radius: 4px;
  overflow: hidden;
`;

const ProgressBarSegment = styled.div<{ color: string, color2: string, width: number }>`
  height: 1rem;
  display: inline-block;
  width: ${props => props.width}%;
  background: ${props => props.color};
  background: ${props => props.color2 ?
      `repeating-linear-gradient( 315deg, ${props.color}, ${props.color} 3px, ${props.color2} 3px, ${props.color2} 6px )`
      : props.color};
  transition: width 0.5s ease-in-out;
`;

const Details = styled.details`
  transition: all 0.2s ease-in-out;
  summary {
    margin: 0.5rem 0;
    font-weight: bold;
    cursor: pointer;
  }
  summary:before {
    content: "►";
    position: absolute;
    margin-left: -1rem;
    color: ${colors.primary};
    cursor: pointer;
  }
  &[open] summary:before {
    content: "▼";
  }
  ul {
    list-style: none;
    padding: 0.25rem;
    border-radius: 4px;
    width: fit-content;
    li b {
      cursor: pointer;
    }
    i {
      color: ${colors.textColorSecondary};
    }
  }
  p.error {
    margin: 0.5rem 0;
    opacity: 0.75;
    color: ${colors.danger};
  }
`;

const StatusInfoWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  .run-status {
    color: ${colors.textColorSecondary};
    margin: 0;
  }
`;

const AboutPageLink = styled.a`
  color: ${colors.primary};
`;

const SummaryContainer = styled.div`
  margin: 0.5rem 0;
  b {
    margin: 0;
    font-weight: bold;
  }
  p {
    margin: 0;
    opacity: 0.75;
  }
  &.error-info {
    color: ${colors.danger};
  }
  &.success-info {
    color: ${colors.success};
  }
  &.loading-info {
    color: ${colors.info};
  }
  .skipped {
    margin-left: 0.75rem;
    color: ${colors.warning};
  }
  .success {
    margin-left: 0.75rem;
    color: ${colors.success};
  }
`;

const ReShowContainer = styled.div`
  position: relative;
  &.hidden {
    height: 0;
    overflow: hidden;
    margin: 0;
    padding: 0;
  }
  button { background: none;}
`;

const DismissButton = styled.button`
  width: fit-content;
  position: absolute;
  right: 1rem;
  bottom: 1rem;
  background: ${colors.background};
  color: ${colors.textColorSecondary};
  border: none;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-family: PTMono;
  cursor: pointer;
  &:hover {
    color: ${colors.primary};
  }
`;

const FailedJobActionButton = styled.button`
  margin: 0.1rem 0.1rem 0.1rem 0.5rem;
  background: ${colors.background};
  color: ${colors.textColorSecondary};
  border: none;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-family: PTMono;
  cursor: pointer;
  border: 1px solid ${colors.textColorSecondary};
  transition: all 0.2s ease-in-out;
  &:hover {
    color: ${colors.primary};
    border: 1px solid ${colors.primary};
  } 
`;

const ErrorModalContent = styled.div`
p {
  margin: 0;
}
pre {
  color: ${colors.danger};
  &.info {
    color: ${colors.warning};
  }
}
`;

export type LoadingState = 'success' | 'loading' | 'skipped' | 'error' | 'timed-out';

export interface LoadingJob {
  name: string,
  state: LoadingState,
  error?: string,
  timeTaken?: number,
  retry?: () => void,
}

const jobNames = [
  'get-ip',
  'location',
  'ssl',
  'domain',
  'quality',
  'tech-stack',
  'server-info',
  'cookies',
  'headers',
  'dns',
  'hosts',
  'http-security',
  'social-tags',
  'trace-route',
  'security-txt',
  'dns-server',
  'firewall',
  'dnssec',
  'hsts',
  'threats',
  'mail-config',
  'archives',
  'rank',
  'screenshot',
  'tls-cipher-suites',
  'tls-security-config',
  'tls-client-support',
  'redirects',
  'linked-pages',
  'robots-txt',
  'status',
  'ports',
  // 'whois',
  'txt-records',
  'block-lists',
  'features',
  'sitemap',
  'carbon',
] as const;

export const initialJobs = jobNames.map((job: string) => {
  return {
    name: job,
    state: 'loading' as LoadingState,
    retry: () => {}
  }
});

export const calculateLoadingStatePercentages = (loadingJobs: LoadingJob[]): Record<LoadingState | string, number> => {
  const totalJobs = loadingJobs.length;

  // Initialize count object
  const stateCount: Record<LoadingState, number> = {
    'success': 0,
    'loading': 0,
    'skipped': 0,
    'error': 0,
    'timed-out': 0,
  };

  // Count the number of each state
  loadingJobs.forEach((job) => {
    stateCount[job.state] += 1;
  });

  // Convert counts to percentages
  const statePercentage: Record<LoadingState, number> = {
    'success': (stateCount['success'] / totalJobs) * 100,
    'loading': (stateCount['loading'] / totalJobs) * 100,
    'skipped': (stateCount['skipped'] / totalJobs) * 100,
    'error': (stateCount['error'] / totalJobs) * 100,
    'timed-out': (stateCount['timed-out'] / totalJobs) * 100,
  };

  return statePercentage;
};

const MillisecondCounter = (props: {isDone: boolean}) => {
  const { isDone } = props;
  const [milliseconds, setMilliseconds] = useState<number>(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    // Start the timer as soon as the component mounts
    if (!isDone) {
      timer = setInterval(() => {
        setMilliseconds(milliseconds => milliseconds + 100);
      }, 100);
    }
    // Clean up the interval on unmount
    return () => {
      clearInterval(timer);
    };
  }, [isDone]); // If the isDone prop changes, the effect will re-run

  return <span>{milliseconds} ms</span>;
};

const RunningText = (props: { state: LoadingJob[], count: number }): JSX.Element => {
  const loadingTasksCount = jobNames.length - props.state.filter((val: LoadingJob) => val.state === 'loading').length;
  const isDone = loadingTasksCount >= jobNames.length;
  return (
    <p className="run-status">
    { isDone ? 'Finished in ' : `Running ${loadingTasksCount} of ${jobNames.length} jobs - ` }
    <MillisecondCounter isDone={isDone} />
    </p>
  );
};

const SummaryText = (props: { state: LoadingJob[], count: number }): JSX.Element => {
  const totalJobs = jobNames.length;
  let failedTasksCount = props.state.filter((val: LoadingJob) => val.state === 'error').length;
  let loadingTasksCount = props.state.filter((val: LoadingJob) => val.state === 'loading').length;
  let skippedTasksCount = props.state.filter((val: LoadingJob) => val.state === 'skipped').length;
  let successTasksCount = props.state.filter((val: LoadingJob) => val.state === 'success').length;

  const jobz = (jobCount: number) => `${jobCount} ${jobCount === 1 ? 'job' : 'jobs'}`;

  const skippedInfo = skippedTasksCount > 0 ? (<span className="skipped">{jobz(skippedTasksCount)} skipped </span>) : null;
  const successInfo = successTasksCount > 0 ? (<span className="success">{jobz(successTasksCount)} successful </span>) : null;
  const failedInfo = failedTasksCount > 0 ? (<span className="error">{jobz(failedTasksCount)} failed </span>) : null;

  if (loadingTasksCount > 0) {
    return (
      <SummaryContainer className="loading-info">
        <b>Loading {totalJobs - loadingTasksCount} / {totalJobs} Jobs</b>
        {skippedInfo}
      </SummaryContainer>
    );
  }

  if (failedTasksCount === 0) {
    return (
      <SummaryContainer className="success-info">
        <b>{successTasksCount} Jobs Completed Successfully</b>
        {skippedInfo}
      </SummaryContainer>
    );
  }

  return (
    <SummaryContainer className="error-info">
      {successInfo}
      {skippedInfo}
      {failedInfo}
    </SummaryContainer>
  );
};

const ProgressLoader = (props: { loadStatus: LoadingJob[], showModal: (err: ReactNode) => void, showJobDocs: (job: string) => void }): JSX.Element => {
  const [ hideLoader, setHideLoader ] = useState<boolean>(false);
  const loadStatus = props.loadStatus;
  const percentages = calculateLoadingStatePercentages(loadStatus);

  const loadingTasksCount = jobNames.length - loadStatus.filter((val: LoadingJob) => val.state === 'loading').length;
  const isDone = loadingTasksCount >= jobNames.length;

  const makeBarColor = (colorCode: string): [string, string] => {
    const amount = 10;
    const darkerColorCode = '#' + colorCode.replace(/^#/, '').replace(
      /../g,
      colorCode => ('0' + Math.min(255, Math.max(0, parseInt(colorCode, 16) - amount)).toString(16)).slice(-2),
    );
    return [colorCode, darkerColorCode];
  };

  const barColors: Record<LoadingState | string, [string, string]> = {
    'success': isDone ? makeBarColor(colors.primary) : makeBarColor(colors.success),
    'loading': makeBarColor(colors.info),
    'skipped': makeBarColor(colors.warning),
    'error': makeBarColor(colors.danger),
    'timed-out': makeBarColor(colors.neutral),
  };

  const getStatusEmoji = (state: LoadingState): string => {
    switch (state) {
      case 'success':
        return '✅';
      case 'loading':
        return '🔄';
      case 'skipped':
        return '⏭️';
      case 'error':
        return '❌';
      case 'timed-out':
        return '⏸️';
      default:
        return '❓';
    }
  };

  const showErrorModal = (name: string, state: LoadingState, timeTaken: number | undefined, error: string, isInfo?: boolean) => {
    const errorContent = (
      <ErrorModalContent>
        <Heading as="h3">Error Details for {name}</Heading>
        <p>
          The {name} job failed with an {state} state after {timeTaken} ms.
          The server responded with the following error:
        </p>
        { /* If isInfo == true, then add .info className to pre */}
        <pre className={isInfo ? 'info' : 'error'}>{error}</pre>
      </ErrorModalContent>
    );
    props.showModal(errorContent);
  };

  return (
  <>
  <ReShowContainer className={!hideLoader ? 'hidden' : ''}>
    <DismissButton onClick={() => setHideLoader(false)}>Show Load State</DismissButton>
  </ReShowContainer>
  <LoadCard className={hideLoader ? 'hidden' : ''}>
    <ProgressBarContainer>
      {Object.keys(percentages).map((state: string | LoadingState) =>
        <ProgressBarSegment 
          color={barColors[state][0]} 
          color2={barColors[state][1]} 
          title={`${state} (${Math.round(percentages[state])}%)`}
          width={percentages[state]}
          key={`progress-bar-${state}`}
        />
      )}
    </ProgressBarContainer>
    
    <StatusInfoWrapper>
      <SummaryText state={loadStatus} count={loadStatus.length} />
      <RunningText state={loadStatus} count={loadStatus.length} />
    </StatusInfoWrapper>

    <Details>
      <summary>Show Details</summary>
      <ul>
        {
          loadStatus.map(({ name, state, timeTaken, retry, error }: LoadingJob) => {
            return (
              <li key={name}>
                <b onClick={() => props.showJobDocs(name)}>{getStatusEmoji(state)} {name}</b>
                <span style={{color : barColors[state][0]}}> ({state})</span>.
                <i>{(timeTaken && state !== 'loading') ? ` Took ${timeTaken} ms` : '' }</i>
                { (retry && state !== 'success' && state !== 'loading') && <FailedJobActionButton onClick={retry}>↻ Retry</FailedJobActionButton> }
                { (error && state === 'error') && <FailedJobActionButton onClick={() => showErrorModal(name, state, timeTaken, error)}>■ Show Error</FailedJobActionButton> }
                { (error && state === 'skipped') && <FailedJobActionButton onClick={() => showErrorModal(name, state, timeTaken, error, true)}>■ Show Reason</FailedJobActionButton> }
              </li>
            );
          })
        }
      </ul>
      { loadStatus.filter((val: LoadingJob) => val.state === 'error').length > 0 &&
        <p className="error">
          <b>Check the browser console for logs and more info</b><br />
          It's normal for some jobs to fail, either because the host doesn't return the required info,
          or restrictions in the lambda function, or hitting an API limit.
        </p>}
        <AboutPageLink href="/about" target="_blank" rel="noreferer" >Learn More about Web-Check</AboutPageLink>
    </Details>
    <DismissButton onClick={() => setHideLoader(true)}>Dismiss</DismissButton>
  </LoadCard>
  </>
  );
}



export default ProgressLoader;
