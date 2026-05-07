import { Card } from 'web-check-live/components/Form/Card';
import Row from 'web-check-live/components/Form/Row';

const yes = '✅ Yes';
const no = '❌ No';
const check = (v: any) => (v ? yes : no);

const HttpSecurityCard = (props: { data: any; title: string; actionButtons: any }): JSX.Element => {
  const d = props.data;
  return (
    <Card heading={props.title} actionButtons={props.actionButtons}>
      <Row lbl="Content Security Policy" val={check(d.contentSecurityPolicy)} />
      <Row lbl="Strict Transport Policy" val={check(d.strictTransportPolicy)} />
      <Row lbl="X-Content-Type-Options" val={check(d.xContentTypeOptions)} />
      <Row lbl="X-Frame-Options" val={check(d.xFrameOptions)} />
      <Row lbl="Referrer Policy" val={check(d.referrerPolicy)} />
      <Row lbl="Permissions Policy" val={check(d.permissionsPolicy)} />
      <Row lbl="Cross-Origin-Opener-Policy" val={check(d.crossOriginOpenerPolicy)} />
      <Row lbl="Cross-Origin-Resource-Policy" val={check(d.crossOriginResourcePolicy)} />
      <Row lbl="Cross-Origin-Embedder-Policy" val={check(d.crossOriginEmbedderPolicy)} />
    </Card>
  );
};

export default HttpSecurityCard;
