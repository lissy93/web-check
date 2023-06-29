import { useState, useEffect, useCallback } from 'react';
import {   useParams } from "react-router-dom";
import styled from 'styled-components';

import colors from 'styles/colors';
import Heading from 'components/Form/Heading';
import Card from 'components/Form/Card';
import ErrorBoundary from 'components/misc/ErrorBoundary';
import Footer from 'components/misc/Footer';
import { RowProps }  from 'components/Form/Row';


import ServerLocationCard from 'components/Results/ServerLocation';
import ServerInfoCard from 'components/Results/ServerInfo';
import HostNamesCard from 'components/Results/HostNames';
import WhoIsCard from 'components/Results/WhoIs';
import BuiltWithCard from 'components/Results/BuiltWith';
import LighthouseCard from 'components/Results/Lighthouse';
import ScreenshotCard from 'components/Results/Screenshot';
import SslCertCard from 'components/Results/SslCert';
import HeadersCard from 'components/Results/Headers';
import CookiesCard from 'components/Results/Cookies';
import RobotsTxtCard from 'components/Results/RobotsTxt';
import DnsRecordsCard from 'components/Results/DnsRecords';
import RedirectsCard from 'components/Results/Redirects';
import TxtRecordCard from 'components/Results/TxtRecords';
import ServerStatusCard from 'components/Results/ServerStatus';
import ProgressBar, { LoadingJob, LoadingState, initialJobs } from 'components/misc/ProgressBar';
import keys from 'utils/get-keys';
import { determineAddressType, AddressType } from 'utils/address-type-checker';

import useMotherHook from 'hooks/motherOfAllHooks';


import {
  getLocation, ServerLocation,
  makeTechnologies, TechnologyGroup,
  parseCookies, Cookie,
  parseRobotsTxt,
  applyWhoIsResults, Whois,
  parseShodanResults, ShodanResults
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
  padding-bottom: 1rem;
`;

const Header = styled(Card)`
  margin: 1rem;
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  padding: 0.5rem 1rem;
`;

const Results = (): JSX.Element => {
  const startTime = new Date().getTime();

  const [ addressType, setAddressType ] = useState<AddressType>('empt');
  const { address } = useParams();

  const [ loadingJobs, setLoadingJobs ] = useState<LoadingJob[]>(initialJobs);

  const updateLoadingJobs = useCallback((job: string, newState: LoadingState, error?: string) => {
    const timeTaken = new Date().getTime() - startTime;
    setLoadingJobs((prevJobs) => {
      const newJobs = prevJobs.map((loadingJob: LoadingJob) => {
        if (loadingJob.name === job) {
          return { ...loadingJob, error, state: newState, timeTaken };
        }
        return loadingJob;
      });

      if (newState === 'success') {
        console.log(
          `%cFetch Success - ${job}%c\n\nThe ${job} job succeeded in ${timeTaken}ms`,
          `background: ${colors.success}; color: ${colors.background}; padding: 4px 8px; font-size: 16px;`,
          `color: ${colors.success};`,
        );
      }
  
      if (newState === 'error') {
        console.log(
          `%cFetch Error - ${job}%c\n\nThe ${job} job failed with the following error:%c\n${error}`,
          `background: ${colors.danger}; padding: 4px 8px; font-size: 16px;`,
          `color: ${colors.danger};`,
          `color: ${colors.warning};`,
        );
      }
      return newJobs;
    });
  }, []);

  useEffect(() => {
    setAddressType(determineAddressType(address || ''));
    if (addressType === 'ipV4' && address) {
      setIpAddress(address);
    }
  }, []);

  const urlTypeOnly = ['url'] as AddressType[]; // Many jobs only run with these address types

  // Fetch and parse IP address for given URL
  const [ipAddress, setIpAddress] = useMotherHook({
    jobId: 'get-ip',
    updateLoadingJobs,
    addressInfo: { address, addressType, expectedAddressTypes: urlTypeOnly },
    fetchRequest: () => fetch(`/find-url-ip?address=${address}`)
    .then(res => res.json())
    .then(res => res.ip),
  });

  // Fetch and parse SSL certificate info
  const [sslResults] = useMotherHook({
    jobId: 'ssl',
    updateLoadingJobs,
    addressInfo: { address, addressType, expectedAddressTypes: urlTypeOnly },
    fetchRequest: () => fetch(`/ssl-check?url=${address}`).then((res) => res.json()),
  });

  // Fetch and parse cookies info
  const [cookieResults] = useMotherHook<{cookies: Cookie[]}>({
    jobId: 'cookies',
    updateLoadingJobs,
    addressInfo: { address, addressType, expectedAddressTypes: urlTypeOnly },
    fetchRequest: () => fetch(`/get-cookies?url=${address}`)
      .then(res => res.json())
      .then(res => parseCookies(res.cookies)),
  });

  // Fetch and parse crawl rules from robots.txt
  const [robotsTxtResults] = useMotherHook<{robots: RowProps[]}>({
    jobId: 'robots-txt',
    updateLoadingJobs,
    addressInfo: { address, addressType, expectedAddressTypes: urlTypeOnly },
    fetchRequest: () => fetch(`/read-robots-txt?url=${address}`)
      .then(res => res.text())
      .then(res => parseRobotsTxt(res)),
  });

  // Fetch and parse headers
  const [headersResults] = useMotherHook({
    jobId: 'headers',
    updateLoadingJobs,
    addressInfo: { address, addressType, expectedAddressTypes: urlTypeOnly },
    fetchRequest: () => fetch(`/get-headers?url=${address}`).then(res => res.json()),
  });

  // Fetch and parse DNS records
  const [dnsResults] = useMotherHook({
    jobId: 'dns',
    updateLoadingJobs,
    addressInfo: { address, addressType, expectedAddressTypes: urlTypeOnly },
    fetchRequest: () => fetch(`/get-dns?url=${address}`).then(res => res.json()),
  });

  // Fetch and parse Lighthouse performance data
  const [lighthouseResults] = useMotherHook({
    jobId: 'lighthouse',
    updateLoadingJobs,
    addressInfo: { address, addressType, expectedAddressTypes: urlTypeOnly },
    fetchRequest: () => fetch(`/lighthouse-report?url=${address}`)
      .then(res => res.json())
      .then(res => res.lighthouseResult),
  });

  // Get IP address location info
  const [locationResults] = useMotherHook<ServerLocation>({
    jobId: 'location',
    updateLoadingJobs,
    addressInfo: { address: ipAddress, addressType: 'ipV4', expectedAddressTypes: ['ipV4', 'ipV6'] },
    fetchRequest: () => fetch(`https://ipapi.co/${ipAddress}/json/`)
      .then(res => res.json())
      .then(res => getLocation(res)),
  });


  // Get hostnames and associated domains from Shodan
  const [shoadnResults] = useMotherHook<ShodanResults>({
    jobId: 'shodan',
    updateLoadingJobs,
    addressInfo: { address: ipAddress, addressType: 'ipV4', expectedAddressTypes: ['ipV4', 'ipV6'] },
    fetchRequest: () => fetch(`https://api.shodan.io/shodan/host/${ipAddress}?key=${keys.shodan}`)
      .then(res => res.json())
      .then(res => parseShodanResults(res)),
  });

  // Fetch and parse domain whois results
  const [whoIsResults] = useMotherHook<Whois>({
    jobId: 'whois',
    updateLoadingJobs,
    addressInfo: { address, addressType, expectedAddressTypes: urlTypeOnly },
    fetchRequest: () => fetch(`https://api.whoapi.com/?domain=${address}&r=whois&apikey=${keys.whoApi}`)
      .then(res => res.json())
      .then(res => applyWhoIsResults(res)),
  });

  // Fetch and parse built-with results
  const [technologyResults] = useMotherHook<TechnologyGroup[]>({
    jobId: 'built-with',
    updateLoadingJobs,
    addressInfo: { address, addressType, expectedAddressTypes: urlTypeOnly },
    fetchRequest: () => fetch(`https://api.builtwith.com/v21/api.json?KEY=${keys.builtWith}&LOOKUP=${address}`)
      .then(res => res.json())
      .then(res => makeTechnologies(res)),
  });

  // Fetches DNS TXT records
  const [txtRecordResults] = useMotherHook({
    jobId: 'txt-records',
    updateLoadingJobs,
    addressInfo: { address, addressType, expectedAddressTypes: urlTypeOnly },
    fetchRequest: () => fetch(`/get-txt?url=${address}`).then(res => res.json()),
  });

  // Fetches URL redirects
  const [redirectResults] = useMotherHook({
    jobId: 'redirects',
    updateLoadingJobs,
    addressInfo: { address, addressType, expectedAddressTypes: urlTypeOnly },
    fetchRequest: () => fetch(`/follow-redirects?url=${address}`).then(res => res.json()),
  });

  // Get current status and response time of server
  const [serverStatusResults] = useMotherHook({
    jobId: 'status',
    updateLoadingJobs,
    addressInfo: { address, addressType, expectedAddressTypes: urlTypeOnly },
    fetchRequest: () => fetch(`/server-status?url=${address}`).then(res => res.json()),
  });

  /* Cancel remaining jobs after  10 second timeout */
  useEffect(() => {
    const checkJobs = () => {
      loadingJobs.forEach(job => {
        if (job.state === 'loading') {
          updateLoadingJobs(job.name, 'timed-out');
        }
      });
    };
    const timeoutId = setTimeout(checkJobs, 10000);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [loadingJobs, updateLoadingJobs]); // dependencies for the effect

  const makeSiteName = (address: string): string => {
    try {
      return new URL(address).hostname.replace('www.', '');
    } catch (error) {
      return address;
    }
  }

  // A list of state sata, corresponding component and title for each card
  const resultCardData = [
    { title: 'Server Location', result: locationResults, Component: ServerLocationCard },
    { title: 'SSL Info', result: sslResults, Component: SslCertCard },
    { title: 'Headers', result: headersResults, Component: HeadersCard },
    { title: 'Host Names', result: shoadnResults?.hostnames, Component: HostNamesCard },
    { title: 'Domain Info', result: whoIsResults, Component: WhoIsCard },
    { title: 'DNS Records', result: dnsResults, Component: DnsRecordsCard },
    { title: 'Performance', result: lighthouseResults, Component: LighthouseCard },
    { title: 'Cookies', result: cookieResults, Component: CookiesCard },
    { title: 'Screenshot', result: lighthouseResults?.fullPageScreenshot?.screenshot, Component: ScreenshotCard },
    { title: 'Technologies', result: technologyResults, Component: BuiltWithCard },
    { title: 'Crawl Rules', result: robotsTxtResults, Component: RobotsTxtCard },
    { title: 'Server Info', result: shoadnResults?.serverInfo, Component: ServerInfoCard },
    { title: 'Redirects', result: redirectResults, Component: RedirectsCard },
    { title: 'TXT Records', result: txtRecordResults, Component: TxtRecordCard },
    { title: 'Server Status', result: serverStatusResults, Component: ServerStatusCard },
  ];
  
  return (
    <ResultsOuter>
      <Header as="header">
        <Heading color={colors.primary} size="large">
          <img width="64" src="/web-check.png" alt="Web Check Icon" />
          <a href="/">Web Check</a>
        </Heading>
        { address && 
        <Heading color={colors.textColor} size="medium">
          { addressType === 'url' && <img width="32px" src={`https://icon.horse/icon/${makeSiteName(address)}`} alt="" /> }
          {makeSiteName(address)}
        </Heading>
        }
      </Header>
      <ProgressBar loadStatus={loadingJobs} />
      
      <ResultsContent>
          {
            resultCardData.map(({ title, result, Component }) => (
              (result) ? (
                <ErrorBoundary title={title} key={title}>
                <Component {...result} />
                </ErrorBoundary>
              ) : <></>
            ))
          }
      </ResultsContent>
      <Footer />
    </ResultsOuter>
  );
}

export default Results;
