const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const page = (await browser.pages())[0];

  console.log('Fixing Gig 3 Revisions and Price ceiling...');

  // Helper to click cell trigger and pick option from visible aside
  async function pickOptionInCell(rowIdx, colIdx, targetNum) {
    console.log(`Setting row ${rowIdx}, col ${colIdx} to ${targetNum}...`);
    // Click trigger in td
    await page.evaluate((r, c) => {
      const trs = Array.from(document.querySelectorAll('table tr'));
      const td = trs[r].querySelectorAll('td')[c];
      const trigger = td.querySelector('.select-penta-design-content, .c3f47d7, [class*="select"]');
      if (trigger) trigger.click();
    }, rowIdx, colIdx);

    await new Promise(res => setTimeout(res, 500));

    // Find visible aside
    const clicked = await page.evaluate((num) => {
      const aside = Array.from(document.querySelectorAll('aside')).find(a => window.getComputedStyle(a).display !== 'none');
      if (!aside) return false;
      const btns = Array.from(aside.querySelectorAll('button'));
      const match = btns.find(b => b.innerText.trim() === num);
      if (match) {
        match.click();
        return true;
      }
      return false;
    }, targetNum);
    console.log(`Result for ${targetNum}:`, clicked);
    await new Promise(res => setTimeout(res, 400));
    return clicked;
  }

  // Row 6 is Revisions: cols 1, 2, 3
  await pickOptionInCell(6, 1, '1');
  await pickOptionInCell(6, 2, '2');
  await pickOptionInCell(6, 3, '3');

  // Fix Price 2 to 10000 (Fiverr max)
  const prices = ['3500', '7000', '10000'];
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

  const shot = path.join(__dirname, 'gig3_pricing_fixed_perfect.png');
  await page.screenshot({ path: shot, fullPage: true });
  console.log('Saved fixed pricing shot to:', shot);

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
  console.log('URL after Pricing save:', page.url());

  const afterShot = path.join(__dirname, 'gig3_step3_reached.png');
  await page.screenshot({ path: afterShot, fullPage: true });
  console.log('Saved after shot to:', afterShot);

  await browser.disconnect();
}

main().catch(console.error);
