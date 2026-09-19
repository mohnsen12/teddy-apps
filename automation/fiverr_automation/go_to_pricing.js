const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('manage_gigs') || p.url().includes('fiverr.com')) || pages[0];

  console.log('Current URL:', page.url());

  // Check bottom of page or errors
  const errors = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.error, .invalid, [class*="error"]'))
      .map(e => e.innerText)
      .filter(Boolean);
  });
  console.log('Errors on page:', errors);

  // Try clicking Save & Continue at bottom
  const saveBtn = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const b = btns.find(btn => btn.innerText.toLowerCase().includes('save & continue') || btn.innerText.toLowerCase().includes('save and continue'));
    if (b) {
      b.scrollIntoView();
      b.click();
      return true;
    }
    return false;
  });
  console.log('Clicked Save & Continue:', saveBtn);

  await new Promise(r => setTimeout(r, 3000));
  console.log('URL after clicking:', page.url());

  // If still tab=general, try clicking Pricing breadcrumb
  if (page.url().includes('tab=general')) {
    console.log('Still on tab=general, clicking Pricing in nav...');
    await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('a, span, div'));
      const pricingNav = links.find(el => el.innerText && el.innerText.trim().endsWith('Pricing'));
      if (pricingNav) pricingNav.click();
    });
    await new Promise(r => setTimeout(r, 3000));
    console.log('URL after Pricing nav click:', page.url());
  }

  const screenshotPath = path.join(__dirname, 'after_go_to_pricing.png');
  await page.screenshot({ path: screenshotPath });
  console.log('Screenshot saved to:', screenshotPath);

  await browser.disconnect();
}

main().catch(console.error);
