const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('fiverr.com')) || pages[0];

  // Click "Get started" button
  const clicked = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button, a'));
    const btn = buttons.find(b => b.innerText.trim().toLowerCase() === 'get started');
    if (btn) {
      btn.click();
      return true;
    }
    return false;
  });

  console.log('Clicked Get started:', clicked);
  await new Promise(r => setTimeout(r, 3000));

  console.log('Current URL:', page.url());
  console.log('Page Title:', await page.title());

  const screenshotPath = path.join(__dirname, 'current_screen.png');
  await page.screenshot({ path: screenshotPath });
  console.log('Screenshot saved to:', screenshotPath);

  await browser.disconnect();
}

main().catch(console.error);
