/** 
 * Helper functions to determine if a string is a valid web address,
 * and what type of address it is: URL, IPv4, IPv6 or none of those.
 */

export type AddressType = 'ipV4' | 'ipV6' | 'url' | 'err' | 'empt';

/* Checks if a given string looks like a URL */
const isUrl = (value: string):boolean => {
  const urlPattern = new RegExp(
    '^(https?:\\/\\/)?' + 
    '(?!([0-9]{1,3}\\.){3}[0-9]{1,3})' + // Exclude IP addresses
    '(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\\-]*[a-zA-Z0-9])\\.)*' + // Domain name or a subdomain
    '([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\\-]*[A-Za-z0-9])$', // Second level domain
    'i' // Case-insensitive
  );
  return urlPattern.test(value);
};

// /* Checks if a given string looks like a URL */
// const isUrl = (value: string):boolean => {
//   const urlRegex= new RegExp(''
//     // + /(?:(?:(https?|ftp):)?\/\/)/.source
//     + /(?:([^:\n\r]+):([^@\n\r]+)@)?/.source
//     + /(?:(?:www\.)?([^/\n\r]+))/.source
//     + /(\/[^?\n\r]+)?/.source
//     + /(\?[^#\n\r]*)?/.source
//     + /(#?[^\n\r]*)?/.source
//   );
//   return urlRegex.test(value);
// };

/* Checks if a given string looks like an IP Version 4 Address */
const isIpV4 = (value: string): boolean => {
  const ipPart = '(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)';
  const ipV4Regex = new RegExp(`^${ipPart}.${ipPart}.${ipPart}.${ipPart}$`);
  return ipV4Regex.test(value);
};

/* Checks if a given string looks like an IP Version 6 Address */
const isIPv6 = (value: string): boolean => {
  const components = value.split(':');
  
  if ((components.length < 2 || components.length > 8) ||
    ((components[0] !== '' || components[1] !== '')
      && !components[0].match(/^[\da-f]{1,4}/i))
  ) return false;

  let numberOfZeroCompressions = 0;
  for (let i = 1; i < components.length; ++i) {
    if (components[i] === '') {
      ++numberOfZeroCompressions;
      if (numberOfZeroCompressions > 1) return false;
      continue;
    }
    if (!components[i].match(/^[\da-f]{1,4}/i)) return false;
  }
  return true;
};

const isShort = (value: string): boolean => {
  return (!value || value.length <=3);
};

/* Returns the address type for a given address */
export const determineAddressType = (address: string | undefined): AddressType => {
  if (!address) return 'err';
  if (isShort(address)) return 'empt';
  if (isUrl(address)) return 'url';
  if (isIpV4(address)) return 'ipV4';
  if (isIPv6(address)) return 'ipV6';
  return 'err';
};
