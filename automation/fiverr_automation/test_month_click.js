const puppeteer = require('puppeteer-core');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const page = (await browser.pages())[0];

  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.innerText && b.innerText.includes('September 2026'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 600));

  const items = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('button, div[role="button"]')).map(b => b.innerText.trim()).filter(t => t.length > 0 && t.length < 20);
  });
  console.log('Items after clicking month:', items.slice(0, 30));

  await browser.disconnect();
}

main().catch(console.error);
