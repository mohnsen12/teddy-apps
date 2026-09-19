const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const page = (await browser.pages())[0];

  console.log('Finding PORTAL in dropdown on:', page.url());

  // Check if popup is open or if we need to open it
  const isOpen = await page.evaluate(() => {
    const items = Array.from(document.querySelectorAll('li, button, div')).filter(e => e.innerText && e.innerText.trim().toUpperCase() === 'PORTAL');
    return items.length > 0;
  });
  console.log('Is portal element in DOM:', isOpen);

  if (!isOpen) {
    console.log('Opening dropdown...');
    const c3 = await page.$('.c3f47d7');
    if (c3) {
      const box = await c3.boundingBox();
      await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
      await new Promise(r => setTimeout(r, 600));
    }
  }

  // Find PORTAL, scroll into view, and click
  const clicked = await page.evaluate(() => {
    const all = Array.from(document.querySelectorAll('*'));
    const portal = all.find(e => e.innerText && e.innerText.trim().toUpperCase() === 'PORTAL' && e.children.length === 0);
    if (portal) {
      portal.scrollIntoView({ block: 'nearest' });
      portal.click();
      return { success: true, text: portal.innerText.trim() };
    }
    return { success: false };
  });
  console.log('Click result:', clicked);

  await new Promise(r => setTimeout(r, 1000));
  const shot = path.join(__dirname, 'portal_clicked.png');
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

  const afterShot = path.join(__dirname, 'gig3_pricing_tab_reached.png');
  await page.screenshot({ path: afterShot, fullPage: true });
  console.log('Saved after shot to:', afterShot);

  await browser.disconnect();
}

main().catch(console.error);
