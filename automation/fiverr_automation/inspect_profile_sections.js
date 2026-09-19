const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const page = (await browser.pages())[0];

  const profileEditUrl = 'https://www.fiverr.com/sellers/teddybot82/edit';
  console.log('Navigating to profile edit:', profileEditUrl);
  await page.goto(profileEditUrl, { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 3000));

  const shot = path.join(__dirname, 'profile_edit_overview.png');
  await page.screenshot({ path: shot, fullPage: true });
  console.log('Saved profile edit shot to:', shot);

  const text = await page.evaluate(() => document.body.innerText);
  console.log('Profile edit text snippet:\n', text.slice(0, 1500));

  // Find all buttons on the page
  const buttons = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('button, a')).filter(el => {
      const t = el.innerText ? el.innerText.trim() : '';
      return t.includes('Add') || t.includes('Start') || t.includes('strength') || t.includes('Edit');
    }).map(el => ({ text: el.innerText.trim(), tag: el.tagName, className: el.className }));
  });
  console.log('Action buttons:', JSON.stringify(buttons, null, 2));

  await browser.disconnect();
}

main().catch(console.error);
