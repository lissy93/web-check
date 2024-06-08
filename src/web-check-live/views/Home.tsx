import styled from '@emotion/styled';
import { type ChangeEvent, type FormEvent, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation, type NavigateOptions } from 'react-router-dom';

import Heading from 'web-check-live/components/Form/Heading';
import Input from 'web-check-live/components/Form/Input'
import Button from 'web-check-live/components/Form/Button';
import { StyledCard } from 'web-check-live/components/Form/Card';
import Footer from 'web-check-live/components/misc/Footer';
import FancyBackground from 'web-check-live/components/misc/FancyBackground';

import docs from 'web-check-live/utils/docs';
import colors from 'web-check-live/styles/colors';
import { determineAddressType } from 'web-check-live/utils/address-type-checker';

const HomeContainer = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  font-family: 'PTMono';
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
  z-index: 5;
  margin: 1rem;
  width: calc(100% - 2rem);
  max-width: 60rem;
  z-index: 2;
  .inner {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 1rem;
    p {
      margin: 0.25rem 0;
    }
  }
  a {
    color: ${colors.textColor};
  }
  img {
    border-radius: 0.25rem;
    box-shadow: 2px 2px 0px ${colors.fgShadowColor};
    transition: box-shadow 0.2s;
    margin: 0 auto;
    display: block;
    width: 200px;
    &:hover {
      box-shadow: 4px 4px 0px ${colors.fgShadowColor};
    }
    &:active {
      box-shadow: -2px -2px 0px ${colors.fgShadowColor};
    }
  }
  .cta {
    font-size: 0.78rem;
    a { color: ${colors.primary}; }
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
    @media(max-width: 600px) {
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
      margin: 0.1rem 0;
      text-indent: -1.2rem;
      break-inside: avoid-column;
    }
    li:before {
      content: '✓';
      color: ${colors.primary};
      margin-right: 0.5rem;
    }
  }
  a {
    color: ${colors.primary};
  }
`;

const Home = (): JSX.Element => {
  const defaultPlaceholder = 'e.g. https://duck.com/';
  const [userInput, setUserInput] = useState('');
  const [errorMsg, setErrMsg] = useState('');
  const [placeholder] = useState(defaultPlaceholder);
  const [inputDisabled] = useState(false);
  const navigate = useNavigate();

  const location = useLocation();

  /* Redirect strait to results, if somehow we land on /check?url=[] */
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const urlFromQuery = query.get('url');
    if (urlFromQuery) {
      navigate(`/check/${encodeURIComponent(urlFromQuery)}`, { replace: true });
    }
  }, [navigate, location.search]);

  /* Check is valid address, either show err or redirect to results page */
  const submit = () => {
    let address = userInput.endsWith("/") ? userInput.slice(0, -1) : userInput;
    const addressType = determineAddressType(address);
  
    if (addressType === 'empt') {
      setErrMsg('Field must not be empty');
    } else if (addressType === 'err') {
      setErrMsg('Must be a valid URL, IPv4 or IPv6 Address');
    } else {
      // if the addressType is 'url' and address doesn't start with 'http://' or 'https://', prepend 'https://'
      if (addressType === 'url' && !/^https?:\/\//i.test(address)) {
        address = 'https://' + address;
      }
      const resultRouteParams: NavigateOptions = { state: { address, addressType } };
      navigate(`/check/${encodeURIComponent(address)}`, resultRouteParams);
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

  const formSubmitEvent = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submit();
  }

  // const findIpAddress = () => {
  //   setUserInput('');
  //   setPlaceholder('Looking up your IP...');
  //   setInputDisabled(true);
  //   fetch('https://ipapi.co/json/')
  //     .then(function(response) {
  //       response.json().then(jsonData => {
  //         setUserInput(jsonData.ip);
  //         setPlaceholder(defaultPlaceholder);
  //         setInputDisabled(true);
  //       });
  //     })
  //     .catch(function(error) {
  //       console.log('Failed to get IP address :\'(', error)
  //     });
  // };


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
        { errorMsg && <ErrorMessage>{errorMsg}</ErrorMessage>}
        <Button type="submit" styles="width: calc(100% - 1rem);" size="large" onClick={submit}>Analyze!</Button>
      </UserInputMain>
      <SponsorCard>
        <Heading as="h2" size="small" color={colors.primary}>Sponsored by</Heading>
        <div className="inner">
          <p>
            <a
              target="_blank"
              rel="noreferrer"
              href="https://terminaltrove.com/?utm_campaign=github&utm_medium=referral&utm_content=web-check&utm_source=wcgh"
            >
              Terminal Trove
            </a> - The $HOME of all things in the terminal.
            <br />
            <span className="cta">
              Get updates on the latest CLI/TUI tools via
              the <a
                target="_blank"
                rel="noreferrer"
                className="cta"
                href="https://terminaltrove.com/newsletter?utm_campaign=github&utm_medium=referral&utm_content=web-check&utm_source=wcgh"
                >
                Terminal Trove newsletter
              </a>
            </span>
            
          </p>
          <a
            target="_blank"
            rel="noreferrer"
            href="https://terminaltrove.com/?utm_campaign=github&utm_medium=referral&utm_content=web-check&utm_source=wcgh">
            <img width="120" alt="Terminal Trove" src="https://i.ibb.co/NKtYjJ1/terminal-trove-web-check.png" />
          </a>
        </div>

      </SponsorCard>
      <SiteFeaturesWrapper>
        <div className="features">
          <Heading as="h2" size="small" color={colors.primary}>Supported Checks</Heading>
          <ul>
            {docs.map((doc, index) => (<li key={index}>{doc.title}</li>))}
            <li><Link to="/about">+ more!</Link></li>
          </ul>
        </div>
        <div className="links">
          <a target="_blank" rel="noreferrer" href="https://github.com/lissy93/web-check" title="Check out the source code and documentation on GitHub, and get support or contribute">
            <Button>View on GitHub</Button>
          </a>
          <a target="_blank" rel="noreferrer" href="https://app.netlify.com/start/deploy?repository=https://github.com/lissy93/web-check" title="Deploy your own private or public instance of Web-Check to Netlify">
            <Button>Deploy your own</Button>
          </a>
          <Link to="/about#api-documentation" title="View the API documentation, to use Web-Check programmatically">
            <Button>API Docs</Button>
          </Link>
        </div>
      </SiteFeaturesWrapper>
      <Footer isFixed={true} />
    </HomeContainer>
  );
}

export default Home;
