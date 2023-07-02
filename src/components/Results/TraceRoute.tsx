
import styled from 'styled-components';
import colors from 'styles/colors';
import Card from 'components/Form/Card';
import Heading from 'components/Form/Heading';
import Row from 'components/Form/Row';

const Outer = styled(Card)``;

const TraceRouteCard = (traceRouteResponse: any): JSX.Element => {
  console.log(traceRouteResponse.result);
  const routes = traceRouteResponse.result;
  console.log(Object.keys(routes));
  return (
    <Outer>
      <Heading as="h3" align="left" color={colors.primary}>Trace Route</Heading>
      {routes.map((route: any) => (
          <Row lbl="" val="">
            {/* <span>{route}</span> */}
            <span>{Object.keys(route)[0]}</span>
          </Row>
        )
      )}
    </Outer>
  );
}

export default TraceRouteCard;
