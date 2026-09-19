const puppeteer = require('puppeteer-core');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const page = (await browser.pages())[0];

  await page.evaluate(() => {
    const inp = document.querySelector('input[placeholder="Start date"]');
    if (inp) inp.click();
  });
  await new Promise(r => setTimeout(r, 600));

  const result = await page.evaluate(() => {
    const all = Array.from(document.querySelectorAll('*'));
    const matches = all.filter(e => e.innerText && e.innerText.includes('September 2026') && e.innerText.includes('Mo') && e.innerText.includes('Tu'));
    const smallest = matches.sort((a, b) => a.innerText.length - b.innerText.length)[0];
    if (!smallest) return 'None';
    return {
      tagName: smallest.tagName,
      className: smallest.className,
      allText: smallest.innerText,
      allElements: Array.from(smallest.querySelectorAll('*')).map(x => ({
        tag: x.tagName,
        text: x.innerText.trim(),
        ariaLabel: x.getAttribute('aria-label'),
        role: x.getAttribute('role')
      })).filter(x => x.text || x.ariaLabel)
    };
  });
  console.log('Result tag:', result.tagName, 'Elements count:', result.allElements ? result.allElements.length : 0);
  if (result.allElements) {
    console.log('First 20 elements:', result.allElements.slice(0, 20));
  }

  await browser.disconnect();
}

main().catch(console.error);
