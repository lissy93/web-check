import styled from '@emotion/styled';
import { type ChangeEvent, type SyntheticEvent, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation, type NavigateOptions } from 'react-router-dom';

import Heading from 'client/components/Form/Heading';
import Input from 'client/components/Form/Input';
import Button from 'client/components/Form/Button';
import { StyledCard } from 'client/components/Form/Card';
import Footer from 'client/components/misc/Footer';
import FancyBackground from 'client/components/misc/FancyBackground';

import docs from 'client/utils/docs';
import colors from 'client/styles/colors';
import { determineAddressType, normalizeAddress } from 'client/utils/address-type-checker';

const HomeContainer = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  font-family: var(--font-mono);
  padding: 1.5rem 1rem 4rem 1rem;
  footer {
    z-index: 1;
  }
`;

const UserInputMain = styled.form`
  background: ${colors.backgroundLighter};
  box-shadow: 4px 4px 0px ${colors.bgShadowColor};
  border-radius: 8px;
  padding: 1rem;
  z-index: 5;
  margin: 1rem;
  width: calc(100% - 2rem);
  max-width: 60rem;
  z-index: 2;
`;

const SponsorCard = styled.div`
  background: ${colors.backgroundLighter};
  box-shadow: 4px 4px 0px ${colors.bgShadowColor};
  border-radius: 8px;
  padding: 1rem;
  margin: 1rem;
  width: calc(100% - 2rem);
  max-width: 60rem;
  z-index: 2;
  p {
    margin: 0.25rem 0;
  }
  a {
    color: ${colors.primary};
  }
`;

// const FindIpButton = styled.a`
//   margin: 0.5rem;
//   cursor: pointer;
//   display: block;
//   text-align: center;
//   color: ${colors.primary};
//   text-decoration: underline;
// `;

const ErrorMessage = styled.p`
  color: ${colors.danger};
  margin: 0.5rem;
`;

const SiteFeaturesWrapper = styled(StyledCard)`
  margin: 1rem;
  width: calc(100% - 2rem);
  max-width: 60rem;
  z-index: 2;
  .links {
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    a {
      width: 100%;
      button {
        width: calc(100% - 2rem);
      }
    }
    @media (max-width: 600px) {
      flex-wrap: wrap;
    }
  }
  ul {
    -webkit-column-width: 150px;
    -moz-column-width: 150px;
    column-width: 150px;
    list-style: none;
    padding: 0 1rem;
    font-size: 0.9rem;
    color: ${colors.textColor};
    li {
      position: relative;
      margin: 0.1rem 0;
      padding-left: 1.2rem;
      break-inside: avoid-column;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    li:before {
      content: '✓';
      color: ${colors.primary};
      position: absolute;
      left: 0;
    }
    li:not(:last-child) a {
      color: inherit;
      text-decoration: none;
    }
  }
  a {
    color: ${colors.primary};
  }
`;

// Build a URL-safe anchor id from a section title (e.g. "IP Info" -> "ip-info")
const makeAnchor = (title: string): string =>
  title
    .toLowerCase()
    .replace(/[^\w\s]|_/g, '')
    .replace(/\s+/g, '-');

const Home = (): JSX.Element => {
  const defaultPlaceholder = 'e.g. duck.com';
  const [userInput, setUserInput] = useState('');
  const [errorMsg, setErrMsg] = useState('');
  const [placeholder] = useState(defaultPlaceholder);
  const [inputDisabled] = useState(false);
  const navigate = useNavigate();

  const location = useLocation();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const urlFromQuery = query.get('url');
    if (urlFromQuery) {
      const target = normalizeAddress(urlFromQuery);
      if (target) navigate(`/check/${target}`, { replace: true });
    }
  }, [navigate, location.search]);

  const submit = () => {
    const address = normalizeAddress(userInput);
    const addressType = determineAddressType(address);

    if (addressType === 'empt') {
      setErrMsg('Field must not be empty');
    } else if (addressType === 'err') {
      setErrMsg('Must be a valid URL, IPv4 or IPv6 Address');
    } else {
      const resultRouteParams: NavigateOptions = { state: { address, addressType } };
      navigate(`/check/${address}`, resultRouteParams);
    }
  };

  /* Update user input state, and hide error message if field is valid */
  const inputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUserInput(event.target.value);
    const isError = ['err', 'empt'].includes(determineAddressType(event.target.value));
    if (!isError) setErrMsg('');
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      submit();
    }
  };

  const formSubmitEvent = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    submit();
  };

  return (
    <HomeContainer>
      <FancyBackground />
      <UserInputMain onSubmit={formSubmitEvent}>
        <a href="/">
          <Heading as="h1" size="xLarge" align="center" color={colors.primary}>
            <img width="64" src="/web-check.png" alt="Web Check Icon" />
            Web Check
          </Heading>
        </a>
        <Input
          id="user-input"
          value={userInput}
          label="Enter a URL"
          size="large"
          orientation="vertical"
          name="url"
          placeholder={placeholder}
          disabled={inputDisabled}
          handleChange={inputChange}
          handleKeyDown={handleKeyPress}
        />
        {/* <FindIpButton onClick={findIpAddress}>Or, find my IP</FindIpButton> */}
        {errorMsg && <ErrorMessage>{errorMsg}</ErrorMessage>}
        <Button type="submit" styles="width: calc(100% - 1rem);" size="large" onClick={submit}>
          Analyze!
        </Button>
      </UserInputMain>
      <SponsorCard>
        <Heading as="h2" size="small" color={colors.primary}>
          Enjoying Web Check?
        </Heading>
        <p>
          It's free, open source, and funded by the community. If it's been useful, you can keep it
          going (and ad-free) by{' '}
          <a target="_blank" rel="noreferrer" href="https://github.com/sponsors/Lissy93">
            sponsoring me on GitHub
          </a>
          . Every bit genuinely helps, thank you
        </p>
      </SponsorCard>
      <SiteFeaturesWrapper>
        <div className="features">
          <Heading as="h2" size="small" color={colors.primary}>
            Supported Checks
          </Heading>
          <ul>
            {docs.map((doc, index) => (
              <li key={index}>
                <Link to={`/check/about#${makeAnchor(doc.title)}`} title={doc.title}>
                  {doc.title}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/check/about">+ more!</Link>
            </li>
          </ul>
        </div>
        <div className="links">
          <a
            target="_blank"
            rel="noreferrer"
            href="https://github.com/lissy93/web-check"
            title="Check out the source code and documentation on GitHub, and get support or contribute"
          >
            <Button>View on GitHub</Button>
          </a>
          <a
            target="_blank"
            rel="noreferrer"
            href="https://app.netlify.com/start/deploy?repository=https://github.com/lissy93/web-check"
            title="Deploy your own private or public instance of Web-Check to Netlify"
          >
            <Button>Deploy your own</Button>
          </a>
          <Link
            to="/check/about#api-documentation"
            title="View the API documentation, to use Web-Check programmatically"
          >
            <Button>API Docs</Button>
          </Link>
        </div>
      </SiteFeaturesWrapper>
      <Footer isFixed={true} />
    </HomeContainer>
  );
};

export default Home;
