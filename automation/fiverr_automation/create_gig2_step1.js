const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const page = (await browser.pages()).find(p => p.url().includes('manage_gigs/new') || p.url().includes('fiverr.com'));

  console.log('Starting Gig 2 on:', page.url());

  // 1. Set Title
  const gigTitle = 'integrate Microsoft Business Central with your webshop CRM or API';
  console.log('Setting title...');
  const titleTextarea = await page.$('textarea[class*="text-body-large"]');
  if (titleTextarea) {
    await titleTextarea.focus();
    await page.keyboard.type(gigTitle, { delay: 10 });
  }

  await new Promise(r => setTimeout(r, 800));

  // 2. Select Category: Programming & Tech
  console.log('Selecting Category...');
  await page.evaluate(() => {
    const selects = Array.from(document.querySelectorAll('.react-select__control'));
    if (selects[0]) selects[0].dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
  });
  await new Promise(r => setTimeout(r, 500));
  await page.evaluate(() => {
    const opts = Array.from(document.querySelectorAll('.react-select__option'));
    const opt = opts.find(o => o.innerText.toLowerCase().includes('programming & tech'));
    if (opt) opt.click();
  });

  await new Promise(r => setTimeout(r, 1000));

  // 3. Select Subcategory: Software Development
  console.log('Selecting Subcategory...');
  await page.evaluate(() => {
    const selects = Array.from(document.querySelectorAll('.react-select__control'));
    if (selects[1]) selects[1].dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
  });
  await new Promise(r => setTimeout(r, 500));
  await page.evaluate(() => {
    const opts = Array.from(document.querySelectorAll('.react-select__option'));
    const opt = opts.find(o => o.innerText.toLowerCase().includes('software development') || o.innerText.toLowerCase().includes('api'));
    if (opt) opt.click();
  });

  await new Promise(r => setTimeout(r, 1000));

  // 4. Tags
  console.log('Adding tags...');
  const tags = ['business central', 'api integration', 'shopify integration', 'woocommerce', 'erp integration'];
  const tagInput = await page.$('.tags-input-element input, input[placeholder*="tags"], input[class*="tag"]');
  if (tagInput) {
    for (const tag of tags) {
      await tagInput.focus();
      await page.keyboard.type(tag, { delay: 15 });
      await page.keyboard.press('Enter');
      await new Promise(r => setTimeout(r, 300));
    }
  }

  await new Promise(r => setTimeout(r, 1000));

  const shotPath = path.join(__dirname, 'gig2_step1_partial.png');
  await page.screenshot({ path: shotPath, fullPage: true });
  console.log('Screenshot saved to:', shotPath);

  await browser.disconnect();
}

main().catch(console.error);
