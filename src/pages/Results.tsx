import { useState, useEffect } from 'react';
import {   useParams } from "react-router-dom";
import styled from 'styled-components';

import colors from 'styles/colors';
import Heading from 'components/Form/Heading';
import Card from 'components/Form/Card';
import ServerLocationCard from 'components/Results/ServerLocation';
import ServerInfoCard from 'components/Results/ServerInfo';
import HostNamesCard from 'components/Results/HostNames';
import WhoIsCard from 'components/Results/WhoIs';
import BuiltWithCard from 'components/Results/BuiltWith';
import LighthouseCard from 'components/Results/Lighthouse';
import ScreenshotCard from 'components/Results/Screenshot';
import SslCertCard from 'components/Results/SslCert';
import keys from 'utils/get-keys';
import { determineAddressType, AddressType } from 'utils/address-type-checker';

import {
  getLocation, ServerLocation,
  getServerInfo, ServerInfo,
  getHostNames, HostNames,
  makeTechnologies, TechnologyGroup,
  Whois,
} from 'utils/result-processor';

const ResultsOuter = styled.div`
  display: flex;
  flex-direction: column;
`;

const ResultsContent = styled.section`
  width: 95vw;

  display: grid;
  grid-auto-flow: dense;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1rem;
  margin: auto;
  width: calc(100% - 2rem);
`;

const Header = styled(Card)`
  margin: 1rem;
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  padding: 0.5rem 1rem;
`;

interface ResultsType {
  serverLocation?: ServerLocation,
  serverInfo?: ServerInfo,
  hostNames?: HostNames | null,
};

const Results = (): JSX.Element => {
  const [ results, setResults ] = useState<ResultsType>({});
  const [ locationResults, setLocationResults ] = useState<ServerLocation>();
  const [ whoIsResults, setWhoIsResults ] = useState<Whois>();
  const [ technologyResults, setTechnologyResults ] = useState<TechnologyGroup[]>();
  const [ lighthouseResults, setLighthouseResults ] = useState<any>();
  const [ sslResults, setSslResults ] = useState<any>();
  const [ screenshotResult, setScreenshotResult ] = useState<string>();
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
        response.json().then(jsonData => {
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

  /* Get SSL info */
  useEffect(() => {
    fetch(`/ssl-check?url=${address}`)
      .then(response => response.json())
      .then(response => {
        console.log(response);
        setSslResults(response);
      })
      .catch(err => console.error(err));
  }, [address])

  /* Get Lighthouse report */
  useEffect(() => {
    fetch(`/lighthouse-report?url=${address}`)
      .then(response => response.json())
      .then(response => {
        setLighthouseResults(response.lighthouseResult);
        setScreenshotResult(response.lighthouseResult?.fullPageScreenshot?.screenshot?.data);
      })
      .catch(err => console.error(err));
  }, [address])

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

  /* Get BuiltWith tech stack */
  useEffect(() => {
    const apiKey = keys.builtWith;
    const endpoint = `https://api.builtwith.com/v21/api.json?KEY=${apiKey}&LOOKUP=${address}`;
    fetch(endpoint)
      .then(response => response.json())
      .then(response => {
        setTechnologyResults(makeTechnologies(response));
      });
  }, [address]);
  
  /* Get WhoIs info for a given domain name */
  useEffect(() => {
    const applyWhoIsResults = (response: any) => {
      const whoIsResults: Whois = {
        created: response.date_created,
        expires: response.date_expires,
        updated: response.date_updated,
        nameservers: response.nameservers,
      };
      setWhoIsResults(whoIsResults);
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
        <Heading color={colors.textColor} size="medium">
          { address && <img width="32px" src={`https://icon.horse/icon/${new URL(address).hostname}`} alt="" /> }
          {address}
        </Heading>
      </Header>
      <ResultsContent>
        { locationResults && <ServerLocationCard {...locationResults} />}
        { results.serverInfo && <ServerInfoCard {...results.serverInfo} />}
        { results?.hostNames && <HostNamesCard hosts={results?.hostNames} />}
        { whoIsResults && <WhoIsCard {...whoIsResults} />}
        { lighthouseResults && <LighthouseCard lighthouse={lighthouseResults} />}
        { screenshotResult && <ScreenshotCard screenshot={screenshotResult} />}
        { technologyResults && <BuiltWithCard technologies={technologyResults} />}
        { sslResults && <SslCertCard sslCert={sslResults} />}
      </ResultsContent>
    </ResultsOuter>
  );
}

export default Results;
