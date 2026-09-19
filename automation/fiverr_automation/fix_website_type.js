const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const page = (await browser.pages())[0];

  console.log('Clicking Website Type tab with mouse click...');
  const tabs = await page.$$('.metadata-names-list li');
  console.log('Tabs count:', tabs.length);

  // Tab 0
  const box = await tabs[0].boundingBox();
  console.log('Tab 0 box:', box);
  if (box) {
    await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
    await new Promise(r => setTimeout(r, 800));
  }

  // Inspect options now in right pane
  const opts = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.metadata-options label, .metadata-container label, label')).map(l => l.innerText.trim()).filter(Boolean);
  });
  console.log('Options visible after click:\n', opts.slice(0, 25));

  // Check Portal, Business, E-Commerce store
  const clickedTypes = await page.evaluate(() => {
    const labels = Array.from(document.querySelectorAll('.metadata-options label'));
    const clicked = [];
    ['Portal', 'Business', 'E-Commerce store', 'Landing page'].forEach(name => {
      const match = labels.find(l => l.innerText.trim().toLowerCase() === name.toLowerCase());
      if (match) {
        const inp = match.querySelector('input') || match;
        inp.click();
        clicked.push(name);
      }
    });
    return clicked;
  });
  console.log('Clicked website types:', clickedTypes);

  await new Promise(r => setTimeout(r, 1000));
  const shot = path.join(__dirname, 'gig3_all_meta_green.png');
  await page.screenshot({ path: shot, fullPage: true });
  console.log('Saved shot to:', shot);

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

  const afterShot = path.join(__dirname, 'gig3_step2_pricing.png');
  await page.screenshot({ path: afterShot, fullPage: true });
  console.log('Saved after-save shot to:', afterShot);

  await browser.disconnect();
}

main().catch(console.error);
