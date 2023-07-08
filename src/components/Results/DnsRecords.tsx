import { Card } from 'components/Form/Card';
import Row, { ListRow }  from 'components/Form/Row';

const styles = `
  grid-row: span 2;
  .content {
    max-height: 50rem;
    overflow-x: hidden;
    overflow-y: auto;
  }
`;

const DnsRecordsCard = (props: { data: any, title: string, actionButtons: any }): JSX.Element => {
  const dnsRecords = props.data;
  return (
    <Card heading={props.title} actionButtons={props.actionButtons} styles={styles}>
      <div className="content">
      { dnsRecords.A && <Row lbl="A" val={dnsRecords.A.address} /> }
      { dnsRecords.AAAA?.length > 0 && <ListRow title="AAAA" list={dnsRecords.AAAA} /> }
      { dnsRecords.MX?.length > 0 && <ListRow title="MX" list={dnsRecords.MX} /> }
      { dnsRecords.CNAME?.length > 0 && <ListRow title="CNAME" list={dnsRecords.CNAME} /> }
      { dnsRecords.NS?.length > 0 && <ListRow title="NS" list={dnsRecords.NS} /> }
      { dnsRecords.PTR?.length > 0 && <ListRow title="PTR" list={dnsRecords.PTR} /> }
      { dnsRecords.SOA?.length > 0 && <ListRow title="SOA" list={dnsRecords.SOA} /> }
      </div>
    </Card>
  );
}

export default DnsRecordsCard;
