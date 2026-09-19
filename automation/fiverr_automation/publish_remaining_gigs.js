const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const page = (await browser.pages())[0];

  // Click Done
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button, a'));
    const doneBtn = btns.find(b => b.innerText && b.innerText.trim().toLowerCase() === 'done');
    if (doneBtn) doneBtn.click();
  });

  await new Promise(r => setTimeout(r, 3000));
  console.log('After clicking Done, URL is:', page.url());

  // Go to manage gigs
  await page.goto('https://www.fiverr.com/users/teddybot82/manage_gigs', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 3000));

  const shot = path.join(__dirname, 'manage_gigs_after_first_published.png');
  await page.screenshot({ path: shot, fullPage: true });
  console.log('Saved manage gigs shot to:', shot);

  const text = await page.evaluate(() => document.body.innerText);
  console.log('Manage gigs text preview:\n', text.slice(0, 1000));

  await browser.disconnect();
}

main().catch(console.error);
