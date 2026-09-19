const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('seller_onboarding') || p.url().includes('fiverr.com')) || pages[0];

  console.log('Clicking Continue button at bottom right...');
  const clicked = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const continueBtn = btns.find(b => b.innerText.trim() === 'Continue');
    if (continueBtn && !continueBtn.disabled) {
      continueBtn.scrollIntoView();
      continueBtn.click();
      return true;
    }
    return false;
  });
  console.log('Clicked Continue:', clicked);

  await new Promise(r => setTimeout(r, 4000));

  console.log('Current URL:', page.url());
  console.log('Page Title:', await page.title());

  const screenshotPath = path.join(__dirname, 'after_continue.png');
  await page.screenshot({ path: screenshotPath });
  console.log('Screenshot saved to:', screenshotPath);

  await browser.disconnect();
}

main().catch(console.error);
