const puppeteer = require('puppeteer-core');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const page = (await browser.pages())[0];

  const val = await page.evaluate(() => {
    const inp = document.querySelector('input[placeholder="Start date"]');
    if (!inp) return 'Not found';
    Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set.call(inp, '01/2019');
    inp.dispatchEvent(new Event('input', { bubbles: true }));
    inp.dispatchEvent(new Event('change', { bubbles: true }));
    return inp.value;
  });
  console.log('Value after set:', val);

  await browser.disconnect();
}

main().catch(console.error);
