const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const page = (await browser.pages())[0];
  await page.goto('https://www.fiverr.com/seller_dashboard', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 3000));

  const shot = path.join(__dirname, 'dashboard_after_w9.png');
  await page.screenshot({ path: shot, fullPage: true });
  console.log('Saved dashboard shot to:', shot);

  const text = await page.evaluate(() => document.body.innerText);
  console.log('Dashboard text:\n', text.slice(0, 1500));

  await browser.disconnect();
}

main().catch(console.error);
