const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const page = (await browser.pages())[0];

  console.log('Inspecting pricing table for Gig 3 on:', page.url());

  const rows = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('table tr')).map((tr, idx) => {
      return `${idx}: ${tr.innerText.replace(/\s+/g, ' ').trim().slice(0, 60)}`;
    });
  });
  console.log('Table rows:\n', rows.join('\n'));

  // 1. Titles
  const titles = ['Portal Design & MVP', 'Full B2B Portal', 'Portal + Admin & Training'];
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

  // 2. Descriptions
  const descs = [
    'Solution design, authenticated login, real-time stock & order status.',
    'Customer-specific pricing, full order history, 1-click re-order directly into BC.',
    'Admin dashboard, custom design, user roles, onboarding & 30d support.'
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
  async function pickPentaOption(triggerEl, targetPattern) {
    await page.evaluate(e => e.scrollIntoView({ block: 'center' }), triggerEl);
    await new Promise(r => setTimeout(r, 200));
    const box = await triggerEl.boundingBox();
    if (!box) return false;
    await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
    await new Promise(r => setTimeout(r, 500));

    const picked = await page.evaluate((pattern) => {
      const aside = Array.from(document.querySelectorAll('aside')).find(a => window.getComputedStyle(a).display !== 'none');
      if (!aside) return { success: false, reason: 'no visible aside' };
      const btns = Array.from(aside.querySelectorAll('button'));
      const match = btns.find(b => b.innerText.trim().toUpperCase() === pattern.toUpperCase()) ||
                    btns.find(b => b.innerText.trim().toUpperCase().startsWith(pattern.toUpperCase())) ||
                    btns.find(b => b.innerText.trim().toUpperCase().includes(pattern.toUpperCase()));
      if (match) {
        match.scrollIntoView({ block: 'nearest' });
        match.click();
        return { success: true, text: match.innerText.trim() };
      }
      return { success: false, available: btns.map(b => b.innerText.trim()) };
    }, targetPattern);

    await new Promise(r => setTimeout(r, 400));
    return picked;
  }

  // Delivery dropdowns
  console.log('Selecting delivery times...');
  const durationTriggers = await page.$$('.pkg-duration-input .select-penta-design-content');
  console.log('Duration triggers:', durationTriggers.length);
  const deliveryTargets = ['21 DAYS', '45 DAYS', '60 DAYS'];
  for (let i = 0; i < 3; i++) {
    const res = await pickPentaOption(durationTriggers[i], deliveryTargets[i]);
    console.log(`Delivery ${i} (${deliveryTargets[i]}):`, res);
  }

  // Revision dropdowns
  console.log('Selecting revisions...');
  // Revisions row: let's find the dropdowns in the revisions row
  const revTriggers = await page.evaluateHandle(() => {
    const trs = Array.from(document.querySelectorAll('table tr'));
    const revRow = trs.find(tr => tr.innerText.toLowerCase().includes('revision'));
    if (!revRow) return [];
    return Array.from(revRow.querySelectorAll('.select-penta-design-content, .c3f47d7'));
  });
  const revElements = await revTriggers.getProperties();
  const revList = [];
  for (const p of revElements.values()) {
    const el = p.asElement();
    if (el) revList.push(el);
  }
  console.log('Revision dropdown elements found:', revList.length);
  const revTargets = ['1', '2', '3'];
  for (let i = 0; i < Math.min(revList.length, 3); i++) {
    const res = await pickPentaOption(revList[i], revTargets[i]);
    console.log(`Revision ${i} (${revTargets[i]}):`, res);
  }

  // 4. Number of pages (Row 4 has 1, 1, 1 default, let's keep or set)
  // Checkboxes in table:
  console.log('Setting checkboxes in table...');
  await page.evaluate(() => {
    const trs = Array.from(document.querySelectorAll('table tr'));
    // E-commerce functionality, Payment Integration, Speed optimization, Hosting setup
    trs.forEach(tr => {
      const text = tr.innerText.toLowerCase();
      if (text.includes('e-commerce') || text.includes('payment') || text.includes('speed') || text.includes('hosting')) {
        tr.querySelectorAll('input[type="checkbox"]').forEach(cb => {
          if (!cb.checked) cb.click();
        });
      }
    });
  });

  // 5. Prices using nativeSetter
  console.log('Setting prices...');
  const prices = ['3500', '7000', '12000'];
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

  await new Promise(r => setTimeout(r, 600));

  // 6. Uncheck extra services checkboxes
  await page.evaluate(() => {
    const extras = Array.from(document.querySelectorAll('.gig-extras input[type="checkbox"], [class*="extra-services"] input[type="checkbox"], input[type="checkbox"]'));
    extras.forEach(cb => {
      const parentText = cb.closest('div, li, label')?.innerText || '';
      if (parentText.includes('Extra fast') || parentText.includes('Additional revision') || parentText.includes('Additional page')) {
        if (cb.checked) cb.click();
      }
    });
  });

  await new Promise(r => setTimeout(r, 1000));
  const shot = path.join(__dirname, 'gig3_pricing_configured.png');
  await page.screenshot({ path: shot, fullPage: true });
  console.log('Saved pricing shot to:', shot);

  // 7. Save & Continue
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

  const afterShot = path.join(__dirname, 'gig3_desc_reached.png');
  await page.screenshot({ path: afterShot, fullPage: true });
  console.log('Saved after shot to:', afterShot);

  await browser.disconnect();
}

main().catch(console.error);
