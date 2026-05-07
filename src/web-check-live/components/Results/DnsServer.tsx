import { Card } from 'web-check-live/components/Form/Card';
import Heading from 'web-check-live/components/Form/Heading';
import Row from 'web-check-live/components/Form/Row';
import colors from 'web-check-live/styles/colors';

const DnsServerCard = (props: { data: any; title: string; actionButtons: any }): JSX.Element => {
  const dnsSecurity = props.data;
  return (
    <Card heading={props.title} actionButtons={props.actionButtons}>
      {dnsSecurity.dns.map((dns: any, index: number) => {
        return (
          <div key={`dns-${index}`}>
            {dnsSecurity.dns.length > 1 && (
              <Heading as="h4" size="small" color={colors.primary}>
                DNS Server #{index + 1}
              </Heading>
            )}
            <Row lbl="Hostname" val={dns.hostname} key={`host-${index}`} />
            {dns.address && <Row lbl="IP Address" val={dns.address} key={`ip-${index}`} />}
          </div>
        );
      })}
    </Card>
  );
};

export default DnsServerCard;
