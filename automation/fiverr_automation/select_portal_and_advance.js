const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const page = (await browser.pages())[0];

  console.log('Clicking PORTAL...');
  const clicked = await page.evaluate(() => {
    const all = Array.from(document.querySelectorAll('*'));
    // Find leaf element matching PORTAL
    const portal = all.find(e => e.children.length === 0 && e.offsetParent !== null && e.innerText.trim().toUpperCase() === 'PORTAL');
    if (portal) {
      portal.click();
      return true;
    }
    return false;
  });
  console.log('Clicked PORTAL:', clicked);

  await new Promise(r => setTimeout(r, 1000));

  const shot = path.join(__dirname, 'gig3_portal_selected.png');
  await page.screenshot({ path: shot, fullPage: true });
  console.log('Saved shot to:', shot);

  // Check tab status
  const statuses = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.metadata-names-list li')).map(li => li.innerText.replace(/\s+/g, ' ').trim());
  });
  console.log('Metadata tab statuses:', statuses);

  // Click Save & Continue
  console.log('Clicking Save & Continue...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.innerText.toLowerCase().includes('save & continue') || b.innerText.toLowerCase().includes('save and continue'));
    if (btn) {
      btn.scrollIntoView();
      btn.click();
    }
  });

  await new Promise(r => setTimeout(r, 4000));
  console.log('URL after save:', page.url());

  const afterShot = path.join(__dirname, 'gig3_pricing_reached_success.png');
  await page.screenshot({ path: afterShot, fullPage: true });
  console.log('Saved after shot to:', afterShot);

  await browser.disconnect();
}

main().catch(console.error);
