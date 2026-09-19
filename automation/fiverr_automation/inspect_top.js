const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('seller_onboarding') || p.url().includes('fiverr.com')) || pages[0];

  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise(r => setTimeout(r, 1000));

  const screenshotPath = path.join(__dirname, 'top_screen.png');
  await page.screenshot({ path: screenshotPath });
  console.log('Top screenshot saved to:', screenshotPath);

  // Inspect the exact elements at the top
  const topInfo = await page.evaluate(() => {
    const inputs = Array.from(document.querySelectorAll('input')).map(i => ({
      tag: i.tagName,
      placeholder: i.placeholder,
      value: i.value,
      visible: i.offsetParent !== null,
      rect: i.getBoundingClientRect()
    }));
    return inputs;
  });
  console.log('Top inputs:', JSON.stringify(topInfo, null, 2));

  await browser.disconnect();
}

main().catch(console.error);
