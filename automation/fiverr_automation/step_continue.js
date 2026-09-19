const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('seller_onboarding') || p.url().includes('fiverr.com')) || pages[0];

  // Click Cancel if open
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const cancel = btns.find(b => b.innerText && b.innerText.trim() === 'Cancel');
    if (cancel) cancel.click();
  });
  await new Promise(r => setTimeout(r, 1000));

  // Now click "Continue" at the bottom to proceed to next onboarding step!
  const continueClicked = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const continueBtn = btns.find(b => b.innerText && b.innerText.trim() === 'Continue');
    if (continueBtn && !continueBtn.disabled) {
      continueBtn.scrollIntoView();
      continueBtn.click();
      return true;
    }
    return false;
  });
  console.log('Clicked bottom Continue:', continueClicked);

  await new Promise(r => setTimeout(r, 3000));
  console.log('Current URL:', page.url());

  const screenshotPath = path.join(__dirname, 'current_screen.png');
  await page.screenshot({ path: screenshotPath });
  console.log('Screenshot saved to:', screenshotPath);

  await browser.disconnect();
}

main().catch(console.error);
