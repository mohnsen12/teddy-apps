const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const page = (await browser.pages())[0];

  await page.goto('https://www.fiverr.com/users/teddybot82/manage_gigs', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 2500));

  // Click Draft tab
  console.log('Clicking DRAFT tab...');
  await page.evaluate(() => {
    const tabs = Array.from(document.querySelectorAll('a, button, li'));
    const draftTab = tabs.find(t => t.innerText && t.innerText.toLowerCase().includes('draft'));
    if (draftTab) draftTab.click();
  });
  await new Promise(r => setTimeout(r, 2000));

  // Find remaining draft gigs
  const draftLinks = await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('a'));
    return links.filter(a => a.href && a.href.includes('/manage_gigs/') && a.href.includes('/edit')).map(a => ({
      text: a.innerText.trim(),
      href: a.href
    }));
  });
  console.log('Draft links found:', draftLinks);

  // Take screenshot
  const shot = path.join(__dirname, 'drafts_remaining.png');
  await page.screenshot({ path: shot, fullPage: true });
  console.log('Saved screenshot to:', shot);

  await browser.disconnect();
}

main().catch(console.error);
