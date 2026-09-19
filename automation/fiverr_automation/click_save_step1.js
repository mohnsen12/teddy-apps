const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('manage_gigs') || p.url().includes('fiverr.com')) || pages[0];

  console.log('Clicking Save & Continue on Step 1...');
  const clicked = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const btn = buttons.find(b => b.innerText.toLowerCase().includes('save & continue') || b.innerText.toLowerCase().includes('save and continue'));
    if (btn) {
      btn.scrollIntoView();
      btn.click();
      return true;
    }
    return false;
  });
  console.log('Save button clicked:', clicked);

  await new Promise(r => setTimeout(r, 4000));

  console.log('Current URL after save:', page.url());
  const screenshotPath = path.join(__dirname, 'step2_reached.png');
  await page.screenshot({ path: screenshotPath });
  console.log('Screenshot saved to:', screenshotPath);

  await browser.disconnect();
}

main().catch(console.error);
