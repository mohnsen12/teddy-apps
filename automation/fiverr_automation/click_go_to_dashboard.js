const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const page = (await browser.pages()).find(p => p.url().includes('fiverr.com'));

  console.log('Clicking Go to dashboard...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.innerText.toLowerCase().includes('go to dashboard'));
    if (btn) btn.click();
  });

  await new Promise(r => setTimeout(r, 4000));
  console.log('Current URL:', page.url());

  const shotPath = path.join(__dirname, 'dashboard_after_gig1.png');
  await page.screenshot({ path: shotPath, fullPage: true });
  console.log('Dashboard screenshot saved to:', shotPath);

  await browser.disconnect();
}

main().catch(console.error);
