
import styled from 'styled-components';
import { HostNames } from 'utils/result-processor';
import colors from 'styles/colors';
import Card from 'components/Form/Card';
import Heading from 'components/Form/Heading';

const Outer = styled(Card)`
  max-height: 20rem;
  overflow: auto;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.25rem;
  &:not(:last-child) { border-bottom: 1px solid ${colors.primary}; }
  span:first-child { font-weight: bold; }
`;

const HostListSection = (props: { list: string[], title: string }) => {
  const { list, title } = props;
  return (
  <>
    <Heading as="h3" size="small" align="left" color={colors.primary}>{title}</Heading>
    { list.map((entry: string, index: number) => {
      return (
      <Row key={`${title.toLocaleLowerCase()}-${index}`}><span>{ entry }</span></Row>
      )}
    )}
  </>
);
}

const HostNamesCard = (props: { hosts: HostNames }): JSX.Element => {
  const hosts = props.hosts;
  return (
    <Outer>
      { hosts.domains.length > 0 &&
        <HostListSection list={hosts.domains} title="Domain Names" />
      }
      { hosts.hostnames.length > 0 &&
        <HostListSection list={hosts.hostnames} title="Hostnames" />
      }
    </Outer>
  );
}

export default HostNamesCard;
