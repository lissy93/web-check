
import styled from 'styled-components';
import colors from 'styles/colors';
import Card from 'components/Form/Card';
import Heading from 'components/Form/Heading';
import { ExpandableRow } from 'components/Form/Row';

const Outer = styled(Card)``;

const CookiesCard = (cookies: { cookies: any }): JSX.Element => {
  return (
    <Outer>
      <Heading as="h3" align="left" color={colors.primary}>Cookies</Heading>
      {
        cookies.cookies.length === 0 && <p>No cookies found.</p>
      }
      {
        cookies.cookies.map((cookie: any, index: number) => {
          const attributes = Object.keys(cookie.attributes).map((key: string) => {
            return { lbl: key, val: cookie.attributes[key] }
          });
          return (
            <ExpandableRow key={`cookie-${index}`} lbl={cookie.name} val={cookie.value} rowList={attributes} />
          )
        })
      }
    </Outer>
  );
}

export default CookiesCard;
