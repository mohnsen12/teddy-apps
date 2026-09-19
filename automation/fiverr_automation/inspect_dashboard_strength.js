const puppeteer = require('puppeteer-core');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const page = (await browser.pages())[0];

  await page.goto('https://www.fiverr.com/seller_dashboard', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 2000));

  const text = await page.evaluate(() => {
    const el = document.querySelector('[class*="profile-strength"], [class*="strength"]');
    return el ? el.innerText : 'Not found specific';
  });
  console.log('Strength section:', text);

  await browser.disconnect();
}

main().catch(console.error);
