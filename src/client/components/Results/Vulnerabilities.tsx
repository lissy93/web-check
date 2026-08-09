import styled from '@emotion/styled';
import colors from 'client/styles/colors';
import { Card } from 'client/components/Form/Card';
import Row from 'client/components/Form/Row';
import type {
  CveEntry,
  CveIntel,
  CvePriorityLevel,
  CveService,
} from 'client/utils/result-processor';
import { asCveIntel } from 'client/utils/result-processor';

const cardStyles = `
  max-height: 60rem;
`;

const priorityColors: Record<CvePriorityLevel, string> = {
  critical: colors.danger,
  high: colors.error,
  medium: colors.warning,
  low: colors.info,
};

const AllClear = styled.p`
  color: ${colors.success};
  margin: 0.5rem 0;
`;

const FeedNotice = styled.p`
  color: ${colors.textColorSecondary};
  font-size: 0.8rem;
  margin: 0.25rem 0 0 0;
`;

const CveList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0.5rem 0 0 0;
`;

const CveItem = styled.li<{ level: CvePriorityLevel }>`
  border-left: 3px solid ${(props) => priorityColors[props.level]};
  background: ${colors.primaryTransparent};
  border-radius: 0 4px 4px 0;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
`;

const CveHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  a {
    color: ${colors.textColor};
    font-weight: bold;
    &:hover {
      color: ${colors.primary};
    }
  }
`;

const PriorityBadge = styled.span<{ level: CvePriorityLevel }>`
  background: ${(props) => priorityColors[props.level]};
  color: ${colors.backgroundDarker};
  border-radius: 4px;
  padding: 0.1rem 0.4rem;
  font-size: 0.75rem;
  font-weight: bold;
  text-transform: uppercase;
  white-space: nowrap;
`;

const Chips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  justify-content: flex-end;
  span {
    background: ${colors.background};
    color: ${colors.textColorSecondary};
    border-radius: 4px;
    padding: 0.05rem 0.35rem;
    font-size: 0.75rem;
  }
`;

const Reason = styled.p`
  color: ${colors.textColorSecondary};
  font-size: 0.8rem;
  margin: 0.35rem 0 0 0;
`;

const Summary = styled.p`
  font-size: 0.8rem;
  margin: 0.25rem 0 0 0;
`;

const percent = (value: number | null | undefined): string =>
  value === null || value === undefined ? 'Unknown' : `${(value * 100).toFixed(1)}%`;

// "HTTPS :443", falling back to the product banner when Shodan has no module
const serviceLabel = (service: CveService): string => {
  const name = (service.module || service.product || 'Service').toUpperCase();
  const version = service.version ? ` ${service.version}` : '';
  return service.port ? `${name}${version} :${service.port}` : `${name}${version}`;
};

const CveRow = (props: { cve: CveEntry }): JSX.Element => {
  const { cve } = props;
  const { kev, epss, priority } = cve;
  return (
    <CveItem level={priority.level}>
      <CveHeader>
        <a href={`https://nvd.nist.gov/vuln/detail/${cve.id}`} target="_blank" rel="noreferrer">
          {cve.id}
        </a>
        <PriorityBadge level={priority.level}>{priority.label}</PriorityBadge>
      </CveHeader>
      <Row lbl="CVSS" val={cve.cvss === null ? 'Unknown' : cve.cvss.toString()} />
      <Row
        lbl="CISA KEV"
        val={kev.listed ? (kev.ransomware ? '🔥 Yes — ransomware' : '🔥 Yes') : 'Not listed'}
      />
      {kev.listed && kev.dateAdded && <Row lbl="KEV added" val={kev.dateAdded} />}
      {kev.listed && kev.dueDate && <Row lbl="CISA due date" val={kev.dueDate} />}
      <Row lbl="EPSS" val={percent(epss?.score)} />
      <Row lbl="Percentile" val={percent(epss?.percentile)} />
      <Row lbl="" val="">
        <span className="lbl">Detected by</span>
        <Chips>
          {cve.detectedBy.map((source) => (
            <span key={source}>{source}</span>
          ))}
        </Chips>
      </Row>
      {cve.services.length > 0 && (
        <Row lbl="" val="">
          <span className="lbl">Exposed service</span>
          <Chips>
            {cve.services.map((service, index) => (
              <span key={`${cve.id}-svc-${index}`}>{serviceLabel(service)}</span>
            ))}
          </Chips>
        </Row>
      )}
      <Reason>{priority.reason}</Reason>
      {cve.summary && <Summary title={cve.summary}>{cve.summary}</Summary>}
    </CveItem>
  );
};

const VulnerabilitiesCard = (props: {
  data: any;
  title: string;
  actionButtons: any;
}): JSX.Element => {
  // parseShodanResults hands us an already-enriched CveIntel, but tolerate the
  // legacy shape (a plain array of CVE ids) in case the API is an older build
  const intel: CveIntel = asCveIntel(props.data?.vulns);
  const { vulns, summary, feeds } = intel;

  return (
    <Card heading={props.title} actionButtons={props.actionButtons} styles={cardStyles}>
      {vulns.length === 0 ? (
        <AllClear>✅ No known active vulnerabilities</AllClear>
      ) : (
        <>
          <Row lbl="Known CVEs" val={summary.total.toString()} />
          <Row lbl="In CISA KEV" val={`${summary.kevCount} of ${summary.total}`} />
          <Row lbl="Highest EPSS" val={percent(summary.maxEpss)} />
          {feeds.kev?.ok === false && (
            <FeedNotice>⚠️ CISA KEV feed unavailable — exploitation status is unknown</FeedNotice>
          )}
          {feeds.epss?.ok === false && (
            <FeedNotice>⚠️ EPSS feed unavailable — exploit probability is unknown</FeedNotice>
          )}
          <CveList>
            {vulns.map((cve) => (
              <CveRow key={cve.id} cve={cve} />
            ))}
          </CveList>
        </>
      )}
    </Card>
  );
};

export default VulnerabilitiesCard;
