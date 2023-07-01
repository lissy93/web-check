
import styled from 'styled-components';
import colors from 'styles/colors';
import Card from 'components/Form/Card';
import Heading from 'components/Form/Heading';
import Row from 'components/Form/Row';

const Outer = styled(Card)`

small {
  margin-top: 1rem;
  opacity: 0.5;
}
`;

const OpenPortsCard = (portData: any): JSX.Element => {
  return (
    <Outer>
      <Heading as="h3" align="left" color={colors.primary}>Open Ports</Heading>

      {portData.openPorts.map((port: any) => (
          <Row key={port} lbl="" val="">
            <span>{port}</span>
          </Row>
        )
      )}
      <br />
      <small>
        Unable to establish connections to:<br />
        {portData.failedPorts.join(', ')}
      </small>
    </Outer>
  );
}

export default OpenPortsCard;
