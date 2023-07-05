import { Card } from 'components/Form/Card';
import Row from 'components/Form/Row';
import { ReactNode } from 'react';

const HeadersCard = (props: { data: any, title: string, actionButtons: ReactNode }): JSX.Element => {
  const headers = props.data;
  return (
    <Card heading={props.title} styles="grid-row: span 2;" actionButtons={props.actionButtons}>
      {
        Object.keys(headers).map((header: string, index: number) => {
          return (
            <Row key={`header-${index}`} lbl={header} val={headers[header]} />
          )
        })
      }      
    </Card>
  );
}

export default HeadersCard;
