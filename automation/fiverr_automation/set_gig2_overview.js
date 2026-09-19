const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const page = (await browser.pages())[0];

  console.log('Inspecting subcategory dropdown on:', page.url());

  const subControls = await page.$$('.category-selector__control');
  console.log('Category controls found:', subControls.length);

  // 1. Click subcategory dropdown (index 1)
  if (subControls.length > 1) {
    await subControls[1].click();
    await new Promise(r => setTimeout(r, 600));

    const subOpts = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('[class*="option"]')).map(o => o.innerText.trim());
    });
    console.log('Available Subcategories:', subOpts);

    // Look for Software Development
    await page.evaluate(() => {
      const opts = Array.from(document.querySelectorAll('[class*="option"]'));
      const target = opts.find(o => o.innerText.trim().toUpperCase() === 'SOFTWARE DEVELOPMENT') ||
                     opts.find(o => o.innerText.trim().toUpperCase().includes('SOFTWARE'));
      if (target) {
        console.log('Clicking subcategory:', target.innerText);
        target.click();
      }
    });
    await new Promise(r => setTimeout(r, 1200));
  }

  // 2. Click Service Type dropdown (index 2)
  const afterSubControls = await page.$$('.category-selector__control');
  if (afterSubControls.length >= 3) {
    await afterSubControls[2].click();
    await new Promise(r => setTimeout(r, 600));

    const sTypes = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('[class*="option"]')).map(o => o.innerText.trim());
    });
    console.log('Available Service Types:', sTypes);

    await page.evaluate(() => {
      const opts = Array.from(document.querySelectorAll('[class*="option"]'));
      const target = opts.find(o => o.innerText.toLowerCase().includes('api')) ||
                     opts.find(o => o.innerText.toLowerCase().includes('crm & erp')) ||
                     opts[0];
      if (target) {
        console.log('Clicking service type:', target.innerText);
        target.click();
      }
    });
    await new Promise(r => setTimeout(r, 1200));
  }

  // 3. Configure metadata
  console.log('Checking platform metadata...');
  await page.evaluate(() => {
    const labels = Array.from(document.querySelectorAll('label'));
    const msDyn = labels.find(l => l.innerText && l.innerText.includes('Microsoft Dynamics'));
    if (msDyn) {
      msDyn.click();
      return;
    }
    const otherRadio = document.querySelector('.meta-suggest-other input[type="radio"], input[type="radio"]');
    if (otherRadio) otherRadio.click();
  });
  await new Promise(r => setTimeout(r, 500));

  const textInput = await page.$('.metadata-container input[type="text"], .meta-suggest-other input[type="text"], input[class*="00cb28"]');
  if (textInput) {
    await textInput.focus();
    await page.evaluate(el => { el.value = ''; }, textInput);
    await page.keyboard.type('Microsoft Dynamics 365', { delay: 20 });
    await textInput.evaluate(el => el.dispatchEvent(new Event('change', { bubbles: true })));
  }

  // Check programming language tab if present
  await page.evaluate(() => {
    const tabs = Array.from(document.querySelectorAll('.metadata-names-list li, [class*="metadata"] li'));
    const langTab = tabs.find(t => t.innerText && t.innerText.toLowerCase().includes('programming language'));
    if (langTab) langTab.click();
  });
  await new Promise(r => setTimeout(r, 500));

  await page.evaluate(() => {
    const labels = Array.from(document.querySelectorAll('label'));
    const cs = labels.find(l => l.innerText && l.innerText.trim() === 'C#');
    if (cs) cs.click();
    const net = labels.find(l => l.innerText && l.innerText.trim() === '.NET Framework');
    if (net) net.click();
  });

  // Ensure license checkbox is checked
  await page.evaluate(() => {
    const cb = document.querySelector('.category-disclaimer-checkbox input, input[type="checkbox"][name*="license"]');
    if (cb && !cb.checked) cb.click();
  });

  await new Promise(r => setTimeout(r, 1000));
  const shotPath = path.join(__dirname, 'gig2_step1_configured.png');
  await page.screenshot({ path: shotPath, fullPage: true });
  console.log('Saved screenshot to:', shotPath);

  // Click Save & Continue
  console.log('Clicking Save & Continue...');
  const clickedSave = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const save = buttons.find(b => b.innerText.trim() === 'Save & Continue' || b.innerText.includes('Save & Continue'));
    if (save) {
      save.click();
      return true;
    }
    return false;
  });
  console.log('Clicked Save & Continue:', clickedSave);

  // Wait for navigation or tab change
  await new Promise(r => setTimeout(r, 3000));
  console.log('Current URL after Save & Continue:', page.url());

  const afterShot = path.join(__dirname, 'gig2_after_step1.png');
  await page.screenshot({ path: afterShot, fullPage: true });
  console.log('Saved after-save screenshot to:', afterShot);

  await browser.disconnect();
}

main().catch(console.error);
