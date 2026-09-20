import styled from '@emotion/styled';
import { checks, isCheck } from '@/data/checks';
import colors from 'client/styles/colors';
import Heading from 'client/components/Form/Heading';

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

const DocContent = (id: string) => {
  const doc = isCheck(id) ? checks[id] : null;
  return doc ? (
    <JobDocsContainer>
      <Heading as="h3" size="medium" color={colors.primary}>
        {doc.title}
      </Heading>
      <Heading as="h4" size="small">
        About
      </Heading>
      <p className="doc-desc">{doc.description}</p>
      <Heading as="h4" size="small">
        Use Cases
      </Heading>
      <p className="doc-uses">{doc.use}</p>
      {doc.resources.length > 0 && (
        <>
          <Heading as="h4" size="small">
            Links
          </Heading>
          <ul>
            {doc.resources.map((resource, index) =>
              typeof resource === 'string' ? (
                <li key={`link-${index}`} id={`link-${index}`}>
                  <a target="_blank" rel="noreferrer" href={resource}>
                    {resource}
                  </a>
                </li>
              ) : (
                <li key={`link-${index}`} id={`link-${index}`}>
                  <a target="_blank" rel="noreferrer" href={resource.link}>
                    {resource.title}
                  </a>
                </li>
              ),
            )}
          </ul>
        </>
      )}
      {doc.screenshot && (
        <details>
          <summary>
            <Heading as="h4" size="small">
              Example
            </Heading>
          </summary>
          <img width="300" src={doc.screenshot} alt="Screenshot" />
        </details>
      )}
    </JobDocsContainer>
  ) : (
    <JobDocsContainer>
      <p>No Docs provided for this widget yet</p>
    </JobDocsContainer>
  );
};

export default DocContent;
