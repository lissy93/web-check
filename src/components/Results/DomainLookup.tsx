
import colors from 'styles/colors';
import { Card } from 'components/Form/Card';
import Row from 'components/Form/Row';

const cardStyles = `
span.val {
  &.up { color: ${colors.success}; }
  &.down { color: ${colors.danger}; }
}
`;

const DomainLookupCard = (props: { data: any, title: string, actionButtons: any }): JSX.Element => {
  const domain = props.data.internicData || {};
  return (
    <Card heading={props.title} actionButtons={props.actionButtons} styles={cardStyles}>
      { domain.Domain_Name && <Row lbl="Registered Domain" val={domain.Domain_Name} /> }
      { domain.Creation_Date && <Row lbl="Creation Date" val={domain.Creation_Date} /> }
      { domain.Updated_Date && <Row lbl="Updated Date" val={domain.Updated_Date} /> }
      { domain.Registry_Expiry_Date && <Row lbl="Registry Expiry Date" val={domain.Registry_Expiry_Date} /> }
      { domain.Registry_Domain_ID && <Row lbl="Registry Domain ID" val={domain.Registry_Domain_ID} /> }
      { domain.Registrar_WHOIS_Server && <Row lbl="Registrar WHOIS Server" val={domain.Registrar_WHOIS_Server} /> }
      { domain.Registrar && <Row lbl="" val="">
        <span className="lbl">Registrar</span>
        <span className="val"><a href={domain.Registrar_URL || '#'}>{domain.Registrar}</a></span>
      </Row> }
      { domain.Registrar_IANA_ID && <Row lbl="Registrar IANA ID" val={domain.Registrar_IANA_ID} /> }
    </Card>
  );
}

export default DomainLookupCard;
