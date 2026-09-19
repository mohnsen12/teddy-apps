const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const page = (await browser.pages())[0];

  const shot = path.join(__dirname, 'current_work_form.png');
  await page.screenshot({ path: shot, fullPage: true });
  console.log('Saved to:', shot);

  await browser.disconnect();
}

main().catch(console.error);
