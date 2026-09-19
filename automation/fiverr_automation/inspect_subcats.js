const puppeteer = require('puppeteer-core');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const page = (await browser.pages()).find(p => p.url().includes('manage_gigs') || p.url().includes('fiverr.com'));

  const subControls = await page.$$('.category-selector__control');
  if (subControls.length > 1) {
    await subControls[1].click();
    await new Promise(r => setTimeout(r, 600));

    const opts = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('[class*="option"]')).map(o => o.innerText.trim());
    });
    console.log('Subcategories:', opts);
  }

  await browser.disconnect();
}

main().catch(console.error);
