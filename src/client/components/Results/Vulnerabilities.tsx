import colors from 'client/styles/colors';
import { Card } from 'client/components/Form/Card';
import Row from 'client/components/Form/Row';
import { fromFinding } from 'client/components/misc/Icon';
import type { Vuln } from 'client/utils/result-processor';
import { formatNumber } from 'client/utils/format';
import checkVulns from 'client/analysis/rules/vulnerabilities';

const cardStyles = `
  .cves {
    max-height: 22rem;
    overflow: auto;
  }
  .cves a {
    color: ${colors.textColor};
    &:hover { color: ${colors.primaryIncreasedContrast} }
  }
  b { color: ${colors.danger} }
  small { color: ${colors.textColorSecondary} }
`;

const VulnerabilitiesCard = (props: {
  data: any;
  title: string;
  actionButtons: any;
}): JSX.Element => {
  const vulns: Vuln[] = props.data.vulns || [];
  const exploited = vulns.filter((v) => v.kev).length;
  const [finding] = checkVulns(props.data);
  // The row's visible value is just the count, but copying only "2" is not useful,
  // so give the clipboard the same CVE lines that are shown on the card
  const cveList = vulns
    .map((v) =>
      [
        v.id,
        v.kev && 'Exploited',
        v.epss != null && `EPSS ${formatNumber(v.epss * 100, { digits: 1 })}%`,
        v.cvss != null && `CVSS ${formatNumber(v.cvss, { digits: 1 })}`,
        v.port && `${v.product || 'Port'} ${v.port}`,
      ]
        .filter(Boolean)
        .join('  ')
    )
    .join('\n');
  return (
    <Card heading={props.title} actionButtons={props.actionButtons} styles={cardStyles}>
      <Row
        lbl="Known CVEs"
        val={vulns.length || 'None'}
        copyText={vulns.length ? cveList : undefined}
        term="cve"
        {...fromFinding(finding)}
      />
      {exploited > 0 && (
        <Row lbl="Actively exploited" val={exploited} status="error" term="known-exploited" />
      )}
      <div className="cves">
        {vulns.map((v) => (
          <Row key={v.id}>
            <span>
              <a href={`https://nvd.nist.gov/vuln/detail/${v.id}`} target="_blank" rel="noreferrer">
                {v.id}
              </a>{' '}
              {v.kev && <b title="In CISA's Known Exploited Vulnerabilities catalog">Exploited</b>}
            </span>
            <small>
              {[
                v.epss != null && `EPSS ${formatNumber(v.epss * 100, { digits: 1 })}%`,
                v.cvss != null && `CVSS ${formatNumber(v.cvss, { digits: 1 })}`,
                v.port && `${v.product || 'Port'} ${v.port}`,
              ]
                .filter(Boolean)
                .join(' · ')}
            </small>
          </Row>
        ))}
      </div>
    </Card>
  );
};

export default VulnerabilitiesCard;
