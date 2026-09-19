const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const page = (await browser.pages()).find(p => p.url().includes('pricing') || p.url().includes('fiverr.com'));

  console.log('Fixing Gig 2 pricing on:', page.url());

  // 1. Fix Titles
  const titles = ['Single Data Stream', 'Full Webshop Sync', 'Multi-System Integration'];
  const titleInputs = await page.$$('.pkg-title-input');
  console.log('Title inputs (.pkg-title-input):', titleInputs.length);
  for (let i = 0; i < titles.length; i++) {
    await page.evaluate((el, text) => {
      el.focus();
      document.execCommand('selectAll', false, null);
      document.execCommand('insertText', false, text);
      el.dispatchEvent(new Event('change', { bubbles: true }));
    }, titleInputs[i], titles[i]);
    await new Promise(r => setTimeout(r, 200));
  }

  // 2. Fix Descriptions
  const descs = [
    'Technical mapping and one data flow (e.g., webshop orders into BC).',
    'Complete 2-way sync: items, stock, prices, orders, customers.',
    'Multi-system sync (Shopify/CRM/Bank), error alerts, logging & 30d support.'
  ];
  const descInputs = await page.$$('.pkg-description-input');
  console.log('Desc inputs (.pkg-description-input):', descInputs.length);
  for (let i = 0; i < descs.length; i++) {
    await page.evaluate((el, text) => {
      el.focus();
      document.execCommand('selectAll', false, null);
      document.execCommand('insertText', false, text);
      el.dispatchEvent(new Event('change', { bubbles: true }));
    }, descInputs[i], descs[i]);
    await new Promise(r => setTimeout(r, 200));
  }

  // 3. Dropdown helper
  async function pickOption(triggerSelectorIndex, isDelivery, targetPattern) {
    const selector = isDelivery 
      ? '.pkg-duration-input .select-penta-design-content' 
      : '.flex .select-penta-design .select-penta-design-content';
    const triggers = await page.$$(selector);
    const trigger = triggers[triggerSelectorIndex];
    if (!trigger) {
      console.error(`Trigger not found for index ${triggerSelectorIndex} (isDelivery: ${isDelivery})`);
      return false;
    }

    await page.evaluate(e => e.scrollIntoView({ block: 'center' }), trigger);
    await new Promise(r => setTimeout(r, 200));
    const box = await trigger.boundingBox();
    if (!box) {
      console.error('No bounding box for trigger');
      return false;
    }
    await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
    await new Promise(r => setTimeout(r, 500));

    // Find visible buttons in popover
    const picked = await page.evaluate((pattern) => {
      const options = Array.from(document.querySelectorAll('button.table-select-option, [class*="table-select-option"], aside button'));
      const visibleOpts = options.filter(o => o.offsetParent !== null);
      // Try exact, then startsWith, then includes
      let btn = visibleOpts.find(o => o.innerText.trim().toUpperCase() === pattern.toUpperCase()) ||
                visibleOpts.find(o => o.innerText.trim().toUpperCase().startsWith(pattern.toUpperCase())) ||
                visibleOpts.find(o => o.innerText.trim().toUpperCase().includes(pattern.toUpperCase()));
      if (btn) {
        btn.click();
        return { success: true, text: btn.innerText.trim() };
      }
      return { success: false, available: visibleOpts.slice(0, 10).map(o => o.innerText.trim()) };
    }, targetPattern);

    await new Promise(r => setTimeout(r, 400));
    return picked;
  }

  // 4. Delivery Times: 7 days, 21 days, 40 days (or 30/45/60/etc)
  console.log('Selecting delivery times...');
  const deliveryTargets = ['7 DAYS', '21 DAYS', '40 DAYS'];
  for (let i = 0; i < 3; i++) {
    const res = await pickOption(i, true, deliveryTargets[i]);
    console.log(`Delivery ${i} (${deliveryTargets[i]}):`, res);
    // If 40 DAYS is not an option, see what available options were
    if (!res.success && res.available && res.available.length > 0) {
      console.log('Falling back or available options:', res.available);
      // Check if 45 or 30 or 60 exists
      const fallback = ['30 DAYS', '45 DAYS', '60 DAYS'].find(f => res.available.some(a => a.includes(f)));
      if (fallback) {
        console.log('Trying fallback delivery:', fallback);
        const fbRes = await pickOption(i, true, fallback);
        console.log(`Fallback ${fallback} result:`, fbRes);
      }
    }
  }

  // 5. Revisions: 1, 2, 3
  console.log('Selecting revisions...');
  const revTargets = ['1', '2', '3'];
  for (let i = 0; i < 3; i++) {
    const res = await pickOption(i, false, revTargets[i]);
    console.log(`Revision ${i} (${revTargets[i]}):`, res);
  }

  // 6. Prices
  console.log('Setting prices...');
  const prices = ['500', '2500', '5000'];
  const priceInputs = await page.$$('.price-input');
  console.log('Price inputs (.price-input):', priceInputs.length);
  for (let i = 0; i < prices.length; i++) {
    await page.evaluate(e => e.scrollIntoView({ block: 'center' }), priceInputs[i]);
    await priceInputs[i].focus();
    await page.keyboard.down('Meta');
    await page.keyboard.press('a');
    await page.keyboard.up('Meta');
    await page.keyboard.press('Backspace');
    await page.keyboard.type(prices[i], { delay: 30 });
    await page.evaluate(el => el.dispatchEvent(new Event('change', { bubbles: true })), priceInputs[i]);
    await new Promise(r => setTimeout(r, 200));
  }

  // 7. Checkboxes in table
  await page.evaluate(() => {
    const trs = Array.from(document.querySelectorAll('table tr'));
    // Include source code (row 4)
    if (trs[4]) trs[4].querySelectorAll('input[type="checkbox"]').forEach(cb => { if (!cb.checked) cb.click(); });
    // Detailed code comments (row 5)
    if (trs[5]) trs[5].querySelectorAll('input[type="checkbox"]').forEach(cb => { if (!cb.checked) cb.click(); });
    // Database integration (row 6)
    if (trs[6]) trs[6].querySelectorAll('input[type="checkbox"]').forEach(cb => { if (!cb.checked) cb.click(); });
  });

  // 8. Extra services uncheck
  await page.evaluate(() => {
    const extraCbs = document.querySelectorAll('.gig-extras input[type="checkbox"], [class*="extra-services"] input[type="checkbox"]');
    extraCbs.forEach(cb => {
      if (cb.checked) cb.click();
    });
  });

  await new Promise(r => setTimeout(r, 1000));
  const shotPath = path.join(__dirname, 'gig2_perfect_pricing.png');
  await page.screenshot({ path: shotPath, fullPage: true });
  console.log('Saved pricing shot to:', shotPath);

  // 9. Save & Continue
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
  console.log('Current URL after Save:', page.url());

  const afterShot = path.join(__dirname, 'gig2_after_pricing_saved.png');
  await page.screenshot({ path: afterShot, fullPage: true });
  console.log('Saved after-pricing shot to:', afterShot);

  await browser.disconnect();
}

main().catch(console.error);
