const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('seller_onboarding') || p.url().includes('fiverr.com')) || pages[0];

  // Click "Add details" under About
  const clicked = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const btn = buttons.find(b => b.innerText.trim() === 'Add details');
    if (btn) {
      btn.click();
      return true;
    }
    return false;
  });
  console.log('Clicked "Add details":', clicked);

  await new Promise(r => setTimeout(r, 1500));

  const screenshotPath = path.join(__dirname, 'current_screen.png');
  await page.screenshot({ path: screenshotPath });
  console.log('Screenshot saved to:', screenshotPath);

  // Check what inputs/textareas opened
  const formElements = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('textarea, input, [contenteditable="true"]')).map(el => ({
      tag: el.tagName,
      name: el.name || null,
      id: el.id || null,
      placeholder: el.placeholder || null
    }));
  });
  console.log('Form elements now open:', formElements);

  await browser.disconnect();
}

main().catch(console.error);
