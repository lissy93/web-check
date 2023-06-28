
import styled from 'styled-components';
import colors from 'styles/colors';
import Card from 'components/Form/Card';
import Heading from 'components/Form/Heading';
import Row from 'components/Form/Row';

const Outer = styled(Card)`
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
`;

const RedirectsCard = (redirects: any): JSX.Element => {
  return (
    <Outer>
      <Heading as="h3" align="left" color={colors.primary}>Redirects</Heading>
      { !redirects?.redirects.length && <Row lbl="" val="No redirects" />}
      {redirects.redirects.map((redirect: any, index: number) => {
        return (
          <Row lbl="" val="" key={index}>
          <span className="arrow-thing">↳</span> {redirect}
          </Row>
        );
      })}
    </Outer>
  );
}

export default RedirectsCard;
