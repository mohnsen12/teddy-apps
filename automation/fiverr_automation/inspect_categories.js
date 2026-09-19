const puppeteer = require('puppeteer-core');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const page = (await browser.pages()).find(p => p.url().includes('portfolio'));

  const input = await page.$('input[placeholder*="Select a category"]');
  if (input) {
    await input.focus();
    await input.type('Software');
    await new Promise(r => setTimeout(r, 600));

    const options = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('li, [role="option"], label, div[class*="option"]')).map(e => e.innerText.trim()).filter(Boolean);
    });
    console.log('Category suggestions:', options);
  } else {
    console.log('No direct input, checking click...');
    await page.evaluate(() => {
      const el = Array.from(document.querySelectorAll('*')).find(e => e.innerText && e.innerText.trim() === 'Select a category from the list.');
      if (el) (el.parentElement || el).click();
    });
    await new Promise(r => setTimeout(r, 600));
    const options = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('li, [role="option"], label')).map(e => e.innerText.trim()).filter(Boolean);
    });
    console.log('Category options:', options.slice(0, 30));
  }

  await browser.disconnect();
}

main().catch(console.error);
