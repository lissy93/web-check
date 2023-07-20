import { Card } from 'components/Form/Card';
import colors from 'styles/colors';
import Row from 'components/Form/Row';
import Heading  from 'components/Form/Heading';

const styles = `
  .content {
    max-height: 50rem;
    overflow-y: auto;
  }

  .scan-date {
    font-size: 0.8rem;
    margin-top: 0.5rem;
    opacity: 0.75;
  }
`;

const formatDate = (timestamp: number): string => {
  if (isNaN(timestamp) || timestamp <= 0) return 'No Date';

  const date = new Date(timestamp * 1000);

  if (isNaN(date.getTime())) return 'Unknown';

  const formatter = new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  return formatter.format(date);
}



const SiteFeaturesCard = (props: { data: any, title: string, actionButtons: any }): JSX.Element => {
  const features = props.data;
  return (
    <Card heading={props.title} actionButtons={props.actionButtons} styles={styles}>
      <div className="content">
        { (features?.groups || []).filter((group: any) => group.categories.length > 0).map((group: any, index: number) => (
          <div key={`${group.name}-${index}`}>
          <Heading as="h4" size="small" color={colors.primary}>{group.name}</Heading>
          { group.categories.map((category: any, subIndex: number) => (
            // <Row lbl={category.name} val={category.live} />
            <Row lbl="" val="" key={`${category.name}-${subIndex}`}>
              <span className="lbl">{category.name}</span>
              <span className="val">{category.live} Live {category.dead ? `(${category.dead} dead)` : ''}</span>
            </Row>
          ))
          }
          </div>
        ))
        }
      </div>
      <p className="scan-date">Last scanned on {formatDate(features.last)}</p>
    </Card>
  );
}

export default SiteFeaturesCard;
