
import styled from 'styled-components';
import colors from 'styles/colors';
import Card from 'components/Form/Card';
import Heading from 'components/Form/Heading';
import Row from 'components/Form/Row';

const Outer = styled(Card)`
  grid-row: span 2;
`;

const HeadersCard = (props: { headers: any }): JSX.Element => {
  const headers = props.headers;
  return (
    <Outer>
      <Heading as="h3" size="small" align="left" color={colors.primary}>Headers</Heading>
      {
        Object.keys(headers).map((header: string, index: number) => {
          return (
            <Row key={`header-${index}`} lbl={header} val={headers[header]} />
          )
        })
      }      
    </Outer>
  );
}

export default HeadersCard;
