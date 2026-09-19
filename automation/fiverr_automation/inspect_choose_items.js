const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('manage_gigs') || p.url().includes('fiverr.com')) || pages[0];

  // Click the Choose ... dropdown
  console.log('Clicking Choose ...');
  await page.evaluate(() => {
    const choose = document.querySelector('.c3f47d7');
    if (choose) choose.click();
  });
  await new Promise(r => setTimeout(r, 800));

  // Find all visible list items or options in the DOM
  const menuItems = await page.evaluate(() => {
    const all = Array.from(document.querySelectorAll('*'));
    return all.filter(el => {
      return el.children.length === 0 && el.offsetParent !== null && el.innerText.trim().length > 0 && el.innerText.trim().length < 40;
    }).map(el => ({ text: el.innerText.trim(), tag: el.tagName, class: el.className }));
  });

  console.log('Menu items found after clicking Choose ...:');
  const relevant = menuItems.filter(m => !['English', 'Overview', 'Pricing', 'Description & FAQ', 'Requirements', 'Gallery', 'Publish'].includes(m.text));
  console.log(JSON.stringify(relevant.slice(0, 30), null, 2));

  const screenshotPath = path.join(__dirname, 'choose_menu.png');
  await page.screenshot({ path: screenshotPath });
  console.log('Screenshot saved to:', screenshotPath);

  await browser.disconnect();
}

main().catch(console.error);
