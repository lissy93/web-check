
import { Card } from 'components/Form/Card';
import Row from 'components/Form/Row';
import colors from 'styles/colors';

const cardStyles = `
  .banner-image img {
    width: 100%;
    border-radius: 4px;
    margin: 0.5rem 0;
  }
  .color-field {
    border-radius: 4px;
    &:hover {
      color: ${colors.primary};
    }
  }
`;

const SocialTagsCard = (props: {data: any, title: string, actionButtons: any }): JSX.Element => {
  const tags = props.data;
  return (
    <Card heading={props.title} actionButtons={props.actionButtons} styles={cardStyles}>
      { tags.title && <Row lbl="Title" val={tags.title} /> }
      { tags.description && <Row lbl="Description" val={tags.description} /> }
      { tags.keywords && <Row lbl="Keywords" val={tags.keywords} /> }
      { tags.canonicalUrl && <Row lbl="Canonical URL" val={tags.canonicalUrl} /> }
      { tags.themeColor && <Row lbl="" val="">
        <span className="lbl">Theme Color</span>
        <span className="val color-field" style={{background: tags.themeColor}}>{tags.themeColor}</span>
      </Row> }
      { tags.twitterSite && <Row lbl="" val="">
        <span className="lbl">Twitter Site</span>
        <span className="val"><a href={`https://x.com/${tags.twitterSite}`}>{tags.twitterSite}</a></span>
      </Row> }
      { tags.author && <Row lbl="Author" val={tags.author} />}
      { tags.publisher && <Row lbl="Publisher" val={tags.publisher} />}
      { tags.generator && <Row lbl="Generator" val={tags.generator} />}
      { tags.ogImage && <div className="banner-image"><img src={tags.ogImage} alt="Banner" /></div> }
    </Card>
  );
}

export default SocialTagsCard;
