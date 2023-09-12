const puppeteer = require('puppeteer-core');
const chromium = require('chrome-aws-lambda');
const middleware = require('./_common/middleware');

const handler = async (targetUrl) => {

  if (!targetUrl) {
    throw new Error('URL is missing from queryStringParameters');
  }

  if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
    targetUrl = 'http://' + targetUrl;
  }

  try {
    new URL(targetUrl);
  } catch (error) {
    throw new Error('URL provided is invalid');
  }

  let browser = null;
  try {
      browser = await puppeteer.launch({
      args: [...chromium.args, '--no-sandbox'], // Add --no-sandbox flag
      defaultViewport: { width: 800, height: 600 },
      executablePath: process.env.CHROME_PATH || await chromium.executablePath,
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
      ignoreDefaultArgs: ['--disable-extensions'],
    });

    let page = await browser.newPage();

    await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'dark' }]);
    page.setDefaultNavigationTimeout(8000);
    await page.goto(targetUrl, { waitUntil: 'domcontentloaded' });

    await page.evaluate(() => {
      const selector = 'body';
      return new Promise((resolve, reject) => {
        const element = document.querySelector(selector);
        if (!element) {
          reject(new Error(`Error: No element found with selector: ${selector}`));
        }
        resolve();
      });
    });

    const screenshotBuffer = await page.screenshot();
    const base64Screenshot = screenshotBuffer.toString('base64');

    return { image: base64Screenshot };

  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }
};

module.exports = middleware(handler);
module.exports.handler = middleware(handler);
