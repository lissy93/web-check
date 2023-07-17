import styled from 'styled-components';
import { ChangeEvent, FormEvent, useState } from 'react';
import { useNavigate, NavigateOptions } from 'react-router-dom';

import Heading from 'components/Form/Heading';
import Input from 'components/Form/Input'
import Button from 'components/Form/Button';
import Footer from 'components/misc/Footer';
import FancyBackground from 'components/misc/FancyBackground';

import colors from 'styles/colors';
import { determineAddressType } from 'utils/address-type-checker';

const HomeContainer = styled.section`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 100%;
  font-family: 'PTMono';
`;

const UserInputMain = styled.form`
  background: ${colors.backgroundLighter};
  box-shadow: 4px 4px 0px ${colors.bgShadowColor};
  border-radius: 8px;
  padding: 1rem;
  z-index: 5;
  min-height: 25vh;
  min-width: 50vw;
  margin: 1rem;
`;

const FindIpButton = styled.a`
  margin: 0.5rem;
  cursor: pointer;
  display: block;
  text-align: center;
  color: ${colors.primary};
  text-decoration: underline;
`;

const ErrorMessage = styled.p`
  color: ${colors.danger};
  margin: 0.5rem;
`;

const Home = (): JSX.Element => {
  const defaultPlaceholder = 'e.g. https://duck.com/';
  const [userInput, setUserInput] = useState('');
  const [errorMsg, setErrMsg] = useState('');
  const [placeholder, setPlaceholder] = useState(defaultPlaceholder);
  const [inputDisabled, setInputDisabled] = useState(false);
  const navigate = useNavigate();

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
      navigate(`/results/${encodeURIComponent(address)}`, resultRouteParams);
    }
  };
  

  /* Update user input state, and hide error message if field is valid */
  const inputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUserInput(event.target.value);
    const isError = ['err', 'empt'].includes(determineAddressType(event.target.value));
    if (!isError) setErrMsg('');
  };

  const findIpAddress = () => {
    setUserInput('');
    setPlaceholder('Looking up your IP...');
    setInputDisabled(true);
    fetch('https://ipapi.co/json/')
      .then(function(response) {
        response.json().then(jsonData => {
          setUserInput(jsonData.ip);
          setPlaceholder(defaultPlaceholder);
          setInputDisabled(true);
        });
      })
      .catch(function(error) {
        console.log('Failed to get IP address :\'(', error)
      });
  };

  const formSubmitEvent = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submit();
  }

  return (
    <HomeContainer>
      <FancyBackground />
      <UserInputMain onSubmit={formSubmitEvent}>
        <Heading as="h1" size="large" align="center" color={colors.primary}>Web Check</Heading>
        <Input
          id="user-input"
          value={userInput}
          label="Enter a URL"
          size="large"
          orientation="vertical"
          placeholder={placeholder}
          disabled={inputDisabled}
          handleChange={inputChange}
        />
        {/* <FindIpButton onClick={findIpAddress}>Or, find my IP</FindIpButton> */}
        { errorMsg && <ErrorMessage>{errorMsg}</ErrorMessage>}
        <Button size="large" onClick={submit}>Analyze!</Button>
      </UserInputMain>
      <Footer isFixed={true} />
    </HomeContainer>
  );
}

export default Home;
