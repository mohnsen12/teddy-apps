const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const page = (await browser.pages())[0];

  const url = page.url();
  const title = await page.title();
  console.log('Page URL:', url);
  console.log('Page Title:', title);

  const shot = path.join(__dirname, 'after_user_fortsaet.png');
  await page.screenshot({ path: shot, fullPage: true });
  console.log('Saved screenshot to:', shot);

  const text = await page.evaluate(() => document.body.innerText);
  console.log('Page text snippet:\n', text.slice(0, 1000));

  await browser.disconnect();
}

main().catch(console.error);
