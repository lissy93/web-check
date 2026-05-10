import styled from '@emotion/styled';
import colors from 'client/styles/colors';
import { StyledCard } from 'client/components/Form/Card';
import Heading from 'client/components/Form/Heading';

const Wrapper = styled(StyledCard)`
  margin: 0 auto;
  width: 95vw;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  h2 {
    margin: 0;
  }
  p {
    margin: 0;
  }
  .target {
    font-family: var(--font-mono);
    background: ${colors.background};
    padding: 0.4rem 0.6rem;
    border-radius: 4px;
    word-break: break-all;
    align-self: flex-start;
    max-width: 100%;
    color: ${colors.textColor};
  }
  .reasons {
    margin: 0;
    padding-left: 1.25rem;
    color: ${colors.textColorSecondary};
    li {
      padding: 0.15rem 0;
    }
  }
  .detail {
    color: ${colors.textColorSecondary};
    font-size: 0.85rem;
    word-break: break-word;
  }
`;

type Kind = 'unreachable' | 'invalid' | 'api-down' | 'disabled';

const VARIANT: Record<Kind, { title: string; description: string; reasons: string[] }> = {
  unreachable: {
    title: 'Cannot Reach This Site',
    description: 'We could not resolve an IP address for this host, so checks cannot run',
    reasons: [
      'The domain might be misspelled or no longer registered',
      'The website may be offline or temporarily unreachable',
      'A DNS resolution issue may be affecting the lookup',
      'A firewall or geo-block may be preventing access',
    ],
  },
  invalid: {
    title: 'Invalid Input',
    description: 'That does not look like a valid URL or IP address, so checks cannot run',
    reasons: [
      'Enter a domain (example.com) or an IPv4 / IPv6 address',
      'Check for typos or stray characters in the input',
      'Avoid spaces and unsupported symbols in the address',
    ],
  },
  'api-down': {
    title: 'Service Unavailable',
    description: 'Most checks failed because the Web-Check API could not be reached',
    reasons: [
      'The API may be down, restarting or rate-limited',
      'A self-hosted instance might be misconfigured or offline',
      'A network or firewall issue could be blocking the API',
    ],
  },
  disabled: {
    title: 'Web-Check is Paused',
    description: 'This instance has been temporarily disabled, so checks cannot run',
    reasons: [
      'The public instance may be paused to manage running costs',
      'A self-hosted instance may be in maintenance mode',
      'You can run your own copy from the open-source repo on GitHub',
    ],
  },
};

interface Props {
  address: string;
  error?: string;
  kind?: Kind;
}

// Surface a friendly explanation when input is invalid or the host is unreachable
const NoResults = ({ address, error, kind = 'unreachable' }: Props): JSX.Element => {
  const { title, description, reasons } = VARIANT[kind];
  return (
    <Wrapper role="alert">
      <Heading as="h2" align="left" color={colors.danger}>
        {title}
      </Heading>
      <p>{description}</p>
      <code className="target">{address}</code>
      <p>Possible reasons:</p>
      <ul className="reasons">
        {reasons.map((r) => (
          <li key={r}>{r}</li>
        ))}
      </ul>
      {error && <span className="detail">Lookup error: {error}</span>}
    </Wrapper>
  );
};

export default NoResults;
