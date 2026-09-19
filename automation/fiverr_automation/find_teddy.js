const puppeteer = require('puppeteer-core');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('seller_onboarding') || p.url().includes('fiverr.com')) || pages[0];

  const details = await page.evaluate(() => {
    // Find element containing "Teddy"
    const all = Array.from(document.querySelectorAll('*'));
    const teddyEl = all.find(el => el.children.length === 0 && el.innerText && el.innerText.trim() === 'Teddy');
    if (!teddyEl) return 'Teddy not found';

    let current = teddyEl;
    const hierarchy = [];
    for (let i = 0; i < 5; i++) {
      if (!current) break;
      hierarchy.push({
        tag: current.tagName,
        class: current.className,
        html: current.outerHTML.slice(0, 300)
      });
      current = current.parentElement;
    }
    return hierarchy;
  });

  console.log(JSON.stringify(details, null, 2));
  await browser.disconnect();
}

main().catch(console.error);
