const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('manage_gigs') || p.url().includes('fiverr.com')) || pages[0];

  console.log('Clicking Create Packages button...');
  const clicked = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button, a'));
    const btn = btns.find(b => b.innerText && b.innerText.trim().toLowerCase() === 'create packages');
    if (btn) {
      btn.click();
      return true;
    }
    return false;
  });
  console.log('Create Packages clicked:', clicked);

  await new Promise(r => setTimeout(r, 1500));

  const screenshotPath = path.join(__dirname, 'packages_unlocked.png');
  await page.screenshot({ path: screenshotPath, fullPage: true });
  console.log('Screenshot saved to:', screenshotPath);

  await browser.disconnect();
}

main().catch(console.error);
