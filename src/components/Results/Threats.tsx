
import styled from 'styled-components';
import colors from 'styles/colors';
import { Card } from 'components/Form/Card';
import Row, { ExpandableRow } from 'components/Form/Row';

const Expandable = styled.details`
margin-top: 0.5rem;
cursor: pointer;
summary::marker {
  color: ${colors.primary};
}
`;

const getExpandableTitle = (urlObj: any) => {
  let pathName = '';
  try {
    pathName = new URL(urlObj.url).pathname;
  } catch(e) {}
  return `${pathName} (${urlObj.id})`;
}

const convertToDate = (dateString: string): string => {
  const [date, time] = dateString.split(' ');
  const [year, month, day] = date.split('-').map(Number);
  const [hour, minute, second] = time.split(':').map(Number);
  const dateObject = new Date(year, month - 1, day, hour, minute, second);
  if (isNaN(dateObject.getTime())) {
    return dateString;
  }
  return dateObject.toString();
}

const MalwareCard = (props: {data: any, title: string, actionButtons: any }): JSX.Element => {
  const urlHaus = props.data.urlHaus || {};
  const phishTank = props.data.phishTank || {};
  const cloudmersive = props.data.cloudmersive || {};
  const safeBrowsing = props.data.safeBrowsing || {};
  return (
    <Card heading={props.title} actionButtons={props.actionButtons}>
      { safeBrowsing && !safeBrowsing.error && (
        <Row lbl="Google Safe Browsing" val={safeBrowsing.unsafe ? '❌ Unsafe' : '✅ Safe'} />
      )}
      { ((cloudmersive && !cloudmersive.error) || safeBrowsing?.details) && (
        <Row lbl="Threat Type" val={safeBrowsing?.details?.threatType || cloudmersive.WebsiteThreatType || 'None :)'} />
      )}
      { phishTank && !phishTank.error && (
        <Row lbl="Phishing Status" val={phishTank?.url0?.in_database !== 'false' ? '❌ Phishing Identified' : '✅ No Phishing Found'} />
      )}
      { phishTank.url0 && phishTank.url0.phish_detail_page && (
        <Row lbl="" val="">
          <span className="lbl">Phish Info</span>
          <span className="val"><a href={phishTank.url0.phish_detail_page}>{phishTank.url0.phish_id}</a></span>  
        </Row>
      )}
      { urlHaus.query_status === 'no_results' && <Row lbl="Malware Status" val="✅ No Malwares Found" />}
      { urlHaus.query_status === 'ok' && (
        <>
        <Row lbl="Status" val="❌ Malware Identified" />
        <Row lbl="First Seen" val={convertToDate(urlHaus.firstseen)} />
        <Row lbl="Bad URLs Count" val={urlHaus.url_count} />
        </>
      )}
      {urlHaus.urls && (
        <Expandable>
          <summary>Expand Results</summary>
          { urlHaus.urls.map((urlResult: any, index: number) => {
          const rows = [
            { lbl: 'ID', val: urlResult.id },
            { lbl: 'Status', val: urlResult.url_status },
            { lbl: 'Date Added', val: convertToDate(urlResult.date_added) },
            { lbl: 'Threat Type', val: urlResult.threat },
            { lbl: 'Reported By', val: urlResult.reporter },
            { lbl: 'Takedown Time', val: urlResult.takedown_time_seconds },
            { lbl: 'Larted', val: urlResult.larted },
            { lbl: 'Tags', val: (urlResult.tags || []).join(', ') },
            { lbl: 'Reference', val: urlResult.urlhaus_reference },      
            { lbl: 'File Path', val: urlResult.url },      
          ];
          return (<ExpandableRow lbl={getExpandableTitle(urlResult)} val="" rowList={rows} />)
        })}
        </Expandable>
      )}
    </Card>
  );
}

export default MalwareCard;
