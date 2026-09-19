const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const page = (await browser.pages()).find(p => p.url().includes('manage_gigs') || p.url().includes('fiverr.com'));

  const text = await page.evaluate(() => document.body.innerText);
  console.log('Page body text snippet:\n', text.slice(0, 1500));

  const buttons = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('button, a')).map(el => ({
      tag: el.tagName,
      text: el.innerText ? el.innerText.trim().replace(/\n+/g, ' ') : '',
      href: el.href || null,
      className: el.className
    })).filter(b => b.text.length > 0 && b.text.length < 50);
  });
  console.log('Buttons/Links:', JSON.stringify(buttons, null, 2));

  const shot = path.join(__dirname, 'publish_page_full.png');
  await page.screenshot({ path: shot, fullPage: true });
  console.log('Full screenshot saved to:', shot);

  await browser.disconnect();
}

main().catch(console.error);
