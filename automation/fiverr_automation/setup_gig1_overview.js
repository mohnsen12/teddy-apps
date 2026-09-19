const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('manage_gigs') || p.url().includes('fiverr.com')) || pages[0];

  // 1. Select Service Type: "CRM & ERP DEVELOPMENT"
  console.log('Selecting Service Type: CRM & ERP DEVELOPMENT...');
  const serviceControls = await page.$$('.category-selector__control, [class*="service-type"] [class*="control"], div[class*="control"]');
  if (serviceControls.length >= 3) {
    await serviceControls[2].click();
    await new Promise(r => setTimeout(r, 600));

    await page.evaluate(() => {
      const opts = Array.from(document.querySelectorAll('[class*="option"]'));
      const crm = opts.find(o => o.innerText.trim().toUpperCase() === 'CRM & ERP DEVELOPMENT');
      if (crm) crm.click();
    });
    await new Promise(r => setTimeout(r, 1000));
  }

  // 2. Select Programming language checkbox: "Other"
  console.log('Selecting Programming Language: Other...');
  await page.evaluate(() => {
    const labels = Array.from(document.querySelectorAll('label, div, span'));
    const otherLabel = labels.find(l => l.innerText && l.innerText.trim() === 'Other');
    if (otherLabel) {
      otherLabel.click();
    }
  });
  await new Promise(r => setTimeout(r, 800));

  // 3. Fill Search Tags (Positive keywords)
  console.log('Filling Search Tags...');
  const tags = ['business central', 'dynamics 365', 'al development', 'erp customization', 'navision'];
  
  // Find tags input
  const tagInput = await page.$('.tags-container input, [class*="tags"] input, [class*="keyword"] input, div[class*="tags"] input, input[type="text"]:not([id*="react-select"])');
  if (tagInput) {
    for (const t of tags) {
      await tagInput.focus();
      await page.keyboard.type(t, { delay: 30 });
      await page.keyboard.press('Enter');
      await new Promise(r => setTimeout(r, 500));
    }
  } else {
    console.log('Finding tag input by position...');
    const allInputs = await page.$$('input[type="text"]');
    const lastInput = allInputs[allInputs.length - 1];
    if (lastInput) {
      for (const t of tags) {
        await lastInput.focus();
        await page.keyboard.type(t, { delay: 30 });
        await page.keyboard.press('Enter');
        await new Promise(r => setTimeout(r, 500));
      }
    }
  }

  await new Promise(r => setTimeout(r, 1500));

  const screenshotPath = path.join(__dirname, 'overview_complete.png');
  await page.screenshot({ path: screenshotPath });
  console.log('Overview complete screenshot saved to:', screenshotPath);

  // 4. Click Save & Continue
  console.log('Clicking Save & Continue...');
  const clickedSave = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const saveBtn = btns.find(b => b.innerText.trim().toLowerCase().includes('save & continue'));
    if (saveBtn && !saveBtn.disabled) {
      saveBtn.scrollIntoView();
      saveBtn.click();
      return true;
    }
    return false;
  });
  console.log('Clicked Save & Continue:', clickedSave);

  await new Promise(r => setTimeout(r, 5000));
  console.log('URL now:', page.url());

  const nextScreenshot = path.join(__dirname, 'step2_pricing_screen.png');
  await page.screenshot({ path: nextScreenshot });
  console.log('Next step screenshot saved to:', nextScreenshot);

  await browser.disconnect();
}

main().catch(console.error);
