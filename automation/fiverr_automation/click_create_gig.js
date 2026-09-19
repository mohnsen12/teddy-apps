const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('seller_onboarding') || p.url().includes('fiverr.com')) || pages[0];

  const clicked = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button, a'));
    const createBtn = buttons.find(b => b.innerText.trim() === 'Create a Gig');
    if (createBtn) {
      createBtn.scrollIntoView();
      createBtn.click();
      return true;
    }
    return false;
  });
  console.log('Clicked "Create a Gig":', clicked);

  await new Promise(r => setTimeout(r, 4000));
  console.log('URL now:', page.url());
  console.log('Page Title:', await page.title());

  const screenshotPath = path.join(__dirname, 'create_gig_screen.png');
  await page.screenshot({ path: screenshotPath });
  console.log('Screenshot saved to:', screenshotPath);

  await browser.disconnect();
}

main().catch(console.error);
