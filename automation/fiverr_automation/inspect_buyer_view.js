const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const page = (await browser.pages())[0];

  // Click Preview button
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button, a'));
    const btn = btns.find(b => b.innerText && b.innerText.trim().toLowerCase() === 'preview');
    if (btn) btn.click();
  });

  await new Promise(r => setTimeout(r, 4000));
  console.log('Current URL in preview:', page.url());

  const shot = path.join(__dirname, 'buyer_preview_profile.png');
  await page.screenshot({ path: shot, fullPage: true });
  console.log('Saved buyer preview shot to:', shot);

  await browser.disconnect();
}

main().catch(console.error);
