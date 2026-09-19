const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('manage_gigs') || p.url().includes('fiverr.com')) || pages[0];

  // 1. Click the radio button in meta-suggest-other
  console.log('Clicking Other radio button in metadata...');
  const radioClicked = await page.evaluate(() => {
    const radio = document.querySelector('.meta-suggest-other input[type="radio"]');
    if (radio) {
      radio.click();
      return true;
    }
    return false;
  });
  console.log('Radio clicked:', radioClicked);
  await new Promise(r => setTimeout(r, 1000));

  // 2. Check if checkmark appeared on Platforms
  const platformStatus = await page.evaluate(() => {
    const li = document.querySelector('.metadata-names-list li');
    return {
      className: li?.className,
      hasCheck: !!li?.querySelector('.icn-green-check.visible')
    };
  });
  console.log('Platform status after clicking Other:', platformStatus);

  // 3. Click Save & Continue!
  console.log('Clicking Save & Continue...');
  const saved = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.innerText.trim().toLowerCase().includes('save & continue'));
    if (btn) {
      btn.scrollIntoView();
      btn.click();
      return true;
    }
    return false;
  });
  console.log('Saved:', saved);

  await new Promise(r => setTimeout(r, 4000));
  console.log('Current URL:', page.url());

  const screenshotPath = path.join(__dirname, 'step1_finished.png');
  await page.screenshot({ path: screenshotPath });
  console.log('Screenshot saved to:', screenshotPath);

  await browser.disconnect();
}

main().catch(console.error);
