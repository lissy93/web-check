import colors from 'client/styles/colors';
import { Card } from 'client/components/Form/Card';
import Row from 'client/components/Form/Row';
import { localizeText, useLanguage } from 'client/i18n';

const cardStyles = `
span.val {
  &.up { color: ${colors.success}; }
  &.down { color: ${colors.danger}; }
}
`;

const ServerStatusCard = (props: { data: any; title: string; actionButtons: any }): JSX.Element => {
  const { language } = useLanguage();
  const serverStatus = props.data;
  return (
    <Card heading={props.title.toString()} actionButtons={props.actionButtons} styles={cardStyles}>
      <Row lbl="" val="">
        <span className="lbl">{localizeText('Is Up?', language)}</span>
        {serverStatus.isUp ? (
          <span className="val up">✅ {localizeText('Online', language)}</span>
        ) : (
          <span className="val down">❌ {localizeText('Offline', language)}</span>
        )}
      </Row>
      <Row lbl="Status Code" val={serverStatus.responseCode} />
      {serverStatus.responseTime && (
        <Row lbl="Response Time" val={`${Math.round(serverStatus.responseTime)}ms`} />
      )}
    </Card>
  );
};

export default ServerStatusCard;
