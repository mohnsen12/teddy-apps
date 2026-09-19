const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const page = (await browser.pages()).find(p => p.url().includes('verification') || p.url().includes('fiverr.com'));

  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.innerText && b.innerText.toLowerCase().includes('continue'));
    if (btn) btn.click();
  });

  await new Promise(r => setTimeout(r, 2500));
  console.log('Current URL:', page.url());

  const shot = path.join(__dirname, 'phone_verif_step.png');
  await page.screenshot({ path: shot, fullPage: true });
  console.log('Screenshot saved to:', shot);

  const text = await page.evaluate(() => document.body.innerText);
  console.log('Page text snippet:\n', text.slice(0, 1500));

  await browser.disconnect();
}

main().catch(console.error);
