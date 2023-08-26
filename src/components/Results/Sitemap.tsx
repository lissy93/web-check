
import { Card } from 'components/Form/Card';
import Row, { ExpandableRow } from 'components/Form/Row';
import colors from 'styles/colors';

const cardStyles = `
  max-height: 50rem;
  overflow-y: auto;
  a {
    color: ${colors.primary};
  }
  small {
    margin-top: 1rem;
    opacity: 0.5;
    display: block;
    a { color: ${colors.primary}; }
  }
`;

const SitemapCard = (props: {data: any, title: string, actionButtons: any }): JSX.Element => {
  const normalSiteMap = props.data.url ||  props.data.urlset?.url || null;
  const siteMapIndex = props.data.sitemapindex?.sitemap || null;

  const makeExpandableRowData = (site: any) => {
    const results = [];
    if (site.lastmod) { results.push({lbl: 'Last Modified', val: site.lastmod[0]}); }
    if (site.changefreq) { results.push({lbl: 'Change Frequency', val: site.changefreq[0]}); }
    if (site.priority) { results.push({lbl: 'Priority', val: site.priority[0]}); }
    return results;
  };

  const getPathFromUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      return urlObj.pathname;
    } catch (e) {
      return url;
    }    
  };

  return (
    <Card heading={props.title} actionButtons={props.actionButtons} styles={cardStyles}>
      {
        normalSiteMap && normalSiteMap.map((subpage: any, index: number) => {
          return (<ExpandableRow lbl={getPathFromUrl(subpage.loc[0])} key={index} val="" rowList={makeExpandableRowData(subpage)}></ExpandableRow>)
        })
      }
      { siteMapIndex && <p>
        This site returns a sitemap index, which is a list of sitemaps.  
      </p>}
      {
        siteMapIndex && siteMapIndex.map((subpage: any, index: number) => {
          return (<Row lbl="" val="" key={index}><a href={subpage.loc[0]}>{getPathFromUrl(subpage.loc[0])}</a></Row>);
        })
      }
    </Card>
  );
}

export default SitemapCard;
