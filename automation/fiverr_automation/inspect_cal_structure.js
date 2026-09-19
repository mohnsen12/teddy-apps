const puppeteer = require('puppeteer-core');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const page = (await browser.pages())[0];

  const btns = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('button')).map(b => ({
      ariaLabel: b.getAttribute('aria-label'),
      text: b.innerText.trim()
    })).filter(b => b.ariaLabel || b.text.includes('202'));
  });
  console.log('Buttons:', btns);

  await browser.disconnect();
}

main().catch(console.error);
