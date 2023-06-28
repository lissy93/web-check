
import styled from 'styled-components';
import colors from 'styles/colors';
import Card from 'components/Form/Card';
import Heading from 'components/Form/Heading';
import Row from 'components/Form/Row';

const Outer = styled(Card)``;

const TxtRecordCard = (records: any): JSX.Element => {
  console.log(records);
  return (
    <Outer>
      <Heading as="h3" align="left" color={colors.primary}>TXT Config</Heading>
      { !records && <Row lbl="" val="No TXT Records" />}
      {Object.keys(records).map((recordName: any, index: number) => {
        return (
          <Row lbl={recordName} val={records[recordName]} key={`${recordName}-${index}`} />
        );
      })}
    </Outer>
  );
}

export default TxtRecordCard;
