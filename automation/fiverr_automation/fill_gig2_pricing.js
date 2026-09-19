const puppeteer = require('puppeteer-core');
const path = require('path');

async function setDropdownInCell(page, rowIndex, colIndex, targetText) {
  console.log(`Setting row ${rowIndex}, col ${colIndex} to "${targetText}"...`);
  // Click trigger inside cell
  await page.evaluate((r, c) => {
    const trs = Array.from(document.querySelectorAll('table tr'));
    const td = trs[r].querySelectorAll('td')[c];
    const trigger = td.querySelector('.select-penta-design-content, .c3f47d7, [class*="select"]');
    if (trigger) trigger.click();
  }, rowIndex, colIndex);

  await new Promise(res => setTimeout(res, 500));

  // Check what options are available in visible aside
  const clicked = await page.evaluate((target) => {
    const visibleAside = Array.from(document.querySelectorAll('aside')).find(a => window.getComputedStyle(a).display !== 'none');
    if (!visibleAside) return { success: false, reason: 'no visible aside' };
    const buttons = Array.from(visibleAside.querySelectorAll('button'));
    const allTexts = buttons.map(b => b.innerText.trim());
    
    // Find exact or partial match
    const btn = buttons.find(b => b.innerText.trim().toUpperCase() === target.toUpperCase()) ||
                buttons.find(b => b.innerText.trim().toUpperCase().includes(target.toUpperCase()));
    if (btn) {
      btn.click();
      return { success: true, allTexts };
    }
    return { success: false, allTexts };
  }, targetText);

  console.log(`Result for ${targetText}:`, clicked.success, clicked.allTexts ? `(Options: ${clicked.allTexts.slice(0, 5).join(', ')}...)` : clicked.reason);
  await new Promise(res => setTimeout(res, 400));
  return clicked.success;
}

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const page = (await browser.pages())[0];

  console.log('Inspecting table on:', page.url());

  // Print table rows to verify indices
  const rows = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('table tr')).map((tr, idx) => {
      return `${idx}: ${tr.innerText.replace(/\n+/g, ' ').slice(0, 60)}`;
    });
  });
  console.log('Table rows:\n', rows.join('\n'));

  // 1. Fill Package Titles
  const titles = ['Single Data Stream', 'Full Webshop Sync', 'Multi-System Integration'];
  const titleInputs = await page.$$('.pkg-title-input, textarea[name*="title"], input[name*="title"]');
  console.log('Title inputs found:', titleInputs.length);
  for (let i = 0; i < titles.length; i++) {
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
    'Technical mapping and one data flow (e.g., webshop orders into BC).',
    'Complete 2-way sync: items, stock, prices, orders, customers.',
    'Multi-system sync (Shopify/CRM/Bank), error alerts, logging & 30d support.'
  ];
  const descInputs = await page.$$('.pkg-description-input, textarea[name*="description"]');
  console.log('Desc inputs found:', descInputs.length);
  for (let i = 0; i < descs.length; i++) {
    await page.evaluate((el, text) => {
      el.focus();
      document.execCommand('selectAll', false, null);
      document.execCommand('insertText', false, text);
      el.dispatchEvent(new Event('change', { bubbles: true }));
    }, descInputs[i], descs[i]);
    await new Promise(r => setTimeout(r, 200));
  }

  // 3. Delivery Times (Row 3)
  // Delivery options: 7 DAYS DELIVERY, 21 DAYS DELIVERY, 40 DAYS DELIVERY (wait, let's see what exists)
  await setDropdownInCell(page, 3, 1, '7 DAYS');
  await setDropdownInCell(page, 3, 2, '21 DAYS');
  await setDropdownInCell(page, 3, 3, '40 DAYS'); // or closest

  // 4. Checkboxes:
  // Row 4: Include source code -> check all 3
  // Row 5: Detailed code comments -> check all 3
  // Row 6: Database integration -> check all 3
  await page.evaluate(() => {
    const trs = Array.from(document.querySelectorAll('table tr'));
    [4, 5, 6].forEach(r => {
      if (trs[r]) {
        trs[r].querySelectorAll('input[type="checkbox"]').forEach(cb => {
          if (!cb.checked) cb.click();
        });
      }
    });
  });

  // 5. Revisions (Row 7)
  await setDropdownInCell(page, 7, 1, '1');
  await setDropdownInCell(page, 7, 2, '2');
  await setDropdownInCell(page, 7, 3, '3');

  // 6. Prices (Row 8)
  const prices = ['500', '2500', '5000'];
  const priceInputs = await page.$$('.price-input, input[name*="price"]');
  console.log('Price inputs found:', priceInputs.length);
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

  // 7. Uncheck any checked extra services checkboxes below the table
  await page.evaluate(() => {
    const extras = document.querySelector('.gig-extras, [class*="extra-services"]');
    if (extras) {
      extras.querySelectorAll('input[type="checkbox"]').forEach(cb => {
        if (cb.checked) cb.click();
      });
    }
  });

  await new Promise(r => setTimeout(r, 1000));
  const shotPath = path.join(__dirname, 'gig2_pricing_filled.png');
  await page.screenshot({ path: shotPath, fullPage: true });
  console.log('Saved pricing screenshot to:', shotPath);

  // 8. Click Save & Continue
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

  const afterShot = path.join(__dirname, 'gig2_after_pricing.png');
  await page.screenshot({ path: afterShot, fullPage: true });
  console.log('Saved after pricing screenshot to:', afterShot);

  await browser.disconnect();
}

main().catch(console.error);
