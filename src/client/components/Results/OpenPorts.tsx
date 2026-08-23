import { Card } from 'client/components/Form/Card';
import Row from 'client/components/Form/Row';
import { useLanguage } from 'client/i18n';

const cardStyles = `
  small { margin-top: 1rem; opacity: 0.5; }
`;

const OpenPortsCard = (props: { data: any; title: string; actionButtons: any }): JSX.Element => {
  const { language } = useLanguage();
  const portData = props.data;
  return (
    <Card heading={props.title} actionButtons={props.actionButtons} styles={cardStyles}>
      {portData.openPorts.map((port: any) => (
        <Row key={port} lbl="" val="">
          <span>{port}</span>
        </Row>
      ))}
      <br />
      <small>
        {language === 'zh-CN' ? '无法建立连接的端口：' : 'Unable to establish connections to:'}
        <br />
        {portData.failedPorts.join(', ')}
      </small>
    </Card>
  );
};

export default OpenPortsCard;
