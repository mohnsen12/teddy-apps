const puppeteer = require('puppeteer-core');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const page = (await browser.pages())[0];
  const title = await page.title();
  const url = page.url();
  console.log('Title:', title);
  console.log('URL:', url);
  await browser.disconnect();
}

main().catch(console.error);
