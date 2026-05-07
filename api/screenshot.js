import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
import { randomUUID } from 'crypto';
import { execFile } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';
import middleware from './_common/middleware.js';
import { createLogger } from './_common/logger.js';

const log = createLogger('screenshot');

// Screenshot via the system Chromium binary
const directChromiumScreenshot = async (url) => {
  const tmpDir = '/tmp';
  const screenshotPath = path.join(tmpDir, `screenshot-${randomUUID()}.png`);
  log.debug(`direct method, saving to ${screenshotPath}`);

  return new Promise((resolve, reject) => {
    const chromePath = process.env.CHROME_PATH || '/usr/bin/chromium';
    const args = [
      '--headless',
      '--disable-gpu',
      '--no-sandbox',
      `--screenshot=${screenshotPath}`,
      url,
    ];
    execFile(chromePath, args, async (error) => {
      if (error) return reject(error);
      try {
        const buf = await fs.readFile(screenshotPath);
        await fs
          .unlink(screenshotPath)
          .catch((err) => log.warn(`temp cleanup failed: ${err.message}`));
        resolve(buf.toString('base64'));
      } catch (readError) {
        reject(readError);
      }
    });
  });
};

// Fallback to puppeteer when the direct Chromium binary call fails
const puppeteerScreenshot = async (targetUrl) => {
  let browser = null;
  try {
    browser = await puppeteer.launch({
      args: [...chromium.args, '--no-sandbox'],
      defaultViewport: { width: 800, height: 600 },
      executablePath: process.env.CHROME_PATH || (await chromium.executablePath()),
      headless: true,
      acceptInsecureCerts: true,
      ignoreDefaultArgs: ['--disable-extensions'],
    });
    const page = await browser.newPage();
    await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'dark' }]);
    page.setDefaultNavigationTimeout(8000);
    await page.goto(targetUrl, { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => {
      if (!document.querySelector('body')) {
        throw new Error('No body element found on the page');
      }
    });
    const buffer = await page.screenshot();
    return buffer.toString('base64');
  } finally {
    if (browser) await browser.close().catch(() => {});
  }
};

const screenshotHandler = async (targetUrl) => {
  if (!targetUrl) throw new Error('URL is missing from queryStringParameters');
  try {
    new URL(targetUrl);
  } catch {
    throw new Error('URL provided is invalid');
  }

  log.debug(`request received: ${targetUrl}`);
  try {
    return { image: await directChromiumScreenshot(targetUrl) };
  } catch (directError) {
    log.warn(`direct chromium failed, falling back to puppeteer: ${directError.message}`);
  }
  try {
    return { image: await puppeteerScreenshot(targetUrl) };
  } catch (error) {
    if (/ENOENT|Browser was not found|Could not find Chromium/i.test(error.message)) {
      return { skipped: error.message };
    }
    log.error(`puppeteer screenshot failed: ${error.message}`);
    throw error;
  }
};

export const handler = middleware(screenshotHandler);
export default handler;
