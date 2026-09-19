const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('manage_gigs') || p.url().includes('fiverr.com')) || pages[0];

  // 1. Inspect Service type options
  const serviceControls = await page.$$('.category-selector__control, [class*="service-type"] [class*="control"], div[class*="control"]');
  console.log('Total control elements:', serviceControls.length);

  // Click the 3rd control (Service type)
  if (serviceControls.length >= 3) {
    await serviceControls[2].click();
    await new Promise(r => setTimeout(r, 600));

    const options = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('[class*="option"]')).map(o => o.innerText.trim());
    });
    console.log('Service type options:', options);

    // Pick "Customization" or "Full Project" or "Bug Fixes"
    const picked = await page.evaluate(() => {
      const opts = Array.from(document.querySelectorAll('[class*="option"]'));
      const choice = opts.find(o => o.innerText.toLowerCase().includes('customization')) ||
                     opts.find(o => o.innerText.toLowerCase().includes('development')) ||
                     opts[0];
      if (choice) {
        choice.click();
        return choice.innerText.trim();
      }
      return null;
    });
    console.log('Picked Service Type:', picked);
    await new Promise(r => setTimeout(r, 1000));
  }

  // Scroll down to see Gig metadata and search tags
  await page.evaluate(() => window.scrollBy(0, 500));
  await new Promise(r => setTimeout(r, 1000));

  const screenshotPath = path.join(__dirname, 'service_type_picked.png');
  await page.screenshot({ path: screenshotPath });
  console.log('Screenshot saved to:', screenshotPath);

  await browser.disconnect();
}

main().catch(console.error);
