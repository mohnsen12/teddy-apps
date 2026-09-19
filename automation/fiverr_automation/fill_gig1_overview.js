const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('manage_gigs') || p.url().includes('fiverr.com')) || pages[0];

  // 1. Fill Gig Title
  console.log('Filling Gig Title...');
  const titleTa = await page.$('textarea[placeholder*="do something" i]');
  if (titleTa) {
    await titleTa.focus();
    await page.keyboard.down('Meta');
    await page.keyboard.press('a');
    await page.keyboard.up('Meta');
    await page.keyboard.press('Backspace');
    await titleTa.type('develop a custom Microsoft Dynamics 365 Business Central extension', { delay: 15 });
  }

  await new Promise(r => setTimeout(r, 1000));

  // 2. Select Category: "Programming & Tech"
  console.log('Selecting Category...');
  await page.evaluate(() => {
    const divs = Array.from(document.querySelectorAll('*'));
    const cat = divs.find(d => d.innerText && d.innerText.trim() === 'SELECT A CATEGORY');
    if (cat) cat.click();
  });
  await new Promise(r => setTimeout(r, 800));

  // Click Programming & Tech
  await page.evaluate(() => {
    const items = Array.from(document.querySelectorAll('*'));
    const prog = items.find(el => el.innerText && el.innerText.trim() === 'Programming & Tech' && el.children.length === 0);
    if (prog) prog.click();
  });
  await new Promise(r => setTimeout(r, 1000));

  // 3. Select Subcategory: "Software Development"
  console.log('Selecting Subcategory...');
  await page.evaluate(() => {
    const divs = Array.from(document.querySelectorAll('*'));
    const sub = divs.find(d => d.innerText && d.innerText.trim() === 'SELECT A SUBCATEGORY');
    if (sub) sub.click();
  });
  await new Promise(r => setTimeout(r, 800));

  // Click Software Development
  await page.evaluate(() => {
    const items = Array.from(document.querySelectorAll('*'));
    const dev = items.find(el => el.innerText && el.innerText.trim() === 'Software Development' && el.children.length === 0);
    if (dev) dev.click();
  });
  await new Promise(r => setTimeout(r, 1000));

  // 4. Fill Search Tags (Keywords)
  console.log('Filling Search Tags...');
  const tags = ['business central', 'dynamics 365', 'al development', 'erp customization', 'navision'];
  // Find the tag input inside positive keywords area
  const tagInput = await page.$('div:has(> input) input[type="text"], input[id*="react-select"], input:not([type="checkbox"])');
  // Or find input near "Positive keywords"
  const tagInputHandle = await page.evaluateHandle(() => {
    const inputs = Array.from(document.querySelectorAll('input[type="text"]'));
    return inputs[inputs.length - 1]; // Usually the tags input
  });

  if (tagInputHandle) {
    for (const t of tags) {
      await tagInputHandle.focus();
      await page.keyboard.type(t, { delay: 20 });
      await page.keyboard.press('Enter');
      await new Promise(r => setTimeout(r, 500));
    }
  }

  await new Promise(r => setTimeout(r, 1500));

  const screenshotPath = path.join(__dirname, 'gig1_overview_filled.png');
  await page.screenshot({ path: screenshotPath });
  console.log('Screenshot saved to:', screenshotPath);

  await browser.disconnect();
}

main().catch(console.error);
