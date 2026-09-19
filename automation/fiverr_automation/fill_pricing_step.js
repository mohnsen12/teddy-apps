const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('pricing') || p.url().includes('fiverr.com')) || pages[0];

  console.log('Filling pricing on:', page.url());

  // 1. Fill Package Titles
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

  // 2. Fill Package Descriptions
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

  // Helper for selecting option in custom penta-design dropdown
  async function selectPentaOption(triggerEl, targetTextPattern) {
    await page.evaluate(e => e.scrollIntoView({ block: 'center' }), triggerEl);
    await new Promise(r => setTimeout(r, 200));
    const box = await triggerEl.boundingBox();
    await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
    await new Promise(r => setTimeout(r, 500));

    // Click the matching menu item
    const clicked = await page.evaluate((pattern) => {
      const all = Array.from(document.querySelectorAll('*'));
      // Look for leaf element matching pattern
      const match = all.find(e => {
        return e.children.length === 0 && e.offsetParent !== null && 
               e.innerText && e.innerText.trim().toUpperCase().includes(pattern.toUpperCase());
      });
      if (match) {
        match.scrollIntoView({ block: 'nearest' });
        match.click();
        return true;
      }
      return false;
    }, targetTextPattern);
    await new Promise(r => setTimeout(r, 400));
    return clicked;
  }

  // 3. Delivery Times
  console.log('Selecting delivery times...');
  const durationDropdowns = await page.$$('.pkg-duration-input .select-penta-design-content');
  const deliveryTargets = ['5 DAYS DELIVERY', '14 DAYS DELIVERY', '30 DAYS DELIVERY'];
  for (let i = 0; i < 3; i++) {
    const success = await selectPentaOption(durationDropdowns[i], deliveryTargets[i]);
    console.log(`Delivery ${i} (${deliveryTargets[i]}):`, success);
  }

  // 4. Revisions
  console.log('Selecting revisions...');
  const revisionDropdowns = await page.$$('.flex .select-penta-design .select-penta-design-content');
  const revisionTargets = ['1', '2', '3'];
  for (let i = 0; i < 3; i++) {
    // Note: Revisions list items are "0", "1", "2", "3"
    await page.evaluate(e => e.scrollIntoView({ block: 'center' }), revisionDropdowns[i]);
    await new Promise(r => setTimeout(r, 200));
    const box = await revisionDropdowns[i].boundingBox();
    await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
    await new Promise(r => setTimeout(r, 500));

    const clicked = await page.evaluate((num) => {
      const all = Array.from(document.querySelectorAll('*'));
      const match = all.find(e => e.children.length === 0 && e.offsetParent !== null && e.innerText.trim() === num);
      if (match) {
        match.scrollIntoView({ block: 'nearest' });
        match.click();
        return true;
      }
      return false;
    }, revisionTargets[i]);
    console.log(`Revision ${i} (${revisionTargets[i]}):`, clicked);
    await new Promise(r => setTimeout(r, 400));
  }

  // 5. Checkboxes (Setup & Installation, Design customization)
  console.log('Selecting checkboxes...');
  await page.evaluate(() => {
    const trs = Array.from(document.querySelectorAll('table tr'));
    // Setup & Installation (Row 4) -> check all 3
    if (trs[4]) {
      trs[4].querySelectorAll('input[type="checkbox"]').forEach(cb => { if (!cb.checked) cb.click(); });
    }
    // Design customization (Row 9) -> check all 3
    if (trs[9]) {
      trs[9].querySelectorAll('input[type="checkbox"]').forEach(cb => { if (!cb.checked) cb.click(); });
    }
    // Dashboard & Reporting (Row 7) -> check Standard & Premium (index 1 & 2)
    if (trs[7]) {
      const cbs = trs[7].querySelectorAll('input[type="checkbox"]');
      if (cbs[1] && !cbs[1].checked) cbs[1].click();
      if (cbs[2] && !cbs[2].checked) cbs[2].click();
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
  const screenshotPath = path.join(__dirname, 'pricing_filled.png');
  await page.screenshot({ path: screenshotPath, fullPage: true });
  console.log('Screenshot saved to:', screenshotPath);

  await browser.disconnect();
}

main().catch(console.error);
