import { Card } from 'components/Form/Card';

const cardStyles = `
  overflow: auto;
  max-height: 32rem;
  img {
    border-radius: 6px;
    width: 100%;
    margin 0.5rem 0;;
  }
`;

const ScreenshotCard = (props: { data: { data: string }, title: string, actionButtons: any }): JSX.Element => {
  const screenshot = props.data;
  return (
    <Card heading={props.title} actionButtons={props.actionButtons} styles={cardStyles}>
      <img src={screenshot.data} alt="Full page screenshot" />
    </Card>
  );
}

export default ScreenshotCard;
