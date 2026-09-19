const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const pages = await browser.pages();
  console.log('Open pages:');
  for (let i = 0; i < pages.length; i++) {
    console.log(`[${i}] ${await pages[i].title()} - ${pages[i].url()}`);
  }
  const page = pages.find(p => p.url().includes('fiverr.com')) || pages[0];
  const shot = path.join(__dirname, 'current_screen.png');
  await page.screenshot({ path: shot });
  console.log('Screenshot saved to:', shot);
  console.log('Current page URL:', page.url());
  await browser.disconnect();
}

main().catch(console.error);
