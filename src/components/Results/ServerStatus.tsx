
import styled from 'styled-components';
import colors from 'styles/colors';
import Card from 'components/Form/Card';
import Heading from 'components/Form/Heading';
import Row from 'components/Form/Row';

const Outer = styled(Card)`
span.val {
  &.up { color: ${colors.success}; }
  &.down { color: ${colors.danger}; }
}
`;

const ServerStatusCard = (serverStatus: any): JSX.Element => {
  return (
    <Outer>
      <Heading as="h3" align="left" color={colors.primary}>Server Status</Heading>
      <Row lbl="" val="">
        <span className="lbl">Is Up?</span>
        { serverStatus.isUp ? <span className="val up">✅ Online</span> : <span className="val down">❌ Offline</span>}
      </Row>
      <Row lbl="Status Code" val={serverStatus.responseCode} />
      { serverStatus.responseTime && <Row lbl="Response Time" val={`${Math.round(serverStatus.responseTime)}ms`} /> }
    </Outer>
  );
}

export default ServerStatusCard;
