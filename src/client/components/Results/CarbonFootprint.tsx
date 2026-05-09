import styled from '@emotion/styled';
import { Card } from 'client/components/Form/Card';
import Row from 'client/components/Form/Row';
import colors from 'client/styles/colors';

const LearnMoreInfo = styled.p`
  font-size: 0.8rem;
  margin-top: 0.5rem;
  opacity: 0.75;
  a {
    color: ${colors.primary};
  }
`;

const formatBytes = (n: number): string => {
  if (n >= 1048576) return `${(n / 1048576).toFixed(2)} MB`;
  if (n >= 1024) return `${(n / 1024).toFixed(2)} KB`;
  return `${Math.round(n)} bytes`;
};

const formatGrams = (g: number): string => {
  if (g >= 1000) return `${(g / 1000).toFixed(2)} kg`;
  if (g >= 1) return `${g.toFixed(2)} g`;
  return `${(g * 1000).toFixed(2)} mg`;
};

const formatKwh = (kwh: number): string => {
  if (kwh >= 1) return `${kwh.toFixed(3)} kWh`;
  if (kwh >= 0.001) return `${(kwh * 1000).toFixed(3)} Wh`;
  return `${(kwh * 1_000_000).toFixed(2)} mWh`;
};

const CarbonCard = (props: { data: any; title: string; actionButtons: any }): JSX.Element => {
  const carbons = props.data.statistics;
  const cleanerThan = props.data.cleanerThan;

  return (
    <Card heading={props.title} actionButtons={props.actionButtons}>
      {!carbons?.adjustedBytes && <p>Unable to calculate carbon footprint for host</p>}
      {carbons?.adjustedBytes > 0 && (
        <>
          <Row lbl="HTML Initial Size" val={formatBytes(carbons.adjustedBytes)} />
          <Row lbl="CO2 for Initial Load" val={formatGrams(carbons.co2.grid.grams)} />
          <Row lbl="Energy Usage for Load" val={formatKwh(carbons.energy)} />
          {cleanerThan > 0 && (
            <Row lbl="Cleaner than average page (est.)" val={`${cleanerThan}%`} />
          )}
        </>
      )}
      <br />
      <LearnMoreInfo>
        Calculated using the{' '}
        <a
          href="https://sustainablewebdesign.org/estimating-digital-emissions"
          target="_blank"
          rel="noreferrer"
        >
          Sustainable Web Model v4
        </a>
      </LearnMoreInfo>
    </Card>
  );
};

export default CarbonCard;
