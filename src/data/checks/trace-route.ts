import type { Check } from '.';

export default {
  title: 'Traceroute',
  categories: ['server'],
  summary: 'The network path packets travel to reach the server',
  description:
    'Traces the path a packet takes to reach the host, recording each router it ' +
    'passes through and how long that hop took.',
  use:
    'The route shows which networks the traffic crosses on its way in, which is how ' +
    'you spot a CDN sitting in front of an origin server, a congested transit ' +
    'provider, or traffic taking a surprising geographic detour.',
  resources: [
    'https://www.cloudflare.com/learning/network-layer/what-is-traceroute/',
    'https://tools.ietf.org/html/rfc1393',
    'https://en.wikipedia.org/wiki/Traceroute',
    'https://www.ripe.net/publications/docs/ripe-611',
  ],
  screenshot: 'https://pixelflare.cc/alicia/web-check/wc-trace-route',
} satisfies Check;
