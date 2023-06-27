
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

const RobotsTxtCard = (props: { robotTxt: RowProps[] }): JSX.Element => {
  return (
    <Outer>
      <Heading as="h3" align="left" color={colors.primary}>Crawl Rules</Heading>
      <div className="content">
      {
        props.robotTxt.length === 0 && <p>No crawl rules found.</p>
      }
      {
        props.robotTxt.map((row: RowProps, index: number) => {
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
