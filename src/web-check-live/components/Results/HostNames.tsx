
import styled from '@emotion/styled';
import type { HostNames } from 'web-check-live/utils/result-processor';
import colors from 'web-check-live/styles/colors';
import { Card } from 'web-check-live/components/Form/Card';
import Heading from 'web-check-live/components/Form/Heading';

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.25rem;
  &:not(:last-child) { border-bottom: 1px solid ${colors.primaryTransparent}; }
  span:first-child { font-weight: bold; }
`;

const HostListSection = (props: { list: string[], title: string }) => {
  const { list, title } = props;
  return (
  <>
    <Heading as="h4" size="small" align="left" color={colors.primary}>{title}</Heading>
    { list.map((entry: string, index: number) => {
      return (
      <Row key={`${title.toLocaleLowerCase()}-${index}`}><span>{ entry }</span></Row>
      )}
    )}
  </>
);
}

const cardStyles = `
  max-height: 50rem;
  overflow: auto;
`;

const HostNamesCard = (props: { data: HostNames, title: string, actionButtons: any }): JSX.Element => {
  const hosts = props.data;
  return (
    <Card heading={props.title} actionButtons={props.actionButtons} styles={cardStyles}>
      { hosts.domains.length > 0 &&
        <HostListSection list={hosts.domains} title="Domains" />
      }
      { hosts.hostnames.length > 0 &&
        <HostListSection list={hosts.hostnames} title="Hosts" />
      }
    </Card>
  );
}

export default HostNamesCard;
