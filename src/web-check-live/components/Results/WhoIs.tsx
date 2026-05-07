import type { Whois } from 'web-check-live/utils/result-processor';
import { Card } from 'web-check-live/components/Form/Card';
import Row, { ListRow } from 'web-check-live/components/Form/Row';

const WhoIsCard = (props: { data: Whois; title: string; actionButtons: any }): JSX.Element => {
  const { created, updated, expires, nameservers } = props.data;
  return (
    <Card heading={props.title} actionButtons={props.actionButtons}>
      {created && <Row lbl="Created" val={created} />}
      {updated && <Row lbl="Updated" val={updated} />}
      {expires && <Row lbl="Expires" val={expires} />}
      {nameservers && <ListRow title="Name Servers" list={nameservers} />}
    </Card>
  );
};

export default WhoIsCard;
