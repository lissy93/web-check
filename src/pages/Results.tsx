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
import { determineAddressType, AddressType } from 'utils/address-type-checker';

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
  const [ ipAddress, setIpAddress ] = useState<undefined | string>(undefined);
  const [ addressType, setAddressType ] = useState<AddressType>('empt');
  const { address } = useParams();
  

  useEffect(() => {
    setAddressType(determineAddressType(address || ''));
    if (addressType === 'ipV4') {
      setIpAddress(address);
    }
  }, []);

  /* Get IP address from URL */
  useEffect(() => {
    const fetchIpAddress = () => {
      fetch(`/find-url-ip?address=${address}`)
      .then(function(response) {
        console.log(response);
        response.json().then(jsonData => {
          console.log('Get IP Address', jsonData);
          setIpAddress(jsonData.ip);
        });
      })
      .catch(function(error) {
        console.log(error)
      });
    };
    if (!ipAddress) {
      fetchIpAddress();
    }
  }, [address]);

  /* Get IP address location info */
  useEffect(() => {
    const fetchIpLocation = () => {
      fetch(`https://ipapi.co/${ipAddress}/json/`)
      .then(function(response) {
        response.json().then(jsonData => {
          setLocationResults(getLocation(jsonData));
        });
      })
      .catch(function(error) {
        console.log(error)
      });
    };
    if (ipAddress) {
      fetchIpLocation();
    }
  }, [ipAddress]);

  /* Get hostnames and server info from Shodan */
  useEffect(() => {
    const applyShodanResults = (response: any) => {
      const serverInfo = getServerInfo(response);
      const hostNames = getHostNames(response);
      setResults({...results, serverInfo, hostNames });
    }
    const fetchShodanData = () => {
      const apiKey = keys.shodan;
      fetch(`https://api.shodan.io/shodan/host/${ipAddress}?key=${apiKey}`)
        .then(response => response.json())
        .then(response => {
          if (!response.error) applyShodanResults(response)
        })
        .catch(err => console.error(err));
    };
    

    if (ipAddress) {
      fetchShodanData();
    }
  }, [ipAddress]);
  
  /* Get WhoIs info for a given domain name */
  useEffect(() => {
    const applyWhoIsResults = (response: any) => {
      console.log('WhoIs Response', response);
    }
    const fetchWhoIsData = () => {
      const apiKey = keys.whoApi;
      fetch(`https://api.whoapi.com/?domain=${address}&r=whois&apikey=${apiKey}`)
        .then(response => response.json())
        .then(response => {
          if (!response.error) applyWhoIsResults(response)
        })
        .catch(err => console.error(err));
    };
    
    if (addressType === 'url') {
      fetchWhoIsData();
    }
  }, [addressType, address]);

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
