const axios = require('axios');
const middleware = require('./_common/middleware');

const hasWaf = (waf) => {
  return {
    hasWaf: true, waf,
  }
};

const handler = async (url) => {
  const fullUrl = url.startsWith('http') ? url : `http://${url}`;
  
  try {
    const response = await axios.get(fullUrl);

    const headers = response.headers;

    if (headers['server'] && headers['server'].includes('cloudflare')) {
      return hasWaf('Cloudflare');
    }

    if (headers['x-powered-by'] && headers['x-powered-by'].includes('AWS Lambda')) {
      return hasWaf('AWS WAF');
    }

    if (headers['server'] && headers['server'].includes('AkamaiGHost')) {
      return hasWaf('Akamai');
    }

    if (headers['server'] && headers['server'].includes('Sucuri')) {
      return hasWaf('Sucuri');
    }

    if (headers['server'] && headers['server'].includes('BarracudaWAF')) {
      return hasWaf('Barracuda WAF');
    }

    if (headers['server'] && (headers['server'].includes('F5 BIG-IP') || headers['server'].includes('BIG-IP'))) {
      return hasWaf('F5 BIG-IP');
    }

    if (headers['x-sucuri-id'] || headers['x-sucuri-cache']) {
      return hasWaf('Sucuri CloudProxy WAF');
    }

    if (headers['server'] && headers['server'].includes('FortiWeb')) {
      return hasWaf('Fortinet FortiWeb WAF');
    }

    if (headers['server'] && headers['server'].includes('Imperva')) {
      return hasWaf('Imperva SecureSphere WAF');
    }

    if (headers['x-protected-by'] && headers['x-protected-by'].includes('Sqreen')) {
      return hasWaf('Sqreen');
    }

    if (headers['x-waf-event-info']) {
      return hasWaf('Reblaze WAF');
    }

    if (headers['set-cookie'] && headers['set-cookie'].includes('_citrix_ns_id')) {
      return hasWaf('Citrix NetScaler');
    }

    if (headers['x-denied-reason'] || headers['x-wzws-requested-method']) {
      return hasWaf('WangZhanBao WAF');
    }

    if (headers['x-webcoment']) {
      return hasWaf('Webcoment Firewall');
    }

    if (headers['server'] && headers['server'].includes('Yundun')) {
      return hasWaf('Yundun WAF');
    }

    if (headers['x-yd-waf-info'] || headers['x-yd-info']) {
      return hasWaf('Yundun WAF');
    }

    if (headers['server'] && headers['server'].includes('Safe3WAF')) {
      return hasWaf('Safe3 Web Application Firewall');
    }

    if (headers['server'] && headers['server'].includes('NAXSI')) {
      return hasWaf('NAXSI WAF');
    }

    if (headers['x-datapower-transactionid']) {
      return hasWaf('IBM WebSphere DataPower');
    }

    return {
      hasWaf: false,
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

module.exports = middleware(handler);
module.exports.handler = middleware(handler);
