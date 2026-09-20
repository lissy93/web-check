import Heading from 'client/components/Form/Heading';
import Nav from 'client/components/Form/Nav';
import colors from 'client/styles/colors';
import type { AddressType } from 'client/utils/address-type-checker';
import { toolName, type CategoryId } from '@/data/categories';

interface Props {
  address: string;
  addressType: AddressType;
  category?: CategoryId;
}

const makeSiteName = (address: string): string => {
  try {
    const withScheme = /^https?:\/\//i.test(address) ? address : `https://${address}`;
    return new URL(withScheme).hostname.replace(/^www\./, '');
  } catch {
    return address;
  }
};

const ResultsHeader = ({ address, addressType, category }: Props): JSX.Element => (
  <Nav tool={category ? { name: toolName(category), href: `/${category}` } : undefined}>
    {address && (
      <Heading color={colors.textColor} size="medium">
        {addressType === 'url' && (
          <a
            target="_blank"
            rel="noreferrer"
            href={/^https?:\/\//i.test(address) ? address : `https://${address}`}
          >
            <img width="32px" alt="" src={`https://icon.horse/icon/${makeSiteName(address)}`} />
          </a>
        )}
        {makeSiteName(address)}
      </Heading>
    )}
  </Nav>
);

export default ResultsHeader;
