import type { Check } from '.';

export default {
  title: 'IP Info',
  categories: [],
  summary: 'The IP address the domain currently resolves to',
  description:
    'An IP address is the numerical label given to a device on a network. To find the ' +
    'one behind a domain, you ask DNS for its A record, or its AAAA record for IPv6.',
  use:
    'The IP is where most other investigation starts. Once you have it you can look ' +
    'up who owns the address range, roughly where the machine sits, which provider ' +
    'runs it, and what else is served from the same address.',
  resources: [
    {
      title: 'Understanding IP Addresses',
      link: 'https://www.digitalocean.com/community/tutorials/understanding-ip-addresses-subnets-and-cidr-notation-for-networking',
    },
    { title: 'IP Addresses - Wiki', link: 'https://en.wikipedia.org/wiki/IP_address' },
    { title: 'RFC-791 Internet Protocol', link: 'https://tools.ietf.org/html/rfc791' },
    { title: 'whatismyipaddress.com', link: 'https://whatismyipaddress.com/' },
  ],
} satisfies Check;
