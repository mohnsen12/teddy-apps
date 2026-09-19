const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const page = (await browser.pages())[0];

  console.log('Navigating directly to current_filter=draft...');
  await page.goto('https://www.fiverr.com/users/teddybot82/manage_gigs?current_filter=draft', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 3000));

  const shot = path.join(__dirname, 'direct_drafts.png');
  await page.screenshot({ path: shot, fullPage: true });
  console.log('Saved screenshot to:', shot);

  const text = await page.evaluate(() => document.body.innerText);
  console.log('Drafts text preview:\n', text.slice(0, 1000));

  const draftGigs = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('a')).filter(a => a.href && a.href.includes('/manage_gigs/') && a.href.includes('/edit')).map(a => ({
      text: a.innerText.trim(),
      href: a.href
    }));
  });
  console.log('Draft gigs found:', draftGigs);

  await browser.disconnect();
}

main().catch(console.error);
