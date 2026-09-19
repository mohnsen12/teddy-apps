const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('seller_onboarding') || p.url().includes('fiverr.com')) || pages[0];

  const nameInput = await page.$('input[placeholder*="display name" i]');
  if (nameInput) {
    await nameInput.click();
    // Move cursor to end, then backspace 30 times
    for (let i = 0; i < 30; i++) {
      await page.keyboard.press('ArrowRight');
    }
    for (let i = 0; i < 30; i++) {
      await page.keyboard.press('Backspace');
    }
    await new Promise(r => setTimeout(r, 200));
    await nameInput.type('Claus M.', { delay: 60 });
    console.log('Typed Claus M.');
  }

  await new Promise(r => setTimeout(r, 1000));

  const val = await page.evaluate(() => {
    return document.querySelector('input[placeholder*="display name" i]')?.value;
  });
  console.log('Name input value after backspaces:', val);

  const screenshotPath = path.join(__dirname, 'cleared_name.png');
  await page.screenshot({ path: screenshotPath });
  console.log('Screenshot saved to:', screenshotPath);

  await browser.disconnect();
}

main().catch(console.error);
