
import { Card } from 'components/Form/Card';
import Row, { RowProps } from 'components/Form/Row';

const cardStyles = '';

const parseHeader = (headerString: string): RowProps[] => {
  return headerString.split(';').map((part) => {
    const trimmedPart = part.trim();
    const equalsIndex = trimmedPart.indexOf('=');

    if (equalsIndex >= 0) {
      return {
        lbl: trimmedPart.substring(0, equalsIndex).trim(),
        val: trimmedPart.substring(equalsIndex + 1).trim(),
      };
    } else {
      return { lbl: trimmedPart, val: 'true' };
    }
  });
};

const HstsCard = (props: {data: any, title: string, actionButtons: any }): JSX.Element => {
  const hstsResults = props.data;
  const hstsHeaders = hstsResults?.hstsHeader ? parseHeader(hstsResults.hstsHeader) : [];
  return (
    <Card heading={props.title} actionButtons={props.actionButtons} styles={cardStyles}>
      {typeof hstsResults.compatible === 'boolean' && (
        <Row lbl="HSTS Enabled?" val={hstsResults.compatible ? '✅ Yes' : '❌ No'} />
      )}
      {hstsHeaders.length > 0 && hstsHeaders.map((header: RowProps, index: number) => {
        return (
          <Row lbl={header.lbl} val={header.val} key={`hsts-${index}`} />
        );
      })
      }
      {hstsResults.message && (<p>{hstsResults.message}</p>)}
    </Card>
  );
}

export default HstsCard;
