
import styled from 'styled-components';
import { Card } from 'components/Form/Card';
import Heading from 'components/Form/Heading';
import colors from 'styles/colors';

const cardStyles = `
  grid-row: span 2;
  small {
    margin-top: 1rem;
    opacity: 0.5;
    display: block;
    a { color: ${colors.primary}; }
  }
`;

const TechStackRow = styled.div`
transition: all 0.2s ease-in-out;
.r1 {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  flex-wrap: wrap;
}
h4 {
  margin: 0.5rem 0 0 0;
}
.r2 {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}
.tech-version {
  opacity: 0.5;
}
.tech-confidence, .tech-categories {
  font-size: 0.8rem;
  opacity: 0.5;
}
.tech-confidence {
  display: none;
}
.tech-description, .tech-website {
  font-size: 0.8rem;
  margin: 0.25rem 0;
  font-style: italic;

  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  &.tech-website {
    -webkit-line-clamp: 1;
  }
  a {
    color: ${colors.primary};
    opacity: 0.75;
    &:hover { opacity: 1; }
  }
}
.tech-icon {
  min-width: 2.5rem;
  border-radius: 4px;
  margin: 0.5rem 0;
}
&:not(:last-child) {
  border-bottom: 1px solid ${colors.primary};
}
&:hover {
  .tech-confidence {
    display: block;
  }
  .tech-categories {
    display: none;
  }
}
`;

const TechStackCard = (props: {data: any, title: string, actionButtons: any }): JSX.Element => {
  const technologies = props.data.technologies;
  const iconsCdn = 'https://www.wappalyzer.com/images/icons/';
  return (
    <Card heading={props.title} actionButtons={props.actionButtons} styles={cardStyles}>
      {technologies.map((tech: any, index: number) => {
        return (
        <TechStackRow>
          <div className="r1">
            <Heading as="h4" size="small">
              {tech.name}
              <span className="tech-version">{tech.version? `(v${tech.version})` : ''}</span>
            </Heading>  
            <span className="tech-confidence" title={`${tech.confidence}% certain`}>Certainty: {tech.confidence}%</span>
            <span className="tech-categories">
              {tech.categories.map((cat: any, i: number) => `${cat.name}${i < tech.categories.length - 1 ? ', ' : ''}`)}
            </span>
          </div>
          <div className="r2">
            <img className="tech-icon" width="10" src={`${iconsCdn}${tech.icon}`} alt={tech.name} />
            <div>
            <p className="tech-description">{tech.description}</p>
            <p className="tech-website">Learn more at: <a href={tech.website}>{tech.website}</a></p>
            </div>
          </div>
          
        </TechStackRow>
        );
      })}
    </Card>
  );
}

export default TechStackCard;
