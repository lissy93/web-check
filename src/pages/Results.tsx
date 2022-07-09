import { useState, useEffect } from 'react';
import {   useParams } from "react-router-dom";
import styled from 'styled-components';

import colors from 'styles/colors';
import Heading from 'components/Form/Heading';
import Card from 'components/Form/Card';
import ServerLocationCard from 'components/Results/ServerLocation';
import ServerInfoCard from 'components/Results/ServerInfo';
import HostNamesCard from 'components/Results/HostNames';
import keys from 'utils/get-keys';
import { determineAddressType } from 'utils/address-type-checker';

import {
  getLocation, ServerLocation,
  getServerInfo, ServerInfo,
  getHostNames, HostNames,
} from 'utils/result-processor';

const ResultsOuter = styled.div`
  display: flex;
  flex-direction: column;
`;

const ResultsContent = styled.section`
  width: 95vw;
  display: flex;
  flex-wrap: wrap;
`;

const Header = styled(Card)`
  margin: 1rem;
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  padding: 0.5rem 1rem;
`;

interface ResultsType {
  serverLocation?: ServerLocation,
  serverInfo?: ServerInfo,
  hostNames?: HostNames,
};

const Results = (): JSX.Element => {
  const [ results, setResults ] = useState<ResultsType>({});
  const [ locationResults, setLocationResults ] = useState<ServerLocation>();
  const { address } = useParams();
  if (address) {
    console.log(decodeURIComponent(address));
  }


  useEffect(() => {
    fetch(`https://ipapi.co/${address}/json/`)
    .then(function(response) {
      response.json().then(jsonData => {
        console.log(jsonData);
        setLocationResults(getLocation(jsonData));
      });
    })
    .catch(function(error) {
      console.log(error)
    });
  }, []);

  useEffect(() => {
    const applyShodanResults = (response: any) => {
      // const serverLocation = getLocation(response);
      const serverInfo = getServerInfo(response);
      const hostNames = getHostNames(response);
      setResults({...results, serverInfo, hostNames });
    }
    const fetchShodanData = () => {
      const apiKey = keys.shodan;
      fetch(`https://api.shodan.io/shodan/host/${address}?key=${apiKey}`)
        .then(response => response.json())
        .then(response => {
          if (!response.error) applyShodanResults(response)
        })
        .catch(err => console.error(err));
    };
    const addressType = determineAddressType(address || '');
    if (addressType !== 'ipV4') {
      // Not an IP address, get IP from URL
    } else {
      fetchShodanData();
    }
  }, []);

  return (
    <ResultsOuter>
      <Header as="header">
        <Heading color={colors.primary} size="large">Results</Heading>
        <Heading color={colors.textColor} size="medium">{address}</Heading>
      </Header>
      <ResultsContent>
        { locationResults && <ServerLocationCard {...locationResults} />}
        { results.serverInfo && <ServerInfoCard {...results.serverInfo} />}
        { results.hostNames && <HostNamesCard hosts={results.hostNames} />}
      </ResultsContent>
    </ResultsOuter>
  );
}

export default Results;
