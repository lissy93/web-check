const puppeteer = require('puppeteer-core');
const chromium = require('@sparticuz/chromium');

exports.handler = async (event, context, callback) => {
  let browser = null;
  let targetUrl = event.queryStringParameters.url;

  if (!targetUrl) {
    callback(null, {
      statusCode: 400,
      body: JSON.stringify({ error: 'URL is missing from queryStringParameters' }),
    });
    return;
  }

  if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
    targetUrl = 'http://' + targetUrl;
  }

  try {
    new URL(targetUrl);
  } catch (error) {
    callback(null, {
      statusCode: 400,
      body: JSON.stringify({ error: 'URL provided is invalid' }),
    });
    return;
  }

  try {
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: { width: 800, height: 600 },
      executablePath: '/usr/bin/chromium',
      // executablePath: await chromium.executablePath(),
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });

    let page = await browser.newPage();

    // Emulate dark theme
    await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'dark' }]);

    // Set navigation timeout
    page.setDefaultNavigationTimeout(5000);

    await page.goto(targetUrl, { waitUntil: 'domcontentloaded' });

    // Ensure the page has some minimal interactivity before taking the screenshot.
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

    const response = {
      statusCode: 200,
      body: JSON.stringify({ image: base64Screenshot }),
    };

    callback(null, response);
  } catch (error) {
    callback(null, {
      statusCode: 500,
      body: JSON.stringify({ error: `An error occurred: ${error.message}` }),
    });
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }
};
