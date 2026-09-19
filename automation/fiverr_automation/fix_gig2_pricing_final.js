const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const page = (await browser.pages()).find(p => p.url().includes('pricing') || p.url().includes('fiverr.com'));

  console.log('Fixing delivery time for col 3, prices, and unchecking extras...');

  // 1. Uncheck "Add extra services" checkboxes
  await page.evaluate(() => {
    const extras = Array.from(document.querySelectorAll('.gig-extras input[type="checkbox"], [class*="extra-services"] input[type="checkbox"], input[type="checkbox"]'));
    // Specifically find Extra fast delivery and Additional revision
    extras.forEach(cb => {
      const parentText = cb.closest('div, li, label')?.innerText || '';
      if (parentText.includes('Extra fast') || parentText.includes('Additional revision') || parentText.includes('Include source code for an extra')) {
        if (cb.checked) cb.click();
      }
    });
  });

  // 2. Open delivery dropdown for Premium (index 2)
  const durationTriggers = await page.$$('.pkg-duration-input .select-penta-design-content');
  console.log('Duration triggers found:', durationTriggers.length);
  const premTrigger = durationTriggers[2];

  await page.evaluate(e => e.scrollIntoView({ block: 'center' }), premTrigger);
  await new Promise(r => setTimeout(r, 200));
  const box = await premTrigger.boundingBox();
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
  await new Promise(r => setTimeout(r, 600));

  // Inspect all buttons in visible aside
  const deliveryOpts = await page.evaluate(() => {
    const aside = Array.from(document.querySelectorAll('aside')).find(a => window.getComputedStyle(a).display !== 'none');
    if (!aside) return [];
    return Array.from(aside.querySelectorAll('button')).map(b => b.innerText.trim());
  });
  console.log('All delivery options in aside:\n', deliveryOpts);

  // Click 40 or 45 or 30 or whatever matches closest to 40
  const chosenDelivery = await page.evaluate(() => {
    const aside = Array.from(document.querySelectorAll('aside')).find(a => window.getComputedStyle(a).display !== 'none');
    if (!aside) return null;
    const btns = Array.from(aside.querySelectorAll('button'));
    // Look for 40, then 45, then 30, then 60
    const match = btns.find(b => b.innerText.includes('40 DAYS')) ||
                  btns.find(b => b.innerText.includes('45 DAYS')) ||
                  btns.find(b => b.innerText.includes('30 DAYS')) ||
                  btns.find(b => b.innerText.includes('60 DAYS'));
    if (match) {
      match.scrollIntoView({ block: 'nearest' });
      match.click();
      return match.innerText.trim();
    }
    return null;
  });
  console.log('Selected delivery option:', chosenDelivery);

  await new Promise(r => setTimeout(r, 600));

  // 3. Fix Prices with nativeSetter
  const prices = ['500', '2500', '5000'];
  await page.evaluate((prices) => {
    const inputs = Array.from(document.querySelectorAll('.price-input'));
    const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
    inputs.forEach((inp, i) => {
      if (prices[i]) {
        inp.focus();
        nativeSetter.call(inp, prices[i]);
        inp.dispatchEvent(new Event('input', { bubbles: true }));
        inp.dispatchEvent(new Event('change', { bubbles: true }));
        inp.blur();
      }
    });
  }, prices);

  await new Promise(r => setTimeout(r, 800));

  const checkedValues = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.price-input')).map(i => i.value);
  });
  console.log('Current price values in DOM:', checkedValues);

  const shot = path.join(__dirname, 'gig2_pricing_ready.png');
  await page.screenshot({ path: shot, fullPage: true });
  console.log('Saved pricing ready shot to:', shot);

  // 4. Save & Continue
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

  const afterShot = path.join(__dirname, 'gig2_after_pricing_done.png');
  await page.screenshot({ path: afterShot, fullPage: true });
  console.log('Saved after shot to:', afterShot);

  await browser.disconnect();
}

main().catch(console.error);
