import { Card } from 'components/Form/Card';
import { ExpandableRow } from 'components/Form/Row';

const CookiesCard = (props: { data: any, title: string, actionButtons: any}): JSX.Element => {
  const cookies = props.data.cookies;
  return (
    <Card heading={props.title} actionButtons={props.actionButtons}>
      { cookies.length === 0 && <p>No cookies found.</p> }
      {
        cookies.map((cookie: any, index: number) => {
          const attributes = Object.keys(cookie.attributes).map((key: string) => {
            return { lbl: key, val: cookie.attributes[key] }
          });
          return (
            <ExpandableRow key={`cookie-${index}`} lbl={cookie.name} val={cookie.value} rowList={attributes} />
          )
        })
      }
    </Card>
  );
}

export default CookiesCard;
