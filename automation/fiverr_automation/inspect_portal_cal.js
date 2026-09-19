const puppeteer = require('puppeteer-core');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const page = (await browser.pages())[0];

  await page.evaluate(() => {
    const inp = document.querySelector('input[placeholder="Start date"]');
    if (inp) inp.click();
  });
  await new Promise(r => setTimeout(r, 600));

  const portalInfo = await page.evaluate(() => {
    const all = Array.from(document.querySelectorAll('body > div'));
    const calLayer = all.find(d => d.innerText && d.innerText.includes('September 2026') && d.innerText.includes('Mo'));
    if (!calLayer) return 'Not found in direct body children';
    return {
      className: calLayer.className,
      htmlLength: calLayer.innerHTML.length,
      buttons: Array.from(calLayer.querySelectorAll('button')).map(b => b.innerText.trim() || b.getAttribute('aria-label'))
    };
  });
  console.log('Portal info:', portalInfo);

  await browser.disconnect();
}

main().catch(console.error);
