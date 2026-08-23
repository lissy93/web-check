import styled from '@emotion/styled';
import docs, { type Doc } from 'client/utils/docs';
import colors from 'client/styles/colors';
import Heading from 'client/components/Form/Heading';
import { localizeDoc, useLanguage } from 'client/i18n';

const JobDocsContainer = styled.div`
  p.doc-desc,
  p.doc-uses,
  ul {
    margin: 0.25rem auto 1.5rem auto;
  }
  ul {
    padding: 0 0.5rem 0 1rem;
  }
  ul li a {
    color: ${colors.primary};
  }
  summary {
    color: ${colors.primary};
  }
  h4 {
    border-top: 1px solid ${colors.primary};
    color: ${colors.primary};
    opacity: 0.75;
    padding: 0.5rem 0;
  }
`;

const DocContent = ({ id }: { id: string }) => {
  const { language, t } = useLanguage();
  const sourceDoc = docs.filter((doc: Doc) => doc.id === id)[0] || null;
  const doc = sourceDoc ? localizeDoc(sourceDoc, language) : null;
  return doc ? (
    <JobDocsContainer>
      <Heading as="h3" size="medium" color={colors.primary}>
        {doc.title}
      </Heading>
      <Heading as="h4" size="small">
        {t('docsAbout')}
      </Heading>
      <p className="doc-desc">{doc.description}</p>
      <Heading as="h4" size="small">
        {t('docsUses')}
      </Heading>
      <p className="doc-uses">{doc.use}</p>
      <Heading as="h4" size="small">
        {t('docsLinks')}
      </Heading>
      <ul>
        {doc.resources.map((resource: string | { title: string; link: string }, index: number) =>
          typeof resource === 'string' ? (
            <li id={`link-${index}`}>
              <a target="_blank" rel="noreferrer" href={resource}>
                {resource}
              </a>
            </li>
          ) : (
            <li id={`link-${index}`}>
              <a target="_blank" rel="noreferrer" href={resource.link}>
                {resource.title}
              </a>
            </li>
          ),
        )}
      </ul>
      <details>
        <summary>
          <Heading as="h4" size="small">
            {t('docsExample')}
          </Heading>
        </summary>
        <img
          width="300"
          src={doc.screenshot}
          alt={language === 'zh-CN' ? '示例截图' : 'Example screenshot'}
        />
      </details>
    </JobDocsContainer>
  ) : (
    <JobDocsContainer>
      <p>{t('noDocs')}</p>
    </JobDocsContainer>
  );
};

export default DocContent;
