const puppeteer = require('puppeteer-core');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const page = (await browser.pages())[0];

  const calElements = await page.evaluate(() => {
    const all = Array.from(document.querySelectorAll('*'));
    const monthEl = all.find(e => e.children.length === 0 && e.innerText && e.innerText.includes('September 2026'));
    if (!monthEl) return 'Not found';
    const container = monthEl.closest('div[class*="calendar"], div[class*="popover"], div[class*="dropdown"]') || monthEl.parentElement.parentElement;
    const clickables = Array.from(container.querySelectorAll('button, svg, a, div[role="button"], span')).map(c => ({
      tag: c.tagName,
      role: c.getAttribute('role'),
      text: c.innerText ? c.innerText.trim() : '',
      ariaLabel: c.getAttribute('aria-label') || '',
      className: c.className
    })).filter(c => c.text || c.ariaLabel || c.tag === 'svg');
    return clickables;
  });
  console.log('Clickables in calendar:', calElements);

  await browser.disconnect();
}

main().catch(console.error);
