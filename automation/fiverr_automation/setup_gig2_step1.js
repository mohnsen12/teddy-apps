const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const pages = await browser.pages();
  const page = (await browser.pages()).find(p => p.url().includes('manage_gigs') || p.url().includes('fiverr.com'));

  console.log('Filling Gig 2 Step 1 on:', page.url());

  // 1. Title
  console.log('Typing title...');
  const titleTa = await page.$('textarea.gig-title-textarea, textarea[placeholder*="do something" i]');
  if (titleTa) {
    await titleTa.focus();
    await page.keyboard.down('Meta');
    await page.keyboard.press('a');
    await page.keyboard.up('Meta');
    await page.keyboard.press('Backspace');
    await titleTa.type('integrate Microsoft Business Central with your webshop CRM or API', { delay: 15 });
  }

  await new Promise(r => setTimeout(r, 1000));

  // 2. Category
  console.log('Selecting Category: Programming & Tech...');
  const catControls = await page.$$('.category-selector__control');
  if (catControls.length > 0) {
    await catControls[0].click();
    await new Promise(r => setTimeout(r, 600));

    await page.evaluate(() => {
      const opts = Array.from(document.querySelectorAll('[class*="option"]'));
      const prog = opts.find(o => o.innerText.trim().toUpperCase() === 'PROGRAMMING & TECH');
      if (prog) prog.click();
    });
    await new Promise(r => setTimeout(r, 1200));
  }

  // 3. Subcategory
  console.log('Selecting Subcategory...');
  const subControls = await page.$$('.category-selector__control');
  if (subControls.length > 1) {
    await subControls[1].click();
    await new Promise(r => setTimeout(r, 600));

    const subName = await page.evaluate(() => {
      const opts = Array.from(document.querySelectorAll('[class*="option"]'));
      // Prefer APIs & Integrations or Software Development
      const choice = opts.find(o => o.innerText.toLowerCase().includes('api') || o.innerText.toLowerCase().includes('integration')) ||
                     opts.find(o => o.innerText.toLowerCase().includes('software development')) ||
                     opts[0];
      if (choice) {
        choice.click();
        return choice.innerText.trim();
      }
      return null;
    });
    console.log('Selected subcategory:', subName);
    await new Promise(r => setTimeout(r, 1200));
  }

  // 4. Tags
  console.log('Adding search tags...');
  const tags = ['business central', 'api integration', 'shopify integration', 'woocommerce', 'erp integration'];
  const allInputs = await page.$$('input[type="text"]');
  const tagInput = allInputs[allInputs.length - 1]; // last text input is the tags input
  if (tagInput) {
    for (const t of tags) {
      await tagInput.focus();
      await page.keyboard.type(t, { delay: 25 });
      await page.keyboard.press('Enter');
      await new Promise(r => setTimeout(r, 400));
    }
  }

  await new Promise(r => setTimeout(r, 1500));

  const shotPath = path.join(__dirname, 'gig2_step1_filled.png');
  await page.screenshot({ path: shotPath, fullPage: true });
  console.log('Screenshot saved to:', shotPath);

  await browser.disconnect();
}

main().catch(console.error);
