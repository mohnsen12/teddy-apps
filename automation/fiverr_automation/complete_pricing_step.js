const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('pricing') || p.url().includes('fiverr.com')) || pages[0];

  console.log('Completing pricing step on:', page.url());

  // 1. Titles
  const titles = ['Small Customization', 'Feature & Workflow', 'Custom BC Extension'];
  const titleInputs = await page.$$('.pkg-title-input');
  for (let i = 0; i < titles.length; i++) {
    console.log(`Setting title ${i}: ${titles[i]}`);
    await page.evaluate((el, text) => {
      el.focus();
      document.execCommand('selectAll', false, null);
      document.execCommand('insertText', false, text);
      el.dispatchEvent(new Event('change', { bubbles: true }));
    }, titleInputs[i], titles[i]);
    await new Promise(r => setTimeout(r, 200));
  }

  // 2. Descriptions
  const descs = [
    'Single field logic, page extension, or minor automated routine in BC.',
    'Complete workflow, approval rules, or specialized page with tests.',
    'Full custom AL app, multi-feature extension, deployment & support.'
  ];
  const descInputs = await page.$$('.pkg-description-input');
  for (let i = 0; i < descs.length; i++) {
    console.log(`Setting description ${i}`);
    await page.evaluate((el, text) => {
      el.focus();
      document.execCommand('selectAll', false, null);
      document.execCommand('insertText', false, text);
      el.dispatchEvent(new Event('change', { bubbles: true }));
    }, descInputs[i], descs[i]);
    await new Promise(r => setTimeout(r, 200));
  }

  // Function to click custom dropdown and pick option
  async function pickOption(triggerSelectorIndex, isDelivery, targetText) {
    const selector = isDelivery 
      ? '.pkg-duration-input .select-penta-design-content' 
      : '.flex .select-penta-design .select-penta-design-content';
    const triggers = await page.$$(selector);
    const trigger = triggers[triggerSelectorIndex];
    if (!trigger) {
      console.error(`Trigger not found for index ${triggerSelectorIndex}`);
      return false;
    }

    await page.evaluate(e => e.scrollIntoView({ block: 'center' }), trigger);
    await new Promise(r => setTimeout(r, 200));
    const box = await trigger.boundingBox();
    await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
    await new Promise(r => setTimeout(r, 600));

    // Find and click the option button
    const picked = await page.evaluate((target) => {
      const options = Array.from(document.querySelectorAll('button.table-select-option, [class*="table-select-option"]'));
      const btn = options.find(o => o.innerText.trim().toUpperCase() === target.toUpperCase());
      if (btn) {
        btn.click();
        return true;
      }
      return false;
    }, targetText);
    await new Promise(r => setTimeout(r, 400));
    return picked;
  }

  // 3. Delivery Times
  console.log('Selecting delivery times...');
  const deliveryTargets = ['5 DAYS DELIVERY', '14 DAYS DELIVERY', '30 DAYS DELIVERY'];
  for (let i = 0; i < 3; i++) {
    const res = await pickOption(i, true, deliveryTargets[i]);
    console.log(`Delivery ${i} (${deliveryTargets[i]}):`, res);
  }

  // 4. Revisions
  console.log('Selecting revisions...');
  const revTargets = ['1', '2', '3'];
  for (let i = 0; i < 3; i++) {
    const res = await pickOption(i, false, revTargets[i]);
    console.log(`Revision ${i} (${revTargets[i]}):`, res);
  }

  // 5. Checkboxes
  console.log('Setting checkboxes...');
  await page.evaluate(() => {
    const trs = Array.from(document.querySelectorAll('table tr'));
    // Setup & Installation (Row 4) -> all 3
    if (trs[4]) {
      trs[4].querySelectorAll('input[type="checkbox"]').forEach(cb => { if (!cb.checked) cb.click(); });
    }
    // Data Migration (Row 5) -> Premium (index 2)
    if (trs[5]) {
      const cbs = trs[5].querySelectorAll('input[type="checkbox"]');
      if (cbs[2] && !cbs[2].checked) cbs[2].click();
    }
    // Dashboard & Reporting (Row 7) -> Standard & Premium (index 1, 2)
    if (trs[7]) {
      const cbs = trs[7].querySelectorAll('input[type="checkbox"]');
      if (cbs[1] && !cbs[1].checked) cbs[1].click();
      if (cbs[2] && !cbs[2].checked) cbs[2].click();
    }
    // Design customization (Row 9) -> all 3
    if (trs[9]) {
      trs[9].querySelectorAll('input[type="checkbox"]').forEach(cb => { if (!cb.checked) cb.click(); });
    }
  });

  // 6. Prices
  console.log('Setting prices...');
  const prices = ['350', '1200', '3000'];
  const priceInputs = await page.$$('.price-input');
  for (let i = 0; i < prices.length; i++) {
    console.log(`Setting price ${i}: $${prices[i]}`);
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

  await new Promise(r => setTimeout(r, 1000));
  const beforeSavePath = path.join(__dirname, 'pricing_before_save.png');
  await page.screenshot({ path: beforeSavePath, fullPage: true });
  console.log('Screenshot before save:', beforeSavePath);

  // 7. Click Save & Continue
  console.log('Clicking Save & Continue...');
  const saveClicked = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.innerText.toLowerCase().includes('save & continue') || b.innerText.toLowerCase().includes('save and continue'));
    if (btn) {
      btn.scrollIntoView();
      btn.click();
      return true;
    }
    return false;
  });
  console.log('Save clicked:', saveClicked);

  await new Promise(r => setTimeout(r, 4000));
  console.log('Current URL after save:', page.url());

  const afterSavePath = path.join(__dirname, 'step3_reached.png');
  await page.screenshot({ path: afterSavePath, fullPage: true });
  console.log('Screenshot saved to:', afterSavePath);

  await browser.disconnect();
}

main().catch(console.error);
