import puppeteer from 'puppeteer';
import middleware from './_common/middleware.js';
import { httpGet } from './_common/http.js';

const getPuppeteerCookies = async (url) => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();
    const navigationPromise = page.goto(url, { waitUntil: 'networkidle2' });
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Puppeteer took too long!')), 3000),
    );
    await Promise.race([navigationPromise, timeoutPromise]);
    return await browser.cookies();
  } finally {
    await browser.close();
  }
};

const cookieHandler = async (url) => {
  let headerCookies = null;
  let clientCookies = null;

  try {
    const response = await httpGet(url);
    headerCookies = response.headers['set-cookie'];
  } catch (error) {
    if (error.response) {
      return { error: `Request failed with status ${error.response.status}: ${error.message}` };
    }
    return { error: `No response received: ${error.message}` };
  }

  try {
    clientCookies = await getPuppeteerCookies(url);
  } catch (_) {
    clientCookies = null;
  }

  return {
    headerCookies: headerCookies || [],
    clientCookies: clientCookies || [],
  };
};

export const handler = middleware(cookieHandler);
export default handler;
