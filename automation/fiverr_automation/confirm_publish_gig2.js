const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const page = (await browser.pages())[0];

  console.log('Clicking final Publish Gig button...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button, a'));
    const btn = btns.find(b => b.innerText && b.innerText.trim().toLowerCase() === 'publish gig');
    if (btn) btn.click();
  });

  await new Promise(r => setTimeout(r, 4000));
  console.log('Current URL:', page.url());

  const shot = path.join(__dirname, 'gig2_published_screen.png');
  await page.screenshot({ path: shot, fullPage: true });
  console.log('Saved screenshot to:', shot);

  const text = await page.evaluate(() => document.body.innerText);
  console.log('Text snippet:\n', text.slice(0, 1500));

  await browser.disconnect();
}

main().catch(console.error);
