const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const page = (await browser.pages())[0];

  console.log('Clicking penta dropdown in meta-single-select...');
  const trigger = await page.$('.meta-single-select .c3f47d7, .meta-single-select');
  console.log('Trigger found:', !!trigger);

  const box = await trigger.boundingBox();
  console.log('Trigger box:', box);
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
  await new Promise(r => setTimeout(r, 600));

  // Inspect visible aside buttons
  const opts = await page.evaluate(() => {
    const visibleAside = Array.from(document.querySelectorAll('aside')).find(a => window.getComputedStyle(a).display !== 'none');
    if (!visibleAside) return ['NO VISIBLE ASIDE'];
    return Array.from(visibleAside.querySelectorAll('button')).map(b => b.innerText.trim());
  });
  console.log('Visible aside options:\n', opts);

  // Click Portal or Business or E-Commerce or Custom
  const clicked = await page.evaluate(() => {
    const visibleAside = Array.from(document.querySelectorAll('aside')).find(a => window.getComputedStyle(a).display !== 'none');
    if (!visibleAside) return null;
    const btns = Array.from(visibleAside.querySelectorAll('button'));
    const target = btns.find(b => b.innerText.trim().toUpperCase() === 'PORTAL') ||
                   btns.find(b => b.innerText.trim().toUpperCase().includes('PORTAL')) ||
                   btns.find(b => b.innerText.trim().toUpperCase().includes('BUSINESS')) ||
                   btns.find(b => b.innerText.trim().toUpperCase().includes('CUSTOM')) ||
                   btns[0];
    if (target) {
      target.click();
      return target.innerText.trim();
    }
    return null;
  });
  console.log('Clicked option:', clicked);

  await new Promise(r => setTimeout(r, 1000));
  const shot = path.join(__dirname, 'website_type_picked.png');
  await page.screenshot({ path: shot, fullPage: true });
  console.log('Saved shot to:', shot);

  // Save & Continue
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

  const afterShot = path.join(__dirname, 'gig3_pricing_reached_for_real.png');
  await page.screenshot({ path: afterShot, fullPage: true });
  console.log('Saved after shot to:', afterShot);

  await browser.disconnect();
}

main().catch(console.error);
