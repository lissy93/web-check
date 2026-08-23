import { Card } from 'client/components/Form/Card';
import { useLanguage } from 'client/i18n';

const cardStyles = `
  overflow: auto;
  max-height: 50rem;
  grid-row: span 2;
  img {
    border-radius: 6px;
    width: 100%;
    margin 0.5rem 0;;
  }
`;

const ScreenshotCard = (props: {
  data: { image?: string; data?: string };
  title: string;
  actionButtons: any;
}): JSX.Element => {
  const screenshot = props.data;
  const { language } = useLanguage();
  const alt = language === 'zh-CN' ? '完整页面截图' : 'Full-page screenshot';
  return (
    <Card heading={props.title} actionButtons={props.actionButtons} styles={cardStyles}>
      {screenshot.image && <img src={`data:image/png;base64,${screenshot.image}`} alt={alt} />}
      {!screenshot.image && screenshot.data && <img src={screenshot.data} alt={alt} />}
    </Card>
  );
};

export default ScreenshotCard;
