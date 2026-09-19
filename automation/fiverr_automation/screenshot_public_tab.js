const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const pages = await browser.pages();
  const publicPage = pages.find(p => p.url().includes('public_mode=true')) || pages[0];

  const shot = path.join(__dirname, 'public_profile_full.png');
  await publicPage.screenshot({ path: shot, fullPage: true });
  console.log('Saved public profile full screenshot to:', shot);

  await browser.disconnect();
}

main().catch(console.error);
