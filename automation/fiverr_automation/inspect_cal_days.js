const puppeteer = require('puppeteer-core');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const page = (await browser.pages())[0];

  await page.evaluate(() => {
    const inp = document.querySelector('input[placeholder="Start date"]');
    if (inp) inp.click();
  });
  await new Promise(r => setTimeout(r, 600));

  const dayElements = await page.evaluate(() => {
    const prev = document.querySelector('button[aria-label="Previous month"]');
    if (!prev) return 'No calendar open';
    const container = prev.closest('div[class*="content"], div[class*="picker"], div[class*="popover"]') || prev.parentElement.parentElement;
    const allSpansOrBtns = Array.from(container.querySelectorAll('button, div, span')).filter(el => {
      const num = parseInt(el.innerText && el.innerText.trim());
      return num >= 1 && num <= 31 && el.children.length === 0;
    });
    return allSpansOrBtns.map(el => ({ tag: el.tagName, text: el.innerText.trim(), className: el.className }));
  });
  console.log('Days found in calendar:', dayElements.slice(0, 15));

  await browser.disconnect();
}

main().catch(console.error);
