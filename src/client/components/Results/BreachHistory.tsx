import styled from '@emotion/styled';
import colors from 'client/styles/colors';
import { Card } from 'client/components/Form/Card';
import Row from 'client/components/Form/Row';

type Tier = 'critical' | 'high' | 'medium' | 'low';

interface DataClass {
  name: string;
  tier: Tier;
}

interface Breach {
  name: string;
  title: string;
  domain: string | null;
  breachDate: string | null;
  accounts: number | null;
  description: string;
  logo: string | null;
  dataClasses: DataClass[];
  severity: Tier;
  verified: boolean;
  fabricated: boolean;
  spamList: boolean;
  sensitive: boolean;
  retired: boolean;
  malware: boolean;
  stealerLog: boolean;
  trustworthy: boolean;
}

interface BreachHistory {
  domain: string;
  redirectedTo?: string | null;
  domainsChecked?: string[];
  breaches: Breach[];
  summary: {
    total: number;
    totalAccounts: number;
    worstSeverity: Tier | null;
    latestBreachDate: string | null;
    verifiedCount: number;
    unverifiedCount: number;
  };
  source?: { name: string; url: string; license: string; licenseUrl: string };
}

const tierColors: Record<Tier, string> = {
  critical: colors.danger,
  high: colors.error,
  medium: colors.warning,
  low: colors.info,
};

const cardStyles = `
  max-height: 60rem;
`;

const AllClear = styled.p`
  color: ${colors.success};
  margin: 0.5rem 0;
`;

const BreachList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0.5rem 0 0 0;
`;

const BreachItem = styled.li<{ tier: Tier }>`
  border-left: 3px solid ${(props) => tierColors[props.tier]};
  background: ${colors.primaryTransparent};
  border-radius: 0 4px 4px 0;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
`;

const BreachHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  img {
    width: 1.5rem;
    height: 1.5rem;
    object-fit: contain;
    border-radius: 2px;
  }
  b {
    flex: 1;
  }
`;

const Badge = styled.span<{ tone: string }>`
  background: ${(props) => props.tone};
  color: ${colors.backgroundDarker};
  border-radius: 4px;
  padding: 0.1rem 0.4rem;
  font-size: 0.75rem;
  font-weight: bold;
  text-transform: uppercase;
  white-space: nowrap;
`;

const ExposedData = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0.35rem 0 0 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  li {
    background: ${colors.background};
    border-radius: 4px;
    padding: 0.05rem 0.4rem;
    font-size: 0.8rem;
  }
  li:before {
    content: '●';
    margin-right: 0.3rem;
  }
`;

const Caveat = styled.p`
  color: ${colors.warning};
  font-size: 0.8rem;
  margin: 0.35rem 0 0 0;
`;

const RedirectNote = styled.p`
  color: ${colors.info};
  font-size: 0.8rem;
  margin: 0.5rem 0 0 0;
`;

const RecordedAgainst = styled.p`
  color: ${colors.textColorSecondary};
  font-size: 0.75rem;
  margin: 0.35rem 0 0 0;
`;

const Description = styled.p`
  color: ${colors.textColorSecondary};
  font-size: 0.8rem;
  margin: 0.35rem 0 0 0;
`;

const Attribution = styled.small`
  display: block;
  margin-top: 0.5rem;
  color: ${colors.textColorSecondary};
  a {
    color: ${colors.primary};
  }
`;

// 152445165 -> "152.4M", so a headline number stays readable
const formatAccounts = (value: number | null): string => {
  if (value === null || !Number.isFinite(value)) return 'Unknown';
  if (value >= 1e9) return `${(value / 1e9).toFixed(1)}B`;
  if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
  if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
  return value.toString();
};

// Everything that qualifies how much weight a reader should give an entry
const caveatsFor = (breach: Breach): string[] => {
  const caveats: string[] = [];
  if (breach.fabricated) caveats.push('flagged by HIBP as likely fabricated');
  if (!breach.verified && !breach.fabricated) caveats.push('unverified by HIBP');
  if (breach.spamList) caveats.push('a spam list rather than a service breach');
  if (breach.stealerLog) caveats.push('sourced from stealer malware logs');
  if (breach.malware) caveats.push('malware-sourced');
  if (breach.retired) caveats.push('retired from the HIBP index');
  return caveats;
};

const BreachRow = (props: { breach: Breach; scannedDomain: string }): JSX.Element => {
  const { breach, scannedDomain } = props;
  const caveats = caveatsFor(breach);
  // Only ever attributed to the domain HIBP recorded it against, so a redirect
  // never quietly transfers someone else's breach onto the scanned domain
  const otherDomain = breach.domain && breach.domain !== scannedDomain ? breach.domain : null;
  return (
    <BreachItem tier={breach.severity}>
      <BreachHeader>
        {breach.logo && <img src={breach.logo} alt="" loading="lazy" />}
        <b>{breach.title}</b>
        {breach.trustworthy ? (
          <Badge tone={colors.success}>✓ Verified</Badge>
        ) : (
          <Badge tone={colors.warning}>Unconfirmed</Badge>
        )}
      </BreachHeader>
      {breach.breachDate && <Row lbl="Breached" val={breach.breachDate} />}
      <Row lbl="Accounts affected" val={formatAccounts(breach.accounts)} />
      {breach.dataClasses.length > 0 && (
        <>
          <Row lbl="" val="">
            <span className="lbl">Exposed data</span>
          </Row>
          <ExposedData>
            {breach.dataClasses.map((cls) => (
              <li key={cls.name} style={{ color: tierColors[cls.tier] }} title={`${cls.tier} risk`}>
                <span style={{ color: colors.textColor }}>{cls.name}</span>
              </li>
            ))}
          </ExposedData>
        </>
      )}
      {otherDomain && <RecordedAgainst>Recorded against {otherDomain}</RecordedAgainst>}
      {caveats.length > 0 && <Caveat>⚠️ Treat with care — {caveats.join(', ')}</Caveat>}
      {breach.description && <Description>{breach.description}</Description>}
    </BreachItem>
  );
};

const BreachHistoryCard = (props: {
  data: BreachHistory;
  title: string;
  actionButtons: any;
}): JSX.Element => {
  const {
    breaches = [],
    summary,
    domain,
    redirectedTo,
    domainsChecked,
    source,
  } = props.data || ({} as BreachHistory);
  const checked = domainsChecked?.length ? domainsChecked.join(' and ') : domain || 'this domain';

  return (
    <Card heading={props.title} actionButtons={props.actionButtons} styles={cardStyles}>
      {redirectedTo && (
        <RedirectNote>
          ℹ️ {domain} redirects to {redirectedTo}, so both were checked
        </RedirectNote>
      )}
      {breaches.length === 0 ? (
        <AllClear>✅ No known breaches for {checked}</AllClear>
      ) : (
        <>
          <Row lbl="Known breaches" val={summary.total.toString()} />
          <Row lbl="Accounts affected" val={formatAccounts(summary.totalAccounts)} />
          {summary.latestBreachDate && <Row lbl="Most recent" val={summary.latestBreachDate} />}
          <BreachList>
            {breaches.map((breach) => (
              <BreachRow key={breach.name} breach={breach} scannedDomain={domain} />
            ))}
          </BreachList>
        </>
      )}
      {source && (
        <Attribution>
          Source:{' '}
          <a href={source.url} target="_blank" rel="noreferrer">
            {source.name}
          </a>
          , licensed under{' '}
          <a href={source.licenseUrl} target="_blank" rel="noreferrer">
            {source.license}
          </a>
        </Attribution>
      )}
    </Card>
  );
};

export default BreachHistoryCard;
