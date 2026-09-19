const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const page = (await browser.pages())[0];

  console.log('Clicking CREATE A NEW GIG from manage_gigs...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('a, button'));
    const btn = btns.find(b => b.innerText.trim().toUpperCase() === 'CREATE A NEW GIG');
    if (btn) btn.click();
  });

  await new Promise(r => setTimeout(r, 2500));
  console.log('Current URL:', page.url());

  // 1. Gig Title
  console.log('Typing title...');
  const titleText = 'build a Business Central B2B portal or customer self service solution';
  const titleArea = await page.$('textarea');
  if (titleArea) {
    await titleArea.focus();
    await page.evaluate(el => { el.value = ''; }, titleArea);
    await page.keyboard.type(titleText, { delay: 15 });
  }

  // 2. Category: PROGRAMMING & TECH
  console.log('Selecting category...');
  const catControls = await page.$$('.category-selector__control');
  if (catControls.length > 0) {
    await catControls[0].click();
    await new Promise(r => setTimeout(r, 500));
    await page.evaluate(() => {
      const opts = Array.from(document.querySelectorAll('[class*="option"]'));
      const prog = opts.find(o => o.innerText.trim().toUpperCase() === 'PROGRAMMING & TECH');
      if (prog) prog.click();
    });
    await new Promise(r => setTimeout(r, 1000));
  }

  // 3. Subcategory: WEBSITE DEVELOPMENT
  console.log('Selecting subcategory...');
  const subControls = await page.$$('.category-selector__control');
  if (subControls.length > 1) {
    await subControls[1].click();
    await new Promise(r => setTimeout(r, 500));
    await page.evaluate(() => {
      const opts = Array.from(document.querySelectorAll('[class*="option"]'));
      const web = opts.find(o => o.innerText.trim().toUpperCase() === 'WEBSITE DEVELOPMENT');
      if (web) web.click();
    });
    await new Promise(r => setTimeout(r, 1000));
  }

  // 4. Service Type: CUSTOM WEBSITES
  console.log('Selecting service type...');
  const serviceControls = await page.$$('.category-selector__control');
  if (serviceControls.length > 2) {
    await serviceControls[2].click();
    await new Promise(r => setTimeout(r, 500));
    await page.evaluate(() => {
      const opts = Array.from(document.querySelectorAll('[class*="option"]'));
      const custom = opts.find(o => o.innerText.trim().toUpperCase() === 'CUSTOM WEBSITES') || opts[0];
      if (custom) custom.click();
    });
    await new Promise(r => setTimeout(r, 1000));
  }

  // 5. Metadata configuration strictly within .metadata-container
  console.log('Configuring metadata...');
  // (a) Website Type
  await page.evaluate(() => {
    const tabs = Array.from(document.querySelectorAll('.metadata-names-list li, [class*="metadata"] li'));
    const wt = tabs.find(t => t.innerText && t.innerText.toLowerCase().includes('website type'));
    if (wt) wt.click();
  });
  await new Promise(r => setTimeout(r, 500));

  await page.evaluate(() => {
    const container = document.querySelector('.metadata-container, [class*="metadata-content"]');
    if (!container) return;
    const labels = Array.from(container.querySelectorAll('label'));
    const portal = labels.find(l => l.innerText && l.innerText.trim().toLowerCase() === 'portal');
    if (portal) portal.click();
    const business = labels.find(l => l.innerText && l.innerText.trim().toLowerCase() === 'business');
    if (business) business.click();
  });
  await new Promise(r => setTimeout(r, 500));

  // (b) Programming Language
  await page.evaluate(() => {
    const tabs = Array.from(document.querySelectorAll('.metadata-names-list li, [class*="metadata"] li'));
    const langTab = tabs.find(t => t.innerText && t.innerText.toLowerCase().includes('programming language'));
    if (langTab) langTab.click();
  });
  await new Promise(r => setTimeout(r, 500));

  await page.evaluate(() => {
    const container = document.querySelector('.metadata-container, [class*="metadata-content"]');
    if (!container) return;
    const labels = Array.from(container.querySelectorAll('label'));
    const php = labels.find(l => l.innerText && l.innerText.trim().toUpperCase() === 'PHP');
    if (php) php.click();
  });
  await new Promise(r => setTimeout(r, 500));

  // (c) Website Features
  await page.evaluate(() => {
    const tabs = Array.from(document.querySelectorAll('.metadata-names-list li, [class*="metadata"] li'));
    const wf = tabs.find(t => t.innerText && t.innerText.toLowerCase().includes('features'));
    if (wf) wf.click();
  });
  await new Promise(r => setTimeout(r, 500));

  await page.evaluate(() => {
    const container = document.querySelector('.metadata-container, [class*="metadata-content"]');
    if (!container) return;
    const labels = Array.from(container.querySelectorAll('label'));
    // Pick first 3-4 feature checkboxes
    for (let i = 0; i < Math.min(labels.length, 3); i++) {
      labels[i].click();
    }
  });
  await new Promise(r => setTimeout(r, 500));

  // 6. Positive keywords (5 tags)
  console.log('Adding search tags...');
  const tags = ['b2b portal', 'customer portal', 'business central', 'web development', 'php'];
  const tagInput = await page.$('.react-tags__search-input input');
  if (tagInput) {
    for (const t of tags) {
      await tagInput.focus();
      await page.keyboard.type(t, { delay: 15 });
      await page.keyboard.press('Enter');
      await new Promise(r => setTimeout(r, 300));
    }
  }

  // 7. License disclaimer
  await page.evaluate(() => {
    const cb = document.querySelector('.category-disclaimer-checkbox input, input[type="checkbox"][name*="license"]');
    if (cb && !cb.checked) cb.click();
  });

  await new Promise(r => setTimeout(r, 1000));

  const shot = path.join(__dirname, 'gig3_step1_configured_clean.png');
  await page.screenshot({ path: shot, fullPage: true });
  console.log('Saved shot to:', shot);

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
  console.log('Current URL after save:', page.url());

  const afterShot = path.join(__dirname, 'gig3_pricing_reached.png');
  await page.screenshot({ path: afterShot, fullPage: true });
  console.log('Saved after-save shot to:', afterShot);

  await browser.disconnect();
}

main().catch(console.error);
