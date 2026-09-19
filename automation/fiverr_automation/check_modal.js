const puppeteer = require('puppeteer-core');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const page = (await browser.pages())[0];

  const hasHold = await page.evaluate(() => {
    return document.body.innerText.includes('Tryk og hold') || document.body.innerText.includes('Inden vi fortsætter');
  });
  console.log('Is Hold nede popup active:', hasHold);

  await browser.disconnect();
}

main().catch(console.error);
