const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const page = (await browser.pages())[0];

  const tabInfo = await page.evaluate(() => {
    const tabs = Array.from(document.querySelectorAll('a, li, button')).filter(el => el.innerText && el.innerText.includes('DRAFT'));
    return tabs.map(t => ({ tag: t.tagName, text: t.innerText, href: t.href || null, className: t.className }));
  });
  console.log('Draft tab elements:', tabInfo);

  // Click the element that contains DRAFT
  await page.evaluate(() => {
    const el = Array.from(document.querySelectorAll('a, li, button')).find(t => t.innerText && t.innerText.trim().startsWith('DRAFT'));
    if (el) el.click();
  });

  await new Promise(r => setTimeout(r, 2000));

  const shot = path.join(__dirname, 'drafts_tab_clicked.png');
  await page.screenshot({ path: shot, fullPage: true });
  console.log('Saved screenshot to:', shot);

  const gigLinks = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('table tbody tr a, .gig-title a')).map(a => ({ text: a.innerText.trim(), href: a.href }));
  });
  console.log('Gigs visible in table:', gigLinks);

  await browser.disconnect();
}

main().catch(console.error);
