
import styled from 'styled-components';
import colors from 'styles/colors';
import Card from 'components/Form/Card';
import Heading from 'components/Form/Heading';
import Row, { ListRow }  from 'components/Form/Row';

const Outer = styled(Card)`
  .content {
    max-height: 28rem;
    overflow-y: auto;
  }
`;

const DnsRecordsCard = (dnsRecords: any): JSX.Element => {
  return (
    <Outer>
      <Heading as="h3" align="left" color={colors.primary}>DNS Records</Heading>
      <div className="content">
      { dnsRecords.A && <Row lbl="A" val={dnsRecords.A.address} /> }
      { dnsRecords.AAAA?.length > 0 && <ListRow title="AAAA" list={dnsRecords.AAAA} /> }
      { dnsRecords.MX?.length > 0 && <ListRow title="MX" list={dnsRecords.MX} /> }
      { dnsRecords.CNAME?.length > 0 && <ListRow title="CNAME" list={dnsRecords.CNAME} /> }
      { dnsRecords.NS?.length > 0 && <ListRow title="NS" list={dnsRecords.NS} /> }
      { dnsRecords.PTR?.length > 0 && <ListRow title="PTR" list={dnsRecords.PTR} /> }
      { dnsRecords.SOA?.length > 0 && <ListRow title="SOA" list={dnsRecords.SOA} /> }
      </div>
    </Outer>
  );
}

export default DnsRecordsCard;

