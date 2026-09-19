const puppeteer = require('puppeteer-core');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const page = (await browser.pages())[0];
  await page.goto('https://www.fiverr.com/users/teddybot82/manage_gigs', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 2000));

  // Click DRAFT tab
  await page.evaluate(() => {
    const tabs = Array.from(document.querySelectorAll('a, button, li'));
    const draftTab = tabs.find(t => t.innerText && t.innerText.toLowerCase().includes('draft'));
    if (draftTab) draftTab.click();
  });
  await new Promise(r => setTimeout(r, 1500));

  // Click the dropdown arrow on the first gig
  const arrows = await page.$$('table tr td:last-child, [class*="action"], td svg');
  console.log('Found arrow/action elements:', arrows.length);

  await page.evaluate(() => {
    const selectOrArrow = document.querySelector('table tr td:last-child button, table tr td:last-child div, table tr td:last-child');
    if (selectOrArrow) selectOrArrow.click();
  });
  await new Promise(r => setTimeout(r, 1000));

  const menuItems = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('ul.dropdown-menu li, .popover li, [role="menuitem"], [class*="action"] li, [class*="dropdown"] a')).map(el => el.innerText.trim());
  });
  console.log('Action menu items:', menuItems);

  await browser.disconnect();
}

main().catch(console.error);
