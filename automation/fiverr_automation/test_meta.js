const puppeteer = require('puppeteer-core');

async function test() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const page = (await browser.pages())[0];

  const tabs = await page.$$('.metadata-names-list li');
  console.log('Tabs:', tabs.length);

  // Tab 0: Website Type
  await tabs[0].click();
  await new Promise(r => setTimeout(r, 600));
  const wtLabels = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.metadata-options label')).map(l => l.innerText.trim());
  });
  console.log('Website Type labels:\n', wtLabels);

  // Check Portal, Business, E-Commerce store
  await page.evaluate(() => {
    const labels = Array.from(document.querySelectorAll('.metadata-options label'));
    ['Portal', 'Business', 'E-Commerce store'].forEach(name => {
      const match = labels.find(l => l.innerText.trim().toLowerCase() === name.toLowerCase());
      if (match) {
        const inp = match.querySelector('input') || match;
        inp.click();
      }
    });
  });
  await new Promise(r => setTimeout(r, 600));

  // Tab 1: Programming Language
  await tabs[1].click();
  await new Promise(r => setTimeout(r, 600));
  const langLabels = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.metadata-options label')).map(l => l.innerText.trim());
  });
  console.log('Language labels:\n', langLabels);

  // Check PHP
  await page.evaluate(() => {
    const labels = Array.from(document.querySelectorAll('.metadata-options label'));
    const match = labels.find(l => l.innerText.trim().toUpperCase() === 'PHP');
    if (match) {
      const inp = match.querySelector('input') || match;
      inp.click();
    }
  });
  await new Promise(r => setTimeout(r, 600));

  // Tab 2: Website Features
  await tabs[2].click();
  await new Promise(r => setTimeout(r, 600));

  // Check Customer support, Inventory, Analytics, Shipping, Payment
  await page.evaluate(() => {
    const labels = Array.from(document.querySelectorAll('.metadata-options label'));
    ['Customer support', 'Inventory', 'Analytics', 'Shipping', 'Payment', 'Dashboard'].forEach(name => {
      const match = labels.find(l => l.innerText.trim().toLowerCase() === name.toLowerCase());
      if (match) {
        const inp = match.querySelector('input') || match;
        inp.click();
      }
    });
  });
  await new Promise(r => setTimeout(r, 600));

  // Verify status of tabs (checks)
  const tabStatus = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.metadata-names-list li')).map(li => li.innerText.replace(/\n+/g, ' ').trim());
  });
  console.log('Tab statuses:\n', tabStatus);

  // Take screenshot
  await page.screenshot({ path: '/Users/teddy/teddy-apps/automation/fiverr_automation/gig3_meta_checked.png', fullPage: true });

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

  await page.screenshot({ path: '/Users/teddy/teddy-apps/automation/fiverr_automation/gig3_after_meta_saved.png', fullPage: true });

  await browser.disconnect();
}

test().catch(console.error);
