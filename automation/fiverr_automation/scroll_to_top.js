const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('seller_onboarding') || p.url().includes('fiverr.com')) || pages[0];

  // Scroll all scrollable elements to top
  await page.evaluate(() => {
    const all = Array.from(document.querySelectorAll('*'));
    for (const el of all) {
      if (el.scrollHeight > el.clientHeight && el.clientHeight > 0) {
        el.scrollTop = 0;
      }
    }
    window.scrollTo(0, 0);
  });
  await new Promise(r => setTimeout(r, 1000));

  const screenshotPath = path.join(__dirname, 'real_top.png');
  await page.screenshot({ path: screenshotPath });
  console.log('Real top screenshot saved to:', screenshotPath);

  await browser.disconnect();
}

main().catch(console.error);
