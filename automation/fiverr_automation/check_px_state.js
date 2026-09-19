const puppeteer = require('puppeteer-core');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const page = (await browser.pages())[0];
  console.log('Current URL:', page.url());
  const title = await page.title();
  console.log('Title:', title);
  const text = await page.evaluate(() => document.body.innerText);
  console.log('Is PX challenge visible:', text.includes('HOLD NEDE') || text.includes('human touch') || text.includes('Press & Hold'));
  await browser.disconnect();
}

main().catch(console.error);
