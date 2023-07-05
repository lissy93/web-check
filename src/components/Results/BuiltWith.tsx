
import styled from 'styled-components';
import { TechnologyGroup, Technology } from 'utils/result-processor';
import colors from 'styles/colors';
import Card from 'components/Form/Card';
import Heading from 'components/Form/Heading';

const Outer = styled(Card)`
  grid-row: span 2
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

const ListRow = (props: { list: Technology[], title: string }) => {
  const { list, title } = props;
  return (
    <>
      <Heading as="h3" align="left" color={colors.primary}>{title}</Heading>
      { list.map((entry: Technology, index: number) => {
        return (
        <Row key={`${title.toLocaleLowerCase()}-${index}`}><span>{ entry.Name }</span></Row>
        )}
      )}
    </>
  );
}

const BuiltWithCard = (props: { data: TechnologyGroup[]}): JSX.Element => {
  // const { created, updated, expires, nameservers } = whois;
  return (
    <Outer>
      <Heading as="h3" align="left" color={colors.primary}>Technologies</Heading>
      { props.data.map((group: TechnologyGroup) => {
        return (
          <ListRow key={group.tag} title={group.tag} list={group.technologies} />
        );
      })}
      {/* { created && <DataRow lbl="Created" val={formatDate(created)} /> }
      { updated && <DataRow lbl="Updated" val={formatDate(updated)} /> }
      { expires && <DataRow lbl="Expires" val={formatDate(expires)} /> }
      { nameservers && <ListRow title="Name Servers" list={nameservers} /> } */}
    </Outer>
  );
}

export default BuiltWithCard;
