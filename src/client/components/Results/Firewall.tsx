import styled from '@emotion/styled';
import { Card } from 'client/components/Form/Card';
import Row from 'client/components/Form/Row';
import { useLanguage } from 'client/i18n';

const Note = styled.small`
  opacity: 0.5;
  display: block;
  margin-top: 0.5rem;
`;

const FirewallCard = (props: { data: any; title: string; actionButtons: any }): JSX.Element => {
  const { language } = useLanguage();
  const data = props.data;
  return (
    <Card heading={props.title} actionButtons={props.actionButtons}>
      <Row lbl="Firewall" val={data.hasWaf ? '✅ Yes' : '❌ No*'} />
      {data.waf && <Row lbl="WAF" val={data.waf} />}
      {!data.hasWaf && (
        <Note>
          {language === 'zh-CN'
            ? '*该域名可能使用专有或自定义 WAF，当前检查无法自动识别。'
            : '*The domain may be protected with a proprietary or custom WAF which we were unable to identify automatically'}
        </Note>
      )}
    </Card>
  );
};

export default FirewallCard;
