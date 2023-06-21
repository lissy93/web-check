
import styled from 'styled-components';
import { ServerInfo } from 'utils/result-processor';
import colors from 'styles/colors';
import Card from 'components/Form/Card';
import Heading from 'components/Form/Heading';
import Row from 'components/Form/Row';

const Outer = styled(Card)``;

const ServerInfoCard = (info: ServerInfo): JSX.Element => {
  const { org, asn, isp, os, ports, ip, loc, type } = info;
  return (
    <Outer>
      <Heading as="h3" size="small" align="left" color={colors.primary}>Server Info</Heading>
      { org && <Row lbl="Organization" val={org} /> }
      { (isp && isp !== org) && <Row lbl="Service Provider" val={isp} /> }
      { os && <Row lbl="Operating System" val={os} /> }
      { asn && <Row lbl="ASN Code" val={asn} /> }
      { ports && <Row lbl="Ports" val={ports} /> }
      { ip && <Row lbl="IP" val={ip} /> }
      { type && <Row lbl="Type" val={type} /> }
      { loc && <Row lbl="Location" val={loc} /> }
    </Outer>
  );
}

export default ServerInfoCard;
