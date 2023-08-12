import styled from 'styled-components';
import { Card } from 'components/Form/Card';
import Row from 'components/Form/Row';

const Note = styled.small`
opacity: 0.5;
display: block;
margin-top: 0.5rem;
`;

const FirewallCard = (props: { data: any, title: string, actionButtons: any }): JSX.Element => {
  const data = props.data;
  return (
    <Card heading={props.title} actionButtons={props.actionButtons}>
      <Row lbl="Firewall" val={data.hasWaf ? '✅ Yes' : '❌ No*' } />
      { data.waf && <Row lbl="WAF" val={data.waf} /> }
      { !data.hasWaf && (<Note>
        *The domain may be protected with a proprietary or custom WAF which we were unable to identify automatically
      </Note>) }
    </Card>
  );
}

export default FirewallCard;
