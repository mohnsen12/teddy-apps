const puppeteer = require('puppeteer-core');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const page = (await browser.pages())[0];

  const info = await page.evaluate(() => {
    const all = Array.from(document.querySelectorAll('*'));
    const monthEl = all.find(e => e.children.length === 0 && e.innerText && e.innerText.includes('September 2026'));
    if (!monthEl) return 'Month element not found';
    let p = monthEl;
    for (let i = 0; i < 4; i++) {
      if (p.parentElement) p = p.parentElement;
    }
    return {
      tag: p.tagName,
      className: p.className,
      html: p.outerHTML
    };
  });
  console.log('Calendar container:', info);

  await browser.disconnect();
}

main().catch(console.error);
