// Determine whether user input is a URL, IPv4, IPv6 or invalid

export type AddressType = 'ipV4' | 'ipV6' | 'url' | 'err' | 'empt';

const isIpV4 = (value: string): boolean => {
  const p = '(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)';
  return new RegExp(`^${p}\\.${p}\\.${p}\\.${p}$`).test(value);
};

// (you guessed it!) Checks if a string is valid IPv6 address
const isIPv6 = (value: string): boolean => {
  const parts = value.split(':');
  if (parts.length < 2 || parts.length > 8) return false;
  if ((parts[0] !== '' || parts[1] !== '') && !parts[0].match(/^[\da-f]{1,4}/i)) return false;
  let empties = 0;
  for (let i = 1; i < parts.length; i++) {
    if (parts[i] === '') {
      if (++empties > 1) return false;
      continue;
    }
    if (!parts[i].match(/^[\da-f]{1,4}/i)) return false;
  }
  return true;
};

// Validate as a parseable URL via the native URL constructor
const isUrl = (value: string): boolean => {
  const withScheme = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  try {
    new URL(withScheme);
    return true;
  } catch {
    return false;
  }
};

// Input address type: URL, IPv4, IPv6 or invalid
export const determineAddressType = (address: string | undefined): AddressType => {
  if (!address || address.length <= 3) return 'empt';
  if (isIpV4(address)) return 'ipV4';
  if (isIPv6(address)) return 'ipV6';
  if (isUrl(address)) return 'url';
  return 'err';
};
