const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('seller_onboarding') || p.url().includes('fiverr.com')) || pages[0];

  // 1. Display Name
  const nameInput = await page.$('input[placeholder*="display name" i]');
  if (nameInput) {
    await nameInput.click();
    await page.keyboard.down('Meta');
    await page.keyboard.press('a');
    await page.keyboard.up('Meta');
    await page.keyboard.press('Backspace');
    await new Promise(r => setTimeout(r, 200));
    await page.keyboard.type('Claus M.', { delay: 50 });
    console.log('Typed Claus M. into name input');
  }

  // 2. Title
  const titleInput = await page.$('input[placeholder*="title" i]');
  if (titleInput) {
    await titleInput.click();
    await page.keyboard.down('Meta');
    await page.keyboard.press('a');
    await page.keyboard.up('Meta');
    await page.keyboard.press('Backspace');
    await new Promise(r => setTimeout(r, 200));
    await page.keyboard.type('Business Central Specialist', { delay: 50 });
    console.log('Typed Business Central Specialist into title input');
  }

  await new Promise(r => setTimeout(r, 1000));

  // Check the values of both inputs
  const values = await page.evaluate(() => {
    return {
      name: document.querySelector('input[placeholder*="display name" i]')?.value,
      title: document.querySelector('input[placeholder*="title" i]')?.value
    };
  });
  console.log('Values now in inputs:', values);

  const screenshotPath = path.join(__dirname, 'name_updated.png');
  await page.screenshot({ path: screenshotPath });
  console.log('Screenshot saved to:', screenshotPath);

  await browser.disconnect();
}

main().catch(console.error);
