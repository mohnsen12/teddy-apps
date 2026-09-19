const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('seller_onboarding') || p.url().includes('fiverr.com')) || pages[0];

  // Select "No - I work independently"
  const selected = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('div, button, span, p'));
    const target = cards.find(c => c.innerText && c.innerText.includes('I work independently'));
    if (target) {
      target.click();
      return true;
    }
    return false;
  });
  console.log('Selected "No - I work independently":', selected);
  await new Promise(r => setTimeout(r, 1000));

  // Click Continue
  const continueClicked = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.innerText.trim() === 'Continue');
    if (btn && !btn.disabled) {
      btn.click();
      return true;
    }
    return false;
  });
  console.log('Clicked Continue:', continueClicked);

  await new Promise(r => setTimeout(r, 4000));
  console.log('URL now:', page.url());

  const screenshotPath = path.join(__dirname, 'team_step_done.png');
  await page.screenshot({ path: screenshotPath });
  console.log('Screenshot saved to:', screenshotPath);

  await browser.disconnect();
}

main().catch(console.error);
