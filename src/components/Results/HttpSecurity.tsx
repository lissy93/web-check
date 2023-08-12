import { Card } from 'components/Form/Card';
import Row from 'components/Form/Row';

const HttpSecurityCard = (props: { data: any, title: string, actionButtons: any }): JSX.Element => {
  const data = props.data;
  return (
    <Card heading={props.title} actionButtons={props.actionButtons}>
      <Row lbl="Content Security Policy" val={data.contentSecurityPolicy ? '✅ Yes' : '❌ No' } />
      <Row lbl="Strict Transport Policy" val={data.strictTransportPolicy ? '✅ Yes' : '❌ No' } />
      <Row lbl="X-Content-Type-Options" val={data.xContentTypeOptions ? '✅ Yes' : '❌ No' } />
      <Row lbl="X-Frame-Options" val={data.xFrameOptions ? '✅ Yes' : '❌ No' } />
      <Row lbl="X-XSS-Protection" val={data.xXSSProtection ? '✅ Yes' : '❌ No' } />
    </Card>
  );
}

export default HttpSecurityCard;
