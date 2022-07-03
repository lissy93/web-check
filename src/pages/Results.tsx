import { useState, useEffect } from 'react';
import {   useParams } from "react-router-dom";
import styled from 'styled-components';

import colors from 'styles/colors';
import Heading from 'components/Form/Heading';
import ServerLocationCard from 'components/Results/ServerLocation';

import { getLocation, ServerLocation } from 'utils/result-processer';

const ResultsOuter = styled.div`
  display: flex;
`;

const ResultsInner = styled.section`
  padding: 1rem;
  margin: 1rem;
  width: 95vw;
`;

interface ResultsType {
  serverLocation?: ServerLocation,
};

const Results = (): JSX.Element => {
  const [ results, setResults ] = useState<ResultsType>({});
  const { address } = useParams();
  if (address) {
    console.log(decodeURIComponent(address));
  }

  const applyResults = (response: any) => {
    console.log(response);
    const serverLocation = getLocation(response);
    setResults({...results, serverLocation });
  }

  useEffect(() => {
    console.log('Will fetch....', process.env.SHODAN_API_KEY);
    const apiKey = 'REMOVED';
    fetch(`https://api.shodan.io/shodan/host/${address}?key=${apiKey}`)
    .then(response => response.json())
    .then(response => applyResults(response))
    .catch(err => console.error(err));
  }, [address]);

  return (
    <ResultsOuter>
      <ResultsInner>
        <Heading color={colors.primary} size="large">Results</Heading>
        <Heading color={colors.textColor} size="medium">{address}</Heading>
        { results.serverLocation && <ServerLocationCard {...results.serverLocation} />}
      </ResultsInner>
    </ResultsOuter>
  );
}

export default Results;
