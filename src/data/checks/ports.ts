import type { Check } from '.';

export default {
  title: 'Open Ports',
  categories: ['server', 'security'],
  summary: 'Which common ports are open and reachable on the host',
  description:
    'Ports are the numbered endpoints a server listens on, each conventionally tied ' +
    'to a service: 80 for HTTP, 443 for HTTPS, 22 for SSH, 21 for FTP. This check ' +
    'reports which of the common ones accept a connection.',
  use:
    'Anything listening is something that can be attacked, so an unexpected open port ' +
    'is worth explaining. Database ports, admin interfaces and remote access services ' +
    'exposed straight to the internet are the usual findings.',
  resources: [
    {
      title: 'List of TCP & UDP Port Numbers',
      link: 'https://en.wikipedia.org/wiki/List_of_TCP_and_UDP_port_numbers',
    },
    {
      title: 'NMAP - Port Scanning Basics',
      link: 'https://nmap.org/book/man-port-scanning-basics.html',
    },
  ],
  screenshot: 'https://pixelflare.cc/alicia/web-check/wc-ports',
} satisfies Check;
