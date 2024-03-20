
import { Card } from 'components/Form/Card';
import Row from 'components/Form/Row';

const BlockListsCard = (props: {data: any, title: string, actionButtons: any }): JSX.Element => {
  const blockLists = props.data.blocklists;
  return (
    <Card heading={props.title} actionButtons={props.actionButtons}>
      { blockLists.map((blocklist: any, blockIndex: number) => (
        <Row
          title={blocklist.serverIp}
          lbl={blocklist.server}
          val={blocklist.isBlocked ? '❌ Blocked' : '✅ Not Blocked'}
          key={`blocklist-${blockIndex}-${blocklist.serverIp}`}
        />
      ))}
    </Card>
  );
}

export default BlockListsCard;
