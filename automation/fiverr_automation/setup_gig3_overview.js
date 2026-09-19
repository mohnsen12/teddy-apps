const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const page = (await browser.pages()).find(p => p.url().includes('manage_gigs') || p.url().includes('fiverr.com'));

  console.log('Configuring Step 1 Overview for Gig 3 on:', page.url());

  // 1. Gig Title
  const titleText = 'build a Business Central B2B portal or customer self service solution';
  const titleArea = await page.$('textarea');
  if (titleArea) {
    await titleArea.focus();
    await page.evaluate(el => { el.value = ''; }, titleArea);
    await page.keyboard.type(titleText, { delay: 15 });
  }

  // 2. Select Subcategory: Website Development
  const subControls = await page.$$('.category-selector__control');
  console.log('Category controls found:', subControls.length);

  // Subcategory is control 1
  if (subControls.length > 1) {
    await subControls[1].click();
    await new Promise(r => setTimeout(r, 600));

    // Click WEBSITE DEVELOPMENT
    const clickedSub = await page.evaluate(() => {
      const opts = Array.from(document.querySelectorAll('[class*="option"]'));
      const target = opts.find(o => o.innerText.trim().toUpperCase() === 'WEBSITE DEVELOPMENT') ||
                     opts.find(o => o.innerText.trim().toUpperCase().includes('WEBSITE DEVELOPMENT'));
      if (target) {
        target.click();
        return target.innerText.trim();
      }
      return null;
    });
    console.log('Clicked subcategory:', clickedSub);
    await new Promise(r => setTimeout(r, 1200));
  }

  // 3. Service Type: control 2
  const afterSubControls = await page.$$('.category-selector__control');
  if (afterSubControls.length >= 3) {
    await afterSubControls[2].click();
    await new Promise(r => setTimeout(r, 600));

    const sTypes = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('[class*="option"]')).map(o => o.innerText.trim());
    });
    console.log('Service types under Website Development:\n', sTypes);

    // Look for Custom Websites or Web Application or Full Website Creation
    const clickedService = await page.evaluate(() => {
      const opts = Array.from(document.querySelectorAll('[class*="option"]'));
      const target = opts.find(o => o.innerText.toLowerCase().includes('custom website')) ||
                     opts.find(o => o.innerText.toLowerCase().includes('custom')) ||
                     opts.find(o => o.innerText.toLowerCase().includes('full website')) ||
                     opts.find(o => o.innerText.toLowerCase().includes('web application')) ||
                     opts[0];
      if (target) {
        target.click();
        return target.innerText.trim();
      }
      return null;
    });
    console.log('Clicked service type:', clickedService);
    await new Promise(r => setTimeout(r, 1200));
  }

  // 4. Configure metadata
  console.log('Configuring metadata...');
  await page.evaluate(() => {
    const labels = Array.from(document.querySelectorAll('label'));
    const portal = labels.find(l => l.innerText && l.innerText.trim().toLowerCase() === 'portal');
    if (portal) portal.click();
    const business = labels.find(l => l.innerText && l.innerText.trim().toLowerCase() === 'business');
    if (business) business.click();
    const ecom = labels.find(l => l.innerText && l.innerText.trim().toLowerCase().includes('e-commerce'));
    if (ecom) ecom.click();
  });

  // Programming language or platform tab
  await page.evaluate(() => {
    const tabs = Array.from(document.querySelectorAll('.metadata-names-list li, [class*="metadata"] li'));
    const langTab = tabs.find(t => t.innerText && (t.innerText.toLowerCase().includes('programming language') || t.innerText.toLowerCase().includes('specialization')));
    if (langTab) langTab.click();
  });
  await new Promise(r => setTimeout(r, 500));

  await page.evaluate(() => {
    const labels = Array.from(document.querySelectorAll('label'));
    const php = labels.find(l => l.innerText && l.innerText.trim().toUpperCase() === 'PHP');
    if (php) php.click();
  });

  // 5. Positive keywords (5 tags)
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

  // 6. License disclaimer checkbox
  await page.evaluate(() => {
    const cb = document.querySelector('.category-disclaimer-checkbox input, input[type="checkbox"][name*="license"]');
    if (cb && !cb.checked) cb.click();
  });

  await new Promise(r => setTimeout(r, 1000));
  const shot = path.join(__dirname, 'gig3_step1_configured.png');
  await page.screenshot({ path: shot, fullPage: true });
  console.log('Saved configured shot to:', shot);

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
  console.log('Current URL after Save & Continue:', page.url());

  const afterShot = path.join(__dirname, 'gig3_after_step1.png');
  await page.screenshot({ path: afterShot, fullPage: true });
  console.log('Saved after-save shot to:', afterShot);

  await browser.disconnect();
}

main().catch(console.error);
