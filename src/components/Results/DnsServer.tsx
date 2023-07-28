
import { Card } from 'components/Form/Card';
import Heading from 'components/Form/Heading';
import Row from 'components/Form/Row';
import colors from 'styles/colors';

const cardStyles = `
  small {
    margin-top: 1rem;
    opacity: 0.5;
    display: block;
    a { color: ${colors.primary}; }
  }
`;

const DnsServerCard = (props: {data: any, title: string, actionButtons: any }): JSX.Element => {
  const dnsSecurity = props.data;
  return (
    <Card heading={props.title} actionButtons={props.actionButtons} styles={cardStyles}>
      {dnsSecurity.dns.map((dns: any, index: number) => {
        return (<>
          { dnsSecurity.dns.length > 1 && <Heading as="h4" size="small" color={colors.primary}>DNS Server #{index+1}</Heading> }
          <Row lbl="IP Address" val={dns.address} key={`ip-${index}`} />
          { dns.hostname && <Row lbl="Hostname" val={dns.hostname}  key={`host-${index}`} /> }
          <Row lbl="DoH Support" val={dns.dohDirectSupports ? '✅ Yes*' : '❌ No*'} key={`doh-${index}`} />
        </>);
      })}
      {dnsSecurity.dns.length > 0 && (<small>
        * DoH Support is determined by the DNS server's response to a DoH query.
        Sometimes this gives false negatives, and it's also possible that the DNS server supports DoH but does not respond to DoH queries.
        If the DNS server does not support DoH, it may still be possible to use DoH by using a DoH proxy.
      </small>)}
    </Card>
  );
}

export default DnsServerCard;
