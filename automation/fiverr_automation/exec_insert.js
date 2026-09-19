const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('seller_onboarding') || p.url().includes('fiverr.com')) || pages[0];

  const result = await page.evaluate(() => {
    const input = document.querySelector('input[placeholder*="display name" i]');
    if (!input) return 'Input not found';
    input.focus();
    input.select();
    const deleted = document.execCommand('delete');
    const inserted = document.execCommand('insertText', false, 'Claus M.');
    return {
      deleted,
      inserted,
      finalValue: input.value
    };
  });

  console.log('ExecCommand result:', result);
  await new Promise(r => setTimeout(r, 1000));

  // Press Enter or click outside to commit
  await page.keyboard.press('Enter');
  await new Promise(r => setTimeout(r, 1000));

  const screenshotPath = path.join(__dirname, 'claus_inserted.png');
  await page.screenshot({ path: screenshotPath });
  console.log('Screenshot saved to:', screenshotPath);

  await browser.disconnect();
}

main().catch(console.error);
