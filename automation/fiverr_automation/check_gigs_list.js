const puppeteer = require('puppeteer-core');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const page = await browser.newPage();
  await page.goto('https://www.fiverr.com/users/teddybot82/manage_gigs', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 3000));

  const gigTabs = await page.evaluate(() => {
    const tabs = Array.from(document.querySelectorAll('ul.tabs li, [role="tablist"] li, a'));
    return tabs.map(t => t.innerText ? t.innerText.trim() : '').filter(t => t.includes('ACTIVE') || t.includes('DRAFT') || t.includes('PENDING') || t.includes('PAUSED'));
  });
  console.log('Gig status tabs:', gigTabs);

  // Click DRAFT tab if available
  await page.evaluate(() => {
    const tabs = Array.from(document.querySelectorAll('a, button, li'));
    const draftTab = tabs.find(t => t.innerText && t.innerText.toLowerCase().includes('draft'));
    if (draftTab) draftTab.click();
  });
  await new Promise(r => setTimeout(r, 2000));

  const draftGigs = await page.evaluate(() => {
    const rows = Array.from(document.querySelectorAll('tr, .gig-card, [class*="gig"]'));
    return Array.from(document.querySelectorAll('a')).map(a => ({ text: a.innerText.trim(), href: a.href })).filter(a => a.href.includes('/edit') || a.href.includes('manage_gigs/'));
  });
  console.log('Gigs found on manage_gigs:', draftGigs);

  const shot = require('path').join(__dirname, 'manage_gigs_screen.png');
  await page.screenshot({ path: shot, fullPage: true });
  console.log('Manage gigs screenshot saved to:', shot);

  await page.close();
  await browser.disconnect();
}

main().catch(console.error);
