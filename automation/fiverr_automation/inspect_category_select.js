const puppeteer = require('puppeteer-core');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('manage_gigs') || p.url().includes('fiverr.com')) || pages[0];

  const categoryInspect = await page.evaluate(() => {
    const selects = Array.from(document.querySelectorAll('[class*="select"]'));
    return selects.map(s => ({
      tag: s.tagName,
      className: s.className,
      id: s.id,
      text: s.innerText ? s.innerText.slice(0, 100) : '',
      inputs: Array.from(s.querySelectorAll('input')).map(i => ({ id: i.id, name: i.name }))
    })).filter(s => s.text.includes('CATEGORY') || s.text.includes('SUBCATEGORY'));
  });

  console.log('Category inspect:', JSON.stringify(categoryInspect, null, 2));
  await browser.disconnect();
}

main().catch(console.error);
