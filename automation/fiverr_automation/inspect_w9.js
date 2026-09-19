const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const page = (await browser.pages())[0];

  console.log('Clicking Complete W-9 button...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button, a'));
    const btn = btns.find(b => b.innerText && b.innerText.toLowerCase().includes('complete w-9'));
    if (btn) btn.click();
  });

  await new Promise(r => setTimeout(r, 3000));
  console.log('Current URL after clicking W-9:', page.url());

  const shot = path.join(__dirname, 'w9_screen.png');
  await page.screenshot({ path: shot, fullPage: true });
  console.log('Saved W-9 screenshot to:', shot);

  const text = await page.evaluate(() => document.body.innerText);
  console.log('Text snippet:\n', text.slice(0, 1500));

  await browser.disconnect();
}

main().catch(console.error);
