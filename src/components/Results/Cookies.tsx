import { Card } from 'components/Form/Card';
import { ExpandableRow } from 'components/Form/Row';
import { Cookie } from 'utils/result-processor';

export const parseHeaderCookies = (cookiesHeader: string[]): Cookie[] => {
  if (!cookiesHeader || !cookiesHeader.length) return [];
  const cookies = cookiesHeader.flatMap(cookieHeader => {
    return cookieHeader.split(/,(?=\s[A-Za-z0-9]+=)/).map(cookieString => {
      const [nameValuePair, ...attributePairs] = cookieString.split('; ').map(part => part.trim());
      const [name, value] = nameValuePair.split('=');
      const attributes: Record<string, string> = {};
      attributePairs.forEach(pair => {
        const [attributeName, attributeValue = ''] = pair.split('=');
        attributes[attributeName] = attributeValue;
      });
      return { name, value, attributes };
    });
  });
  return cookies;
};

const CookiesCard = (props: { data: any, title: string, actionButtons: any}): JSX.Element => {
  const headerCookies = parseHeaderCookies(props.data.headerCookies) || [];
  const clientCookies = props.data.clientCookies || [];
  return (
    <Card heading={props.title} actionButtons={props.actionButtons}>
      {
        headerCookies.map((cookie: any, index: number) => {
          const attributes = Object.keys(cookie.attributes).map((key: string) => {
            return { lbl: key, val: cookie.attributes[key] }
          });
          return (
            <ExpandableRow key={`cookie-${index}`} lbl={cookie.name} val={cookie.value} rowList={attributes} />
          )
        })
      }
      {
        clientCookies.map((cookie: any) => {
          const nameValPairs = Object.keys(cookie).map((key: string) => { return { lbl: key, val: cookie[key] }});
          return (
            <ExpandableRow key={`cookie-${cookie.name}`} lbl={cookie.name} val="" rowList={nameValPairs} />
          );
        })
      }
    </Card>
  );
}

export default CookiesCard;
