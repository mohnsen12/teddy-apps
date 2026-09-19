const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('manage_gigs') || p.url().includes('fiverr.com')) || pages[0];

  // 1. Click Category selector
  const catControls = await page.$$('.category-selector__control');
  if (catControls.length > 0) {
    await catControls[0].click();
    await new Promise(r => setTimeout(r, 600));

    // Click "PROGRAMMING & TECH"
    const clickedCat = await page.evaluate(() => {
      const opts = Array.from(document.querySelectorAll('[class*="option"]'));
      const prog = opts.find(o => o.innerText.trim().toUpperCase() === 'PROGRAMMING & TECH');
      if (prog) {
        prog.click();
        return prog.innerText.trim();
      }
      return null;
    });
    console.log('Selected Category:', clickedCat);
    await new Promise(r => setTimeout(r, 1200));
  }

  // 2. Click Subcategory selector
  const subControls = await page.$$('.category-selector__control');
  if (subControls.length > 1) {
    await subControls[1].click();
    await new Promise(r => setTimeout(r, 600));

    const subOptions = await page.evaluate(() => {
      const opts = Array.from(document.querySelectorAll('[class*="option"]'));
      return opts.map(o => o.innerText.trim());
    });
    console.log('Subcategories under Programming & Tech:\n', subOptions);

    // Pick "Software Development" or "Support & IT" or "Web Development"
    const picked = await page.evaluate(() => {
      const opts = Array.from(document.querySelectorAll('[class*="option"]'));
      const choice = opts.find(o => o.innerText.toLowerCase().includes('software development')) ||
                     opts.find(o => o.innerText.toLowerCase().includes('software')) ||
                     opts.find(o => o.innerText.toLowerCase().includes('erp')) ||
                     opts[0];
      if (choice) {
        choice.click();
        return choice.innerText.trim();
      }
      return null;
    });
    console.log('Picked Subcategory:', picked);
  }

  await new Promise(r => setTimeout(r, 1500));

  const screenshotPath = path.join(__dirname, 'subcat_selected.png');
  await page.screenshot({ path: screenshotPath });
  console.log('Screenshot saved to:', screenshotPath);

  await browser.disconnect();
}

main().catch(console.error);
