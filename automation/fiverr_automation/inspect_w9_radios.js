const puppeteer = require('puppeteer-core');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const page = (await browser.pages())[0];

  const radios = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('input[type="radio"], label')).map(el => ({
      tag: el.tagName,
      text: el.innerText ? el.innerText.trim() : '',
      value: el.value || null,
      checked: el.checked || null,
      className: el.className
    }));
  });
  console.log('Radios/labels:', JSON.stringify(radios, null, 2));

  await browser.disconnect();
}

main().catch(console.error);
