import colors from 'client/styles/colors';
import { Card } from 'client/components/Form/Card';
import Row from 'client/components/Form/Row';

const cardStyles = `
  div {
    justify-content: flex-start;
    align-items: baseline; 
  }
  .arrow-thing {
    color: ${colors.primary};
    font-size: 1.8rem;
    font-weight: bold;
    margin-right: 0.5rem;
  }
  .redirect-count {
    color: ${colors.textColorSecondary};
    margin: 0;
  }
`;

const RedirectsCard = (props: { data: any; title: string; actionButtons: any }): JSX.Element => {
  // The API chain includes the original URL as its first entry
  const chain = props.data?.redirects || [];
  const count = Math.max(chain.length - 1, 0);
  return (
    <Card heading={props.title} actionButtons={props.actionButtons} styles={cardStyles}>
      {!count && <Row lbl="" val="No redirects" />}
      {count > 0 && (
        <>
          <p className="redirect-count">
            Followed {count} redirect{count === 1 ? '' : 's'} when contacting host
          </p>
          {chain.slice(1).map((redirect: any, index: number) => (
            <Row lbl="" val="" key={index}>
              <span className="arrow-thing">↳</span> {redirect}
            </Row>
          ))}
        </>
      )}
    </Card>
  );
};

export default RedirectsCard;
