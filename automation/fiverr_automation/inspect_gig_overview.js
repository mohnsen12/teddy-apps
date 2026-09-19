const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('manage_gigs') || p.url().includes('fiverr.com')) || pages[0];

  const info = await page.evaluate(() => {
    const textareas = Array.from(document.querySelectorAll('textarea')).map(t => ({
      name: t.name,
      id: t.id,
      placeholder: t.placeholder
    }));
    const selects = Array.from(document.querySelectorAll('select')).map(s => ({
      name: s.name,
      id: s.id,
      options: Array.from(s.options).map(o => o.text).slice(0, 10)
    }));
    const inputs = Array.from(document.querySelectorAll('input')).map(i => ({
      name: i.name,
      id: i.id,
      type: i.type,
      placeholder: i.placeholder
    })).filter(i => i.type !== 'hidden');

    return { textareas, selects, inputs };
  });

  console.log('Overview fields:', JSON.stringify(info, null, 2));

  // Scroll down to see full overview page
  await page.evaluate(() => window.scrollBy(0, 500));
  await new Promise(r => setTimeout(r, 1000));

  const screenshotPath = path.join(__dirname, 'overview_scroll.png');
  await page.screenshot({ path: screenshotPath });
  console.log('Screenshot saved to:', screenshotPath);

  await browser.disconnect();
}

main().catch(console.error);
