import styled from '@emotion/styled';
import colors from 'client/styles/colors';
import { Card } from 'client/components/Form/Card';
import Row from 'client/components/Form/Row';

const cardStyles = `
  ul {
    list-style: none;
    padding: 0;
    margin: 0.5rem 0 0 0;
    max-height: 22rem;
    overflow: auto;
    li {
      padding: 0.25rem;
      border-bottom: 1px solid ${colors.primaryTransparent};
      &:last-child { border-bottom: none }
    }
    a {
      color: ${colors.textColor};
      &:hover { color: ${colors.primary} }
    }
  }
`;

const AllClear = styled.p`
  color: ${colors.success};
  margin: 0.5rem 0;
`;

const VulnerabilitiesCard = (props: {
  data: any;
  title: string;
  actionButtons: any;
}): JSX.Element => {
  const vulns: string[] = props.data.vulns || [];
  return (
    <Card heading={props.title} actionButtons={props.actionButtons} styles={cardStyles}>
      {vulns.length === 0 ? (
        <AllClear>✅ No known active vulnerabilities</AllClear>
      ) : (
        <>
          <Row lbl="Known CVEs" val={vulns.length.toString()} />
          <ul>
            {vulns.map((cve) => (
              <li key={cve}>
                <a
                  href={`https://nvd.nist.gov/vuln/detail/${cve}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {cve}
                </a>
              </li>
            ))}
          </ul>
        </>
      )}
    </Card>
  );
};

export default VulnerabilitiesCard;
