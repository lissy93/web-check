
import styled from 'styled-components';
import colors from 'styles/colors';
import Card from 'components/Form/Card';
import Heading from 'components/Form/Heading';
import Row, { RowProps }  from 'components/Form/Row';

const Outer = styled(Card)`
  .content {
    max-height: 28rem;
    overflow-y: auto;
  }
`;

const RobotsTxtCard = ( robots: { robots: RowProps[]}): JSX.Element => {
  return (
    <Outer>
      <Heading as="h3" align="left" color={colors.primary}>Crawl Rules</Heading>
      <div className="content">
      {
        robots.robots.length === 0 && <p>No crawl rules found.</p>
      }
      {
        robots.robots.map((row: RowProps, index: number) => {
          return (
            <Row key={`${row.lbl}-${index}`} lbl={row.lbl} val={row.val} />
          )
        })
      }
      </div>
    </Outer>
  );
}

export default RobotsTxtCard;
