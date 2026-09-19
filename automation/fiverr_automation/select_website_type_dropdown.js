const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const page = (await browser.pages())[0];

  console.log('Inspecting Website Type dropdown on:', page.url());

  // Click CHOOSE ... dropdown
  const dropdownTrigger = await page.$('.metadata-options [class*="control"], .metadata-options select, .metadata-options button, .metadata-options .select-penta-design-content, .metadata-options [class*="select"]');
  console.log('Trigger found:', !!dropdownTrigger);

  if (dropdownTrigger) {
    await dropdownTrigger.click();
  } else {
    // Try clicking by text CHOOSE
    await page.evaluate(() => {
      const all = Array.from(document.querySelectorAll('.metadata-options *'));
      const choose = all.find(e => e.innerText && e.innerText.includes('CHOOSE'));
      if (choose) choose.click();
    });
  }
  await new Promise(r => setTimeout(r, 600));

  // Print all options
  const options = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('[class*="option"], aside button, select option')).map(o => o.innerText.trim());
  });
  console.log('Dropdown options:\n', options);

  // Select Portal or Business or E-Commerce
  const selected = await page.evaluate(() => {
    const opts = Array.from(document.querySelectorAll('[class*="option"], aside button, select option'));
    const match = opts.find(o => o.innerText.trim().toUpperCase() === 'PORTAL') ||
                  opts.find(o => o.innerText.trim().toUpperCase().includes('PORTAL')) ||
                  opts.find(o => o.innerText.trim().toUpperCase().includes('BUSINESS')) ||
                  opts[0];
    if (match) {
      match.click();
      return match.innerText.trim();
    }
    return null;
  });
  console.log('Selected option:', selected);

  await new Promise(r => setTimeout(r, 1000));

  const shot = path.join(__dirname, 'website_type_selected.png');
  await page.screenshot({ path: shot, fullPage: true });
  console.log('Saved shot to:', shot);

  // Save & Continue
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

  const afterShot = path.join(__dirname, 'gig3_pricing_active.png');
  await page.screenshot({ path: afterShot, fullPage: true });
  console.log('Saved after shot to:', afterShot);

  await browser.disconnect();
}

main().catch(console.error);
