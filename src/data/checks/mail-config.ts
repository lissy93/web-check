import type { Check } from '.';

export default {
  title: 'Email Configuration',
  categories: ['email'],
  summary: 'MX, SPF, DKIM and DMARC records for sending and receiving mail',
  description:
    "Collects the DNS records that govern a domain's email. SPF lists which servers " +
    'may send on its behalf. DKIM publishes the public key used to sign outgoing ' +
    'messages, so a recipient can tell nothing was altered in transit. DMARC ties the ' +
    'two together, telling receiving servers what to do when a message fails and ' +
    'where to send reports. BIMI, newer and far less common, attaches a verified logo ' +
    'to a passing DMARC policy so inboxes can display it.',
  use:
    'A domain with no SPF, or a DMARC policy set to none, can be spoofed with very ' +
    'little effort, and most organisations find this out only after somebody has done ' +
    'it. The records also name the mail provider and every third party authorised to ' +
    "send, which is a reliable way to map an organisation's vendors.",
  resources: [
    {
      title: 'Intro to DMARC, DKIM, and SPF (via Cloudflare)',
      link: 'https://www.cloudflare.com/learning/email-security/dmarc-dkim-spf/',
    },
    {
      title: 'EasyDMARC Domain Scanner',
      link: 'https://easydmarc.com/tools/domain-scanner',
    },
    { title: 'MX Toolbox', link: 'https://mxtoolbox.com/' },
    { title: 'RFC-7208 - SPF', link: 'https://datatracker.ietf.org/doc/html/rfc7208' },
    { title: 'RFC-6376 - DKIM', link: 'https://datatracker.ietf.org/doc/html/rfc6376' },
    { title: 'RFC-7489 - DMARC', link: 'https://datatracker.ietf.org/doc/html/rfc7489' },
    { title: 'BIMI Group', link: 'https://bimigroup.org/' },
  ],
  screenshot: 'https://pixelflare.cc/alicia/web-check/wc-email',
} satisfies Check;
