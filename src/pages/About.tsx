import styled from 'styled-components';

import colors from 'styles/colors';
import Heading from 'components/Form/Heading';
import Footer from 'components/misc/Footer';
import Nav from 'components/Form/Nav';
import Button from 'components/Form/Button';
import { StyledCard } from 'components/Form/Card';
import docs, { about, license, fairUse } from 'utils/docs';


const AboutContainer = styled.div`
width: 95vw;
max-width: 1000px;
margin: 2rem auto;
padding-bottom: 1rem;
header {
  margin 1rem 0;
}
`;

const HeaderLinkContainer = styled.nav`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  a {
    text-decoration: none;
  }
`;

const Section = styled(StyledCard)`
  margin-bottom: 2rem;
  overflow: clip;
  h3 {
    font-size: 1.5rem;
  }
  hr {
    border: none;
    border-top: 1px dashed ${colors.primary};
    margin: 1.5rem auto;
  }
  ul {
    padding: 0 0 0 1rem;
    list-style: circle;
  }
  a {
    color: ${colors.primary};
    &:visited { opacity: 0.8; }
  }
  pre {
    background: ${colors.background};
    border-radius: 4px;
    padding: 0.5rem;
    width: fit-content;
  }
  small { opacity: 0.7; }
  .contents {
    ul {
      list-style: none;
      li {
        a {
          // color: ${colors.textColor};
          &:visited { opacity: 0.8; }
        }
        b {
          opacity: 0.75;
          display: inline-block;
          width: 1.5rem;
        }
      }
    }
  }
  .screenshot {
    float: right;
    break-inside: avoid;
    max-width: 300px;
    max-height: 28rem;
    border-radius: 6px;
  }
`;

const makeAnchor = (title: string): string => {
  return title.toLowerCase().replace(/[^\w\s]|_/g, "").replace(/\s+/g, "-");
};


const About = (): JSX.Element => {
  return (
    <div>
    <AboutContainer>
      <Nav>
        <HeaderLinkContainer>
          <a href="https://github.com/lissy93/web-check"><Button>View on GitHub</Button></a>
        </HeaderLinkContainer>
      </Nav>

      <Heading as="h2" size="medium" color={colors.primary}>Intro</Heading>
      <Section>
        {about.map((para, index: number) => (
          <p key={index}>{para}</p>
        ))}
      </Section>
      
      <Heading as="h2" size="medium" color={colors.primary}>Features</Heading>
      <Section>
        <div className="contents">
        <Heading as="h3" size="small" id="#feature-contents" color={colors.primary}>Contents</Heading>
          <ul>
            {docs.map((section, index: number) => (
              <li>
                <b>{index + 1}</b>
                <a href={`#${makeAnchor(section.title)}`}>{section.title}</a></li>
            ))}
          </ul>
          <hr />
        </div>
        {docs.map((section, sectionIndex: number) => (
          <section key={section.title}>
            <Heading as="h3" size="small" id={makeAnchor(section.title)} color={colors.primary}>{section.title}</Heading>
            {section.screenshot && 
              <img className="screenshot" src={section.screenshot} alt={`Example Screenshot ${section.title}`} />
            }
            {section.description && <>
              <Heading as="h4" size="small">Description</Heading>
              <p>{section.description}</p>
            </>}
            { section.use && <>
              <Heading as="h4" size="small">Use Cases</Heading>
              <p>{section.use}</p>
            </>}
            {section.resources && section.resources.length > 0 && <>
              <Heading as="h4" size="small">Useful Links</Heading>
              <ul>
                {section.resources.map((link: string, linkIndx: number) => (
                  <li key={linkIndx}><a href={link}>{link}</a></li>
                ))}
              </ul>
            </>}
            { sectionIndex < docs.length - 1 && <hr /> }
          </section>
        ))}
      </Section>

      <Heading as="h2" size="medium" color={colors.primary}>Terms & Info</Heading>
      <Section>
      <Heading as="h3" size="small" color={colors.primary}>License</Heading>
        <b>
          <a href="https://github.com/lissy93/web-check">Web-Check</a> is distributed under the MIT license,
          © <a href="https://aliciasykes.com">Alicia Sykes</a> { new Date().getFullYear()}
        </b>
        <br />
        <small>For more info, see <a href="https://tldrlegal.com/license/mit-license">TLDR Legal → MIT</a></small>
        <pre>{license}</pre>
        <hr />
        <Heading as="h3" size="small" color={colors.primary}>Fair Use</Heading>
        <ul>
          {fairUse.map((para, index: number) => (<li>{para}</li>))}
        </ul>
        <hr />
        <Heading as="h3" size="small" color={colors.primary}>Privacy</Heading>
        <p>
        Analytics are used on the demo instance (via a self-hosted Plausible instance), this only records the URL you visited but no personal data.
        </p>
        <hr />
        <Heading as="h3" size="small" color={colors.primary}>Support</Heading>
        <p>
          If you've found something that doesn't work as expected, or would like to ask any questions,
          you can open a ticket at <a href="https://github.com/lissy93/web-check/issues">github.com/lissy93/web-check/issues</a>
        </p>
        <hr />
        <Heading as="h3" size="small" color={colors.primary}>Sponsor</Heading>
        <p>
          If you've found this service useful, consider sponsoring me on
          GitHub - <a href="https://github.com/sponsors/Lissy93">github.com/sponsors/Lissy93</a> 💖
        </p>
      </Section>
    </AboutContainer>
    <Footer />
    </div>
  );
}

export default About;
