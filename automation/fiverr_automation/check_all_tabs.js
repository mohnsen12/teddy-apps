const puppeteer = require('puppeteer-core');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const pages = await browser.pages();
  for (let i = 0; i < pages.length; i++) {
    const title = await pages[i].title();
    const url = pages[i].url();
    console.log(`Tab ${i}: "${title}" -> ${url}`);
  }
  await browser.disconnect();
}

main().catch(console.error);
