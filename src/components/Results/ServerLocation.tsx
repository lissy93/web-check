
import styled from 'styled-components';
import { ServerLocation } from 'utils/result-processor';
import colors from 'styles/colors';
import Card from 'components/Form/Card';
import Heading from 'components/Form/Heading';
import LocationMap from 'components/misc/LocationMap';
import Flag from 'components/misc/Flag';
import { TextSizes } from 'styles/typography';

const Outer = styled(Card)`
  max-width: 24rem;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.25rem;
  &:not(:last-child) { border-bottom: 1px solid ${colors.primary}; }
`;

const RowLabel = styled.span`
  font-weight: bold;
`;

const RowValue = styled.span`
  display: flex;
  img { margin-left: 0.5rem; }
`;

const SmallText = styled.span`
  opacity: 0.5;
  font-size: ${TextSizes.xSmall};
  text-align: right;
  display: block;
`;

const MapRow = styled(Row)`
  flex-direction: column;
`;

const ServerLocationCard = (location: ServerLocation): JSX.Element => {

  const {
    city, region, country,
    postCode, countryCode, coords,
    isp, timezone, languages, currency, currencyCode,
  } = location;

  return (
    <Outer>
      <Heading as="h3" size="small" align="left" color={colors.primary}>Location</Heading>
      <Row>
        <RowLabel>City</RowLabel>
        <RowValue>
          {postCode}, { city }, { region }
        </RowValue>
      </Row>
      <Row>
        <RowLabel>Country</RowLabel>
        <RowValue>
          {country}
          { countryCode && <Flag countryCode={countryCode} width={28} /> }
        </RowValue>
      </Row>
      { timezone && <Row>
        <RowLabel>Timezone</RowLabel><RowValue>{timezone}</RowValue>
      </Row>}
      { languages && <Row>
        <RowLabel>Languages</RowLabel><RowValue>{languages}</RowValue>
      </Row>}
      { currency && <Row>
        <RowLabel>Currency</RowLabel><RowValue>{currency} ({currencyCode})</RowValue>
      </Row>}
      <MapRow>
        <LocationMap lat={coords.latitude} lon={coords.longitude} label={`Server (${isp})`} />
        <SmallText>Latitude: {coords.latitude}, Longitude: {coords.longitude} </SmallText>
      </MapRow>
    </Outer>
  );
}

export default ServerLocationCard;
