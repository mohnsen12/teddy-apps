const puppeteer = require('puppeteer-core');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const page = (await browser.pages())[0];
  const inputVal = await page.evaluate(() => {
    const inp = document.querySelector('input[type="tel"], input');
    return inp ? inp.value : 'No input found';
  });
  console.log('Phone input value:', inputVal);
  await browser.disconnect();
}

main().catch(console.error);
