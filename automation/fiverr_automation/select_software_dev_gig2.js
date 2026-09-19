const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const page = (await browser.pages()).find(p => p.url().includes('manage_gigs') || p.url().includes('fiverr.com'));

  console.log('Selecting Software Development for Gig 2...');
  const subControls = await page.$$('.category-selector__control');
  if (subControls.length > 1) {
    await subControls[1].click();
    await new Promise(r => setTimeout(r, 600));

    await page.evaluate(() => {
      const opts = Array.from(document.querySelectorAll('[class*="option"]'));
      const soft = opts.find(o => o.innerText.trim().toUpperCase() === 'SOFTWARE DEVELOPMENT');
      if (soft) soft.click();
    });
    await new Promise(r => setTimeout(r, 1200));
  }

  // Check service type options
  const serviceControls = await page.$$('.category-selector__control');
  if (serviceControls.length >= 3) {
    await serviceControls[2].click();
    await new Promise(r => setTimeout(r, 600));

    const serviceTypes = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('[class*="option"]')).map(o => o.innerText.trim());
    });
    console.log('Service Types under Software Development:\n', serviceTypes);

    // Pick CRM & ERP DEVELOPMENT or API INTEGRATION
    await page.evaluate(() => {
      const opts = Array.from(document.querySelectorAll('[class*="option"]'));
      const choice = opts.find(o => o.innerText.toLowerCase().includes('crm & erp')) ||
                     opts.find(o => o.innerText.toLowerCase().includes('api')) ||
                     opts[0];
      if (choice) choice.click();
    });
    await new Promise(r => setTimeout(r, 1000));
  }

  // Check metadata tabs/boxes (Programming Language, Platforms)
  console.log('Configuring metadata...');
  // Select Other for Platform or Microsoft Dynamics 365
  await page.evaluate(() => {
    const radios = Array.from(document.querySelectorAll('.meta-suggest-other input[type="radio"], input[type="radio"]'));
    if (radios.length > 0) radios[0].click();
  });
  await new Promise(r => setTimeout(r, 500));

  const otherInput = await page.$('.metadata-container input[type="text"], input[class*="00cb28"]');
  if (otherInput) {
    await otherInput.focus();
    await page.keyboard.type('Microsoft Dynamics 365', { delay: 20 });
  }

  // Programming language: select C# / .NET
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

  // Tags
  console.log('Adding tags...');
  const tags = ['business central', 'api integration', 'shopify integration', 'woocommerce', 'erp integration'];
  const tagInput = await page.$('.react-tags__search-input input');
  if (tagInput) {
    for (const t of tags) {
      await tagInput.focus();
      await page.keyboard.type(t, { delay: 20 });
      await page.keyboard.press('Enter');
      await new Promise(r => setTimeout(r, 300));
    }
  }

  // Disclaimer checkbox if visible
  await page.evaluate(() => {
    const cb = document.querySelector('.category-disclaimer-checkbox input, input[type="checkbox"][name*="license"]');
    if (cb && !cb.checked) cb.click();
  });

  await new Promise(r => setTimeout(r, 1500));

  const shotPath = path.join(__dirname, 'gig2_step1_ready.png');
  await page.screenshot({ path: shotPath, fullPage: true });
  console.log('Screenshot saved to:', shotPath);

  await browser.disconnect();
}

main().catch(console.error);
