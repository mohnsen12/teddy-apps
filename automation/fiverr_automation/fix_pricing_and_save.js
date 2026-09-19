const puppeteer = require('puppeteer-core');
const path = require('path');

async function setDropdownInCell(page, rowIndex, colIndex, targetText) {
  console.log(`Setting row ${rowIndex}, col ${colIndex} to "${targetText}"...`);
  // 1. Click trigger inside cell
  await page.evaluate((r, c) => {
    const trs = Array.from(document.querySelectorAll('table tr'));
    const td = trs[r].querySelectorAll('td')[c];
    const trigger = td.querySelector('.select-penta-design-content, .c3f47d7');
    if (trigger) trigger.click();
  }, rowIndex, colIndex);

  await new Promise(res => setTimeout(res, 500));

  // 2. Click option inside the visible aside
  const clicked = await page.evaluate((target) => {
    const visibleAside = Array.from(document.querySelectorAll('aside')).find(a => window.getComputedStyle(a).display !== 'none');
    if (!visibleAside) return false;
    const btn = Array.from(visibleAside.querySelectorAll('button')).find(b => b.innerText.trim().toUpperCase() === target.toUpperCase());
    if (btn) {
      btn.click();
      return true;
    }
    return false;
  }, targetText);

  console.log(`Result: ${clicked}`);
  await new Promise(res => setTimeout(res, 400));
  return clicked;
}

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const page = (await browser.pages()).find(p => p.url().includes('pricing') || p.url().includes('fiverr.com'));

  // 1. Set Delivery Times (Row 3, Cols 1, 2, 3)
  await setDropdownInCell(page, 3, 1, '5 DAYS DELIVERY');
  await setDropdownInCell(page, 3, 2, '14 DAYS DELIVERY');
  await setDropdownInCell(page, 3, 3, '30 DAYS DELIVERY');

  // 2. Set Revisions (Row 10, Cols 1, 2, 3)
  await setDropdownInCell(page, 10, 1, '1');
  await setDropdownInCell(page, 10, 2, '2');
  await setDropdownInCell(page, 10, 3, '3');

  // 3. Verify prices
  const prices = ['350', '1200', '3000'];
  const priceInputs = await page.$$('.price-input');
  for (let i = 0; i < prices.length; i++) {
    await page.evaluate(e => e.scrollIntoView({ block: 'center' }), priceInputs[i]);
    await priceInputs[i].focus();
    await page.keyboard.down('Meta');
    await page.keyboard.press('a');
    await page.keyboard.up('Meta');
    await page.keyboard.press('Backspace');
    await page.keyboard.type(prices[i], { delay: 30 });
    await page.evaluate(el => el.dispatchEvent(new Event('change', { bubbles: true })), priceInputs[i]);
  }

  // 4. Checkboxes
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

  await new Promise(r => setTimeout(r, 1000));
  const beforeSavePath = path.join(__dirname, 'perfect_pricing.png');
  await page.screenshot({ path: beforeSavePath, fullPage: true });
  console.log('Saved before-save screenshot');

  // 5. Click Save & Continue
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
  console.log('New URL:', page.url());

  const afterSavePath = path.join(__dirname, 'after_pricing_save.png');
  await page.screenshot({ path: afterSavePath, fullPage: true });
  console.log('Screenshot saved to:', afterSavePath);

  await browser.disconnect();
}

main().catch(console.error);
