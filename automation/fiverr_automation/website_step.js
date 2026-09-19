const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('seller_onboarding') || p.url().includes('fiverr.com')) || pages[0];

  const websiteUrl = 'https://mohnsen12.github.io/teddy-apps/';

  // Type website URL
  const input = await page.$('input[placeholder*="mypersonalwebsite" i], input[type="text"]');
  if (input) {
    await input.focus();
    await input.type(websiteUrl, { delay: 20 });
    console.log('Typed website URL:', websiteUrl);
    await new Promise(r => setTimeout(r, 600));

    // Click Add
    const addClicked = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const btn = btns.find(b => b.innerText.trim() === 'Add');
      if (btn) { btn.click(); return true; }
      return false;
    });
    console.log('Clicked Add link:', addClicked);
    await new Promise(r => setTimeout(r, 1000));
  }

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

  const screenshotPath = path.join(__dirname, 'after_website.png');
  await page.screenshot({ path: screenshotPath });
  console.log('Screenshot saved to:', screenshotPath);

  await browser.disconnect();
}

main().catch(console.error);
