const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('manage_gigs') || p.url().includes('fiverr.com')) || pages[0];

  console.log('Connected to page:', page.url());

  // Click the CHOOSE ... dropdown
  await page.evaluate(() => {
    const el = Array.from(document.querySelectorAll('*')).find(e => e.innerText && e.innerText.trim().startsWith('CHOOSE') && e.children.length <= 2);
    if (el) el.click();
  });

  await new Promise(r => setTimeout(r, 1000));

  // Find all elements in dropdown/menu
  const options = await page.evaluate(() => {
    const elements = Array.from(document.querySelectorAll('li, div, span, button'));
    const visible = elements.filter(el => {
      const rect = el.getBoundingClientRect();
      const style = window.getComputedStyle(el);
      return rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none';
    });
    return visible
      .map(el => el.innerText ? el.innerText.trim() : '')
      .filter(t => t.length > 0 && t.length < 50 && !['Overview', 'Pricing', 'Description & FAQ', 'Requirements', 'Gallery', 'Publish', 'English'].includes(t))
      .filter((v, i, a) => a.indexOf(v) === i);
  });

  console.log('Detected visible text options on screen:');
  console.log(options.slice(0, 50));

  await page.screenshot({ path: path.join(__dirname, 'dropdown_clicked.png') });
  await browser.disconnect();
}

main().catch(console.error);
