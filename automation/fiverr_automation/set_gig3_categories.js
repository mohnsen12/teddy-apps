const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const page = (await browser.pages()).find(p => p.url().includes('manage_gigs') || p.url().includes('fiverr.com'));

  console.log('Selecting category on:', page.url());

  // 1. Click Category (control 0)
  const controls = await page.$$('.category-selector__control');
  console.log('Controls found:', controls.length);

  await controls[0].click();
  await new Promise(r => setTimeout(r, 600));

  const catOpts = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('[class*="option"]')).map(o => o.innerText.trim());
  });
  console.log('Categories available:', catOpts);

  // Click PROGRAMMING & TECH
  await page.evaluate(() => {
    const opts = Array.from(document.querySelectorAll('[class*="option"]'));
    const prog = opts.find(o => o.innerText.trim().toUpperCase() === 'PROGRAMMING & TECH');
    if (prog) prog.click();
  });
  await new Promise(r => setTimeout(r, 1200));

  // 2. Click Subcategory (control 1)
  const afterCatControls = await page.$$('.category-selector__control');
  await afterCatControls[1].click();
  await new Promise(r => setTimeout(r, 600));

  const subOpts = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('[class*="option"]')).map(o => o.innerText.trim());
  });
  console.log('Subcategories available:\n', subOpts.filter(o => !o.includes('\n')));

  // Select WEBSITE DEVELOPMENT
  await page.evaluate(() => {
    const opts = Array.from(document.querySelectorAll('[class*="option"]'));
    const web = opts.find(o => o.innerText.trim().toUpperCase() === 'WEBSITE DEVELOPMENT') ||
                opts.find(o => o.innerText.trim().toUpperCase().includes('WEBSITE'));
    if (web) web.click();
  });
  await new Promise(r => setTimeout(r, 1200));

  // 3. Click Service Type (control 2 if available)
  const afterSubControls = await page.$$('.category-selector__control');
  console.log('Controls after subcategory:', afterSubControls.length);
  if (afterSubControls.length >= 3) {
    await afterSubControls[2].click();
    await new Promise(r => setTimeout(r, 600));

    const sTypes = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('[class*="option"]')).map(o => o.innerText.trim());
    });
    console.log('Service types:\n', sTypes.filter(o => !o.includes('\n')));

    await page.evaluate(() => {
      const opts = Array.from(document.querySelectorAll('[class*="option"]'));
      const custom = opts.find(o => o.innerText.toLowerCase().includes('custom website')) ||
                     opts.find(o => o.innerText.toLowerCase().includes('custom')) ||
                     opts.find(o => o.innerText.toLowerCase().includes('full website')) ||
                     opts.find(o => o.innerText.toLowerCase().includes('web application')) ||
                     opts[0];
      if (custom) custom.click();
    });
    await new Promise(r => setTimeout(r, 1200));
  }

  // 4. Metadata: Website type (Portal, Business) and Programming language (PHP)
  console.log('Selecting metadata...');
  await page.evaluate(() => {
    const labels = Array.from(document.querySelectorAll('label'));
    const portal = labels.find(l => l.innerText && l.innerText.trim().toLowerCase() === 'portal');
    if (portal) portal.click();
    const business = labels.find(l => l.innerText && l.innerText.trim().toLowerCase() === 'business');
    if (business) business.click();
    const ecom = labels.find(l => l.innerText && l.innerText.trim().toLowerCase().includes('e-commerce'));
    if (ecom) ecom.click();
  });

  // Check programming language tab
  await page.evaluate(() => {
    const tabs = Array.from(document.querySelectorAll('.metadata-names-list li, [class*="metadata"] li'));
    const langTab = tabs.find(t => t.innerText && t.innerText.toLowerCase().includes('programming language'));
    if (langTab) langTab.click();
  });
  await new Promise(r => setTimeout(r, 500));

  await page.evaluate(() => {
    const labels = Array.from(document.querySelectorAll('label'));
    const php = labels.find(l => l.innerText && l.innerText.trim().toUpperCase() === 'PHP');
    if (php) php.click();
  });

  // Check license checkbox
  await page.evaluate(() => {
    const cb = document.querySelector('.category-disclaimer-checkbox input, input[type="checkbox"][name*="license"]');
    if (cb && !cb.checked) cb.click();
  });

  await new Promise(r => setTimeout(r, 1000));
  const shot = path.join(__dirname, 'gig3_step1_ready.png');
  await page.screenshot({ path: shot, fullPage: true });
  console.log('Saved shot to:', shot);

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
  console.log('URL after save:', page.url());

  const afterShot = path.join(__dirname, 'gig3_after_step1_saved.png');
  await page.screenshot({ path: afterShot, fullPage: true });
  console.log('Saved after-save shot to:', afterShot);

  await browser.disconnect();
}

main().catch(console.error);
