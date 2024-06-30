
import { Card } from 'web-check-live/components/Form/Card';
import Row from 'web-check-live/components/Form/Row';
import colors from 'web-check-live/styles/colors';

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

const OgBanner = ({ ogImage, ogUrl }: { ogImage: string; ogUrl?: string }): JSX.Element => {
  const urlCover = ogImage.startsWith("/") && ogUrl ? `${ogUrl}${ogImage}` : ogImage;
  return (
      <div className="banner-image">
          <img src={urlCover} alt="Banner" />
      </div>
  );
};

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
      {tags.ogImage && <OgBanner ogImage={tags.ogImage} ogUrl={tags.ogUrl} />}
    </Card>
  );
}

export default SocialTagsCard;
