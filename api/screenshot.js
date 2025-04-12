import puppeteer from 'puppeteer-core';
import chromium from 'chrome-aws-lambda';
import middleware from './_common/middleware.js';
import { execFile } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';
import pkg from 'uuid';
const { v4: uuidv4 } = pkg;

// Helper function for direct chromium screenshot as fallback
const directChromiumScreenshot = async (url) => {
  console.log(`[DIRECT-SCREENSHOT] Starting direct screenshot process for URL: ${url}`);
  
  // Create a tmp filename
  const tmpDir = '/tmp';
  const uuid = uuidv4();
  const screenshotPath = path.join(tmpDir, `screenshot-${uuid}.png`);
  
  console.log(`[DIRECT-SCREENSHOT] Will save screenshot to: ${screenshotPath}`);
  
  return new Promise((resolve, reject) => {
    const chromePath = process.env.CHROME_PATH || '/usr/bin/chromium';
    const args = [
      '--headless',
      '--disable-gpu',
      '--no-sandbox',
      `--screenshot=${screenshotPath}`,
      url
    ];

    console.log(`[DIRECT-SCREENSHOT] Executing: ${chromePath} ${args.join(' ')}`);
    
    execFile(chromePath, args, async (error, stdout, stderr) => {
      if (error) {
        console.error(`[DIRECT-SCREENSHOT] Chromium error: ${error.message}`);
        return reject(error);
      }
  
      try {
        // Read the screenshot file
        const screenshotData = await fs.readFile(screenshotPath);
        console.log(`[DIRECT-SCREENSHOT] Screenshot read successfully`);
        
        // Convert to base64
        const base64Data = screenshotData.toString('base64');
  
        await fs.unlink(screenshotPath).catch(err =>
          console.warn(`[DIRECT-SCREENSHOT] Failed to delete temp file: ${err.message}`)
        );
  
        resolve(base64Data);
      } catch (readError) {
        console.error(`[DIRECT-SCREENSHOT] Failed reading screenshot: ${readError.message}`);
        reject(readError);
      }
    });
  });
};

const screenshotHandler = async (targetUrl) => {
  console.log(`[SCREENSHOT] Request received for URL: ${targetUrl}`);
  
  if (!targetUrl) {
    console.error('[SCREENSHOT] URL is missing from queryStringParameters');
    throw new Error('URL is missing from queryStringParameters');
  }
  
  if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
    targetUrl = 'http://' + targetUrl;
  }
  
  try {
    new URL(targetUrl);
  } catch (error) {
    console.error(`[SCREENSHOT] URL provided is invalid: ${targetUrl}`);
    throw new Error('URL provided is invalid');
  }

  // First try direct Chromium
  try {
    console.log(`[SCREENSHOT] Using direct Chromium method for URL: ${targetUrl}`);
    const base64Screenshot = await directChromiumScreenshot(targetUrl);
    console.log(`[SCREENSHOT] Direct screenshot successful`);
    return { image: base64Screenshot };
  } catch (directError) {
    console.error(`[SCREENSHOT] Direct screenshot method failed: ${directError.message}`);
    console.log(`[SCREENSHOT] Falling back to puppeteer method...`);
  }
  
  // fall back puppeteer 
  let browser = null;
  try {
    console.log(`[SCREENSHOT] Launching puppeteer browser`);
    browser = await puppeteer.launch({
      args: [...chromium.args, '--no-sandbox'], // Add --no-sandbox flag
      defaultViewport: { width: 800, height: 600 },
      executablePath: process.env.CHROME_PATH || '/usr/bin/chromium',
      headless: true,
      ignoreHTTPSErrors: true,
      ignoreDefaultArgs: ['--disable-extensions'],
    });
    
    console.log(`[SCREENSHOT] Creating new page`);
    let page = await browser.newPage();
    
    console.log(`[SCREENSHOT] Setting page preferences`);
    await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'dark' }]);
    page.setDefaultNavigationTimeout(8000);
    
    console.log(`[SCREENSHOT] Navigating to URL: ${targetUrl}`);
    await page.goto(targetUrl, { waitUntil: 'domcontentloaded' });
    
    console.log(`[SCREENSHOT] Checking if body element exists`);
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
    
    console.log(`[SCREENSHOT] Taking screenshot`);
    const screenshotBuffer = await page.screenshot();
    
    console.log(`[SCREENSHOT] Converting screenshot to base64`);
    const base64Screenshot = screenshotBuffer.toString('base64');
    
    console.log(`[SCREENSHOT] Screenshot complete, returning image`);
    return { image: base64Screenshot };
  } catch (error) {
    console.error(`[SCREENSHOT] Puppeteer screenshot failed: ${error.message}`);
    throw error;
  } finally {
    if (browser !== null) {
      console.log(`[SCREENSHOT] Closing browser`);
      await browser.close();
    }
  }
};

export const handler = middleware(screenshotHandler);
export default handler;
