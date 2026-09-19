const puppeteer = require('puppeteer-core');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const page = (await browser.pages())[0];

  const clickedTag = await page.evaluate(() => {
    const all = Array.from(document.querySelectorAll('*'));
    const el = all.find(e => e.innerText && e.innerText.trim() === 'September 2026' && e.children.length === 0);
    if (el) {
      el.click();
      return el.tagName;
    }
    return 'Not found';
  });
  console.log('Clicked element tag:', clickedTag);

  await new Promise(r => setTimeout(r, 600));

  const text = await page.evaluate(() => {
    const all = Array.from(document.querySelectorAll('*'));
    const cal = all.find(e => e.children.length > 5 && (e.innerText.includes('2026') || e.innerText.includes('2025')));
    return cal ? cal.innerText : 'None';
  });
  console.log('Calendar text after click:\n', text);

  await browser.disconnect();
}

main().catch(console.error);
