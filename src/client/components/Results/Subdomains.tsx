import { Card } from 'client/components/Form/Card';
import Row from 'client/components/Form/Row';
import colors from 'client/styles/colors';

const cardStyles = `
  ul {
    list-style: none;
    padding: 0;
    margin: 0.5rem 0 0 0;
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
  small {
    display: block;
    margin-top: 0.75rem;
    opacity: 0.5;
  }
`;

const SubdomainsCard = (props: { data: any; title: string; actionButtons: any }): JSX.Element => {
  const { domain, count, truncated, subdomains = [], source } = props.data;
  return (
    <Card heading={props.title} actionButtons={props.actionButtons} styles={cardStyles}>
      <Row lbl="Base Domain" val={domain} />
      <Row lbl="Subdomains Found" val={count} />
      {truncated && <Row lbl="Showing" val={`First ${subdomains.length}`} />}
      <ul>
        {subdomains.map((sub: string) => (
          <li key={sub}>
            <a href={`https://${sub}`} target="_blank" rel="noreferrer">
              {sub}
            </a>
          </li>
        ))}
      </ul>
      {source && <small>Source: Certificate Transparency logs via {source}</small>}
    </Card>
  );
};

export default SubdomainsCard;
