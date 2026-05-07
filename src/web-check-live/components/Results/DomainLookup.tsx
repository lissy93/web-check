import colors from 'web-check-live/styles/colors';
import { Card } from 'web-check-live/components/Form/Card';
import Row from 'web-check-live/components/Form/Row';

const cardStyles = `
span.val {
  &.up { color: ${colors.success}; }
  &.down { color: ${colors.danger}; }
}
`;

const DomainLookupCard = (props: { data: any; title: string; actionButtons: any }): JSX.Element => {
  const d = props.data || {};
  return (
    <Card heading={props.title} actionButtons={props.actionButtons} styles={cardStyles}>
      {d.domain && <Row lbl="Registered Domain" val={d.domain} />}
      {d.created && <Row lbl="Creation Date" val={d.created} />}
      {d.updated && <Row lbl="Updated Date" val={d.updated} />}
      {d.expires && <Row lbl="Registry Expiry Date" val={d.expires} />}
      {d.registryDomainId && <Row lbl="Registry Domain ID" val={d.registryDomainId} />}
      {d.registrarWhoisServer && <Row lbl="Registrar WHOIS Server" val={d.registrarWhoisServer} />}
      {d.registrar && (
        <Row lbl="" val="">
          <span className="lbl">Registrar</span>
          <span className="val">
            <a href={d.registrarUrl || '#'}>{d.registrar}</a>
          </span>
        </Row>
      )}
      {d.registrarIanaId && <Row lbl="Registrar IANA ID" val={d.registrarIanaId} />}
      {d.dnssec && <Row lbl="DNSSEC" val={d.dnssec} />}
    </Card>
  );
};

export default DomainLookupCard;
