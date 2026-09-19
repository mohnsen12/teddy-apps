const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('manage_gigs') || p.url().includes('fiverr.com')) || pages[0];

  // Scroll to top
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise(r => setTimeout(r, 1000));

  const screenshotPath = path.join(__dirname, 'gig1_top.png');
  await page.screenshot({ path: screenshotPath });
  console.log('Top screenshot saved to:', screenshotPath);

  const formState = await page.evaluate(() => {
    const title = document.querySelector('textarea')?.value;
    const cat = Array.from(document.querySelectorAll('[class*="single-value"], [class*="placeholder"], [class*="value-container"]')).map(el => el.innerText.trim());
    return { title, cat: cat.slice(0, 10) };
  });
  console.log('Form state:', formState);

  await browser.disconnect();
}

main().catch(console.error);
