
import { Card } from 'components/Form/Card';
import Row from 'components/Form/Row';

const cardStyles = '';

const TxtRecordCard = (props: {data: any, title: string, actionButtons: any }): JSX.Element => {
  const records = props.data;
  return (
    <Card heading={props.title} actionButtons={props.actionButtons} styles={cardStyles}>
      { !records && <Row lbl="" val="No TXT Records" />}
      {Object.keys(records).map((recordName: any, index: number) => {
        return (
          <Row lbl={recordName} val={records[recordName]} key={`${recordName}-${index}`} />
        );
      })}
    </Card>
  );
}

export default TxtRecordCard;
