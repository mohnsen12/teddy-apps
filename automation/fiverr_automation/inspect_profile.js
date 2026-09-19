const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const page = (await browser.pages())[0];

  const profileUrl = 'https://www.fiverr.com/teddybot82';
  console.log('Navigating to public profile:', profileUrl);
  await page.goto(profileUrl, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 4000));

  const shot = path.join(__dirname, 'public_profile_screen.png');
  await page.screenshot({ path: shot, fullPage: true });
  console.log('Saved public profile shot to:', shot);

  const title = await page.title();
  console.log('Page Title:', title);

  await browser.disconnect();
}

main().catch(console.error);
