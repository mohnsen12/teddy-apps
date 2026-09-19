const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('manage_gigs') || p.url().includes('fiverr.com')) || pages[0];

  // 1. Fill title
  const titleTa = await page.$('textarea[placeholder*="do something" i]');
  if (titleTa) {
    await titleTa.focus();
    await page.keyboard.down('Meta');
    await page.keyboard.press('a');
    await page.keyboard.up('Meta');
    await page.keyboard.press('Backspace');
    await titleTa.type('develop a custom Microsoft Dynamics 365 Business Central extension', { delay: 15 });
    console.log('Title typed');
  }

  // 2. Click category control
  const categoryControls = await page.$$('.category-selector__control');
  if (categoryControls.length > 0) {
    console.log('Clicking category selector...');
    await categoryControls[0].click();
    await new Promise(r => setTimeout(r, 600));

    // Look for options in .category-selector__menu or [class*="option"]
    const options = await page.evaluate(() => {
      const opts = Array.from(document.querySelectorAll('[class*="option"]'));
      return opts.map(o => o.innerText.trim());
    });
    console.log('Category options available:', options);

    // Click "Programming & Tech" option
    const clickedOpt = await page.evaluate(() => {
      const opts = Array.from(document.querySelectorAll('[class*="option"]'));
      const prog = opts.find(o => o.innerText.trim() === 'Programming & Tech');
      if (prog) {
        prog.click();
        return true;
      }
      return false;
    });
    console.log('Clicked "Programming & Tech":', clickedOpt);
    await new Promise(r => setTimeout(r, 1000));
  }

  // 3. Click subcategory control
  const subControls = await page.$$('.category-selector__control');
  if (subControls.length > 1) {
    console.log('Clicking subcategory selector...');
    await subControls[1].click();
    await new Promise(r => setTimeout(r, 600));

    // Look for subcategory options
    const subOptions = await page.evaluate(() => {
      const opts = Array.from(document.querySelectorAll('[class*="option"]'));
      return opts.map(o => o.innerText.trim());
    });
    console.log('Subcategory options available:', subOptions);

    // Click "Software Development" or best match
    const clickedSub = await page.evaluate(() => {
      const opts = Array.from(document.querySelectorAll('[class*="option"]'));
      const dev = opts.find(o => o.innerText.trim() === 'Software Development') ||
                  opts.find(o => o.innerText.trim().includes('Software')) ||
                  opts[0];
      if (dev) {
        dev.click();
        return dev.innerText.trim();
      }
      return null;
    });
    console.log('Clicked subcategory:', clickedSub);
  }

  await new Promise(r => setTimeout(r, 1500));

  const screenshotPath = path.join(__dirname, 'category_selected.png');
  await page.screenshot({ path: screenshotPath });
  console.log('Screenshot saved to:', screenshotPath);

  await browser.disconnect();
}

main().catch(console.error);
