import styled from 'styled-components';
import colors from 'styles/colors';

const StyledFooter = styled.footer`
  bottom: 0;
  width: 100%;
  text-align: center;
  padding: 0.5rem 0;
  background: ${colors.backgroundDarker};
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  opacity: 0.75;
  transition: all 0.2s ease-in-out;
  &:hover {
    opacity: 1;
  }
  span {
    margin: 0 0.5rem;
  }
`;

const Link = styled.a`
  color: ${colors.primary};
  font-weight: bold;
  border-radius: 4px;
  padding: 0.1rem;
  transition: all 0.2s ease-in-out;
  &:hover {
    background: ${colors.primary};
    color: ${colors.backgroundDarker};
    text-decoration: none;
  }
`;

const Footer = (props: { isFixed?: boolean }): JSX.Element => {
  const homeUrl = 'https://web-check.as93.net';
  const licenseUrl = 'https://github.com/lissy93/web-check/blob/main/LICENSE';
  const authorUrl = 'https://aliciasykes.com';
  const githubUrl = 'https://github.com/lissy93/web-check';
  return (
  <StyledFooter style={props.isFixed ? {position: 'fixed'} : {}}>
    <span>
      View source at <Link href={githubUrl}>github.com/lissy93/web-check</Link>
    </span>
    <span>
      <Link href={homeUrl}>Web-Check</Link> is
      licensed under <Link href={licenseUrl}>MIT</Link> -
      © <Link href={authorUrl}>Alicia Sykes</Link> 2023
    </span>
  </StyledFooter>
  );
}

export default Footer;
