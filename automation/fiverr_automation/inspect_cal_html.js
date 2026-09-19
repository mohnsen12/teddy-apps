const puppeteer = require('puppeteer-core');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const page = (await browser.pages())[0];

  const html = await page.evaluate(() => {
    const pop = Array.from(document.querySelectorAll('*')).find(el => el.innerText && el.innerText.includes('September 2026') && el.innerText.includes('Mo'));
    return pop ? pop.outerHTML.slice(0, 1500) : 'Not found';
  });
  console.log('Calendar HTML snippet:\n', html);

  await browser.disconnect();
}

main().catch(console.error);
