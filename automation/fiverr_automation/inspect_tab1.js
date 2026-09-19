const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const pages = await browser.pages();
  const page1 = pages[1] || pages[0];

  console.log('Tab 1 title:', await page1.title());
  console.log('Tab 1 url:', page1.url());

  const shot = path.join(__dirname, 'tab1_screen.png');
  await page1.screenshot({ path: shot, fullPage: true });
  console.log('Saved Tab 1 screenshot to:', shot);

  const text = await page1.evaluate(() => document.body.innerText);
  console.log('Tab 1 text preview:\n', text.slice(0, 1500));

  await browser.disconnect();
}

main().catch(console.error);
