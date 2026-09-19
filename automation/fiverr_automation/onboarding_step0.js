const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('seller_onboarding') || p.url().includes('fiverr.com')) || pages[0];

  console.log('Current URL:', page.url());

  // Click "Complete profile manually"
  const manualClicked = await page.evaluate(() => {
    const divs = Array.from(document.querySelectorAll('div, button, span, p'));
    const target = divs.find(d => d.innerText && d.innerText.includes('Complete profile manually'));
    if (target) {
      target.click();
      return true;
    }
    return false;
  });
  console.log('Clicked "Complete profile manually":', manualClicked);

  await new Promise(r => setTimeout(r, 1000));

  // Click "Continue"
  const continueClicked = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const btn = buttons.find(b => b.innerText.trim() === 'Continue');
    if (btn) {
      btn.click();
      return true;
    }
    return false;
  });
  console.log('Clicked Continue:', continueClicked);

  await new Promise(r => setTimeout(r, 3000));
  console.log('URL after step:', page.url());

  const screenshotPath = path.join(__dirname, 'current_screen.png');
  await page.screenshot({ path: screenshotPath });
  console.log('Screenshot saved to:', screenshotPath);

  await browser.disconnect();
}

main().catch(console.error);
