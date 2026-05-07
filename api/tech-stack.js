import chromium from '@sparticuz/chromium';
import middleware from './_common/middleware.js';

// Wappalyzer reads CHROMIUM_BIN at module load, so we must resolve
// the path before importing it (hence the dynamic import in the handler)
const ensureChromiumBin = async () => {
  if (process.env.CHROMIUM_BIN) return;
  const envPath = process.env.CHROME_PATH || process.env.PUPPETEER_EXECUTABLE_PATH;
  if (envPath) {
    process.env.CHROMIUM_BIN = envPath;
    return;
  }
  // On serverless, puppeteer has no cached binary, use @sparticuz/chromium
  if (process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.NETLIFY) {
    process.env.CHROMIUM_BIN = await chromium.executablePath();
    // Avoid conflict with @sparticuz/chromium's extraction path at /tmp/chromium
    if (!process.env.CHROMIUM_DATA_DIR) {
      process.env.CHROMIUM_DATA_DIR = '/tmp/chromium-data';
    }
  }
};

const techStackHandler = async (url) => {
  await ensureChromiumBin();
  const { default: Wappalyzer } = await import('wappalyzer');
  const wappalyzer = new Wappalyzer({});

  try {
    await wappalyzer.init();
    const site = await wappalyzer.open(url, {}, { local: {}, session: {} });
    const results = await site.analyze();
    if (!results.technologies || results.technologies.length === 0) {
      throw new Error('Unable to find any technologies for site');
    }
    return results;
  } catch (error) {
    if (/ENOENT|Browser was not found|Could not find Chromium/i.test(error.message)) {
      return { skipped: error.message };
    }
    throw new Error(error.message);
  } finally {
    await wappalyzer.destroy();
  }
};

export const handler = middleware(techStackHandler);
export default handler;
