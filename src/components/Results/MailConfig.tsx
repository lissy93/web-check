
import { Card } from 'components/Form/Card';
import Row from 'components/Form/Row';
import Heading from 'components/Form/Heading';
import colors from 'styles/colors';

const cardStyles = ``;

const MailConfigCard = (props: {data: any, title: string, actionButtons: any }): JSX.Element => {
  const mailServer = props.data;
  const txtRecords = (mailServer.txtRecords || []).join('').toLowerCase() || '';
  return (
    <Card heading={props.title} actionButtons={props.actionButtons} styles={cardStyles}>
      <Heading as="h3" color={colors.primary} size="small">Mail Security Checklist</Heading>
      <Row lbl="SPF" val={txtRecords.includes('spf')} />
      <Row lbl="DKIM" val={txtRecords.includes('dkim')} />
      <Row lbl="DMARC" val={txtRecords.includes('dmarc')} />
      <Row lbl="BIMI" val={txtRecords.includes('bimi')} />

      { mailServer.mxRecords && <Heading as="h3" color={colors.primary} size="small">MX Records</Heading>}
      { mailServer.mxRecords && mailServer.mxRecords.map((record: any, index: number) => (
          <Row lbl="" val="" key={index}>
            <span>{record.exchange}</span>
            <span>{record.priority ? `Priority: ${record.priority}` : ''}</span>
          </Row>
        ))
      }
      { mailServer.mailServices.length > 0 && <Heading as="h3" color={colors.primary} size="small">External Mail Services</Heading>}
      { mailServer.mailServices && mailServer.mailServices.map((service: any, index: number) => (
        <Row lbl={service.provider} title={service.value} val="" key={index} />
        ))
      }

      { mailServer.txtRecords && <Heading as="h3" color={colors.primary} size="small">Mail-related TXT Records</Heading>}
      { mailServer.txtRecords && mailServer.txtRecords.map((record: any, index: number) => (
          <Row lbl="" val="" key={index}>
            <span>{record}</span>
          </Row>
        ))
      }
    </Card>
  );
}

export default MailConfigCard;
