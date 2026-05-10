import styled from '@emotion/styled';
import colors from 'client/styles/colors';
import { Card } from 'client/components/Form/Card';
import Row from 'client/components/Form/Row';

const Note = styled.small`
  opacity: 0.5;
  display: block;
  margin-top: 0.5rem;
  a {
    color: ${colors.primary};
  }
`;

const ArchivesCard = (props: { data: any; title: string; actionButtons: any }): JSX.Element => {
  const data = props.data;
  return (
    <Card heading={props.title} actionButtons={props.actionButtons}>
      <Row lbl="First Scan" val={data.firstScan} />
      <Row lbl="Last Scan" val={data.lastScan} />
      <Row lbl="Days Archived" val={data.daysArchived} />
      <Row lbl="Change Count" val={data.changeCount} />
      <Row lbl="Avg Size" val={`${data.averagePageSize} bytes`} />
      <Row lbl="Avg Days between Archives" val={data.scanFrequency.daysBetweenScans} />

      <Note>
        View historical versions of this page{' '}
        <a rel="noreferrer" target="_blank" href={`https://web.archive.org/web/*/${data.scanUrl}`}>
          here
        </a>
        , via the Internet Archive's Wayback Machine.
      </Note>
    </Card>
  );
};

export default ArchivesCard;
