
import styled from 'styled-components';
import { ServerInfo } from 'utils/result-processor';
import colors from 'styles/colors';
import Card from 'components/Form/Card';
import Heading from 'components/Form/Heading';

const Outer = styled(Card)`
  max-width: 24rem;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.25rem;
  &:not(:last-child) { border-bottom: 1px solid ${colors.primary}; }
  span.lbl { font-weight: bold; }
  span.val {
    max-width: 200px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const DataRow = (props: { lbl: string, val: string }) => {
  const { lbl, val } = props;
  return (
  <Row>
    <span className="lbl">{lbl}</span>
    <span className="val" title={val}>{val}</span>
  </Row>
  );
};

const ServerInfoCard = (info: ServerInfo): JSX.Element => {
  const { org, asn, isp, os } = info;
  return (
    <Outer>
      <Heading as="h3" size="small" align="left" color={colors.primary}>Server Info</Heading>
      { org && <DataRow lbl="Organization" val={org} /> }
      { (isp && isp !== org) && <DataRow lbl="Service Provider" val={isp} /> }
      { os && <DataRow lbl="Operating System" val={os} /> }
      { asn && <DataRow lbl="ASN Code" val={asn} /> }
    </Outer>
  );
}

export default ServerInfoCard;
