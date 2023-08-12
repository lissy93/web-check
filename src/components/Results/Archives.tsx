import styled from 'styled-components';
import colors from 'styles/colors';
import { Card } from 'components/Form/Card';
import Row from 'components/Form/Row';

const Note = styled.small`
opacity: 0.5;
display: block;
margin-top: 0.5rem;
a {
  color: ${colors.primary};
}
`;

const ArchivesCard = (props: { data: any, title: string, actionButtons: any }): JSX.Element => {
  const data = props.data;
  return (
    <Card heading={props.title} actionButtons={props.actionButtons}>
      <Row lbl="First Scan" val={data.firstScan} />
      <Row lbl="Last Scan" val={data.lastScan} />
      <Row lbl="Total Scans" val={data.totalScans} />
      <Row lbl="Change Count" val={data.changeCount} />
      <Row lbl="Avg Size" val={`${data.averagePageSize} bytes`} />
      { data.scanFrequency?.scansPerDay > 1 ?
        <Row lbl="Avg Scans Per Day" val={data.scanFrequency.scansPerDay} /> :
        <Row lbl="Avg Days between Scans" val={data.scanFrequency.daysBetweenScans} />
      }

      <Note>
        View historical versions of this page <a rel="noreferrer" target="_blank" href={`https://web.archive.org/web/*/${data.scanUrl}`}>here</a>,
        via the Internet Archive's Wayback Machine.
      </Note>
    </Card>
  );
}

export default ArchivesCard;
