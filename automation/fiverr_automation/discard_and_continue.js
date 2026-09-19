const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('seller_onboarding') || p.url().includes('fiverr.com')) || pages[0];

  // 1. Click "Discard skill"
  const discardClicked = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const btn = buttons.find(b => b.innerText && b.innerText.includes('Discard skill'));
    if (btn) {
      btn.click();
      return true;
    }
    return false;
  });
  console.log('Clicked Discard skill:', discardClicked);
  await new Promise(r => setTimeout(r, 1500));

  // 2. Click "Continue" at bottom of review page
  const continueClicked = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const btn = buttons.find(b => b.innerText && b.innerText.trim() === 'Continue');
    if (btn && !btn.disabled) {
      btn.scrollIntoView();
      btn.click();
      return true;
    }
    return false;
  });
  console.log('Clicked Continue:', continueClicked);
  await new Promise(r => setTimeout(r, 3000));

  console.log('Current URL:', page.url());
  console.log('Page Title:', await page.title());

  const screenshotPath = path.join(__dirname, 'current_screen.png');
  await page.screenshot({ path: screenshotPath });
  console.log('Screenshot saved to:', screenshotPath);

  await browser.disconnect();
}

main().catch(console.error);
