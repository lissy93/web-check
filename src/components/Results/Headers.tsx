
import styled from 'styled-components';
import colors from 'styles/colors';
import Card from 'components/Form/Card';
import Heading from 'components/Form/Heading';

const Outer = styled(Card)`
  grid-row: span 2;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.25rem;
  &:not(:last-child) { border-bottom: 1px solid ${colors.primary}; }
  span.lbl { font-weight: bold; }
  span.val {
    max-width: 200px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const DataRow = (props: { lbl: string, val: string }) => {
  const { lbl, val } = props;
  return (
  <Row>
    <span className="lbl">{lbl}</span>
    <span className="val" title={val}>{val}</span>
  </Row>
  );
};

const HeadersCard = (props: { headers: any }): JSX.Element => {
  const headers = props.headers;
  return (
    <Outer>
      <Heading as="h3" size="small" align="left" color={colors.primary}>Headers</Heading>
      {
        Object.keys(headers).map((header: string, index: number) => {
          return (
            <DataRow key={`header-${index}`} lbl={header} val={headers[header]} />
          )
        })
      }      
    </Outer>
  );
}

export default HeadersCard;
