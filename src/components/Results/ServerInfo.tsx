import { ServerInfo } from 'utils/result-processor';
import { Card } from 'components/Form/Card';
import Row from 'components/Form/Row';

const ServerInfoCard = (props: { data: ServerInfo, title: string, actionButtons: any }): JSX.Element => {
  const info = props.data;
  const { org, asn, isp, os, ports, ip, loc, type } = info;
  return (
    <Card heading={props.title} actionButtons={props.actionButtons}>
      { org && <Row lbl="Organization" val={org} /> }
      { (isp && isp !== org) && <Row lbl="Service Provider" val={isp} /> }
      { os && <Row lbl="Operating System" val={os} /> }
      { asn && <Row lbl="ASN Code" val={asn} /> }
      { ports && <Row lbl="Ports" val={ports} /> }
      { ip && <Row lbl="IP" val={ip} /> }
      { type && <Row lbl="Type" val={type} /> }
      { loc && <Row lbl="Location" val={loc} /> }
    </Card>
  );
}

export default ServerInfoCard;
