const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('manage_gigs') || p.url().includes('fiverr.com')) || pages[0];

  // 1. Under PLATFORMS, click the "Other" radio button or label
  console.log('Selecting Other under Platforms...');
  const platformOther = await page.evaluate(() => {
    const labels = Array.from(document.querySelectorAll('label, span, div'));
    const other = labels.find(l => l.innerText && l.innerText.trim() === 'Other');
    if (other) {
      other.click();
      return 'Clicked Other';
    }
    return 'Not found';
  });
  console.log('Platform Other:', platformOther);
  await new Promise(r => setTimeout(r, 600));

  // 2. Click PROGRAMMING LANGUAGE tab (tab LI)
  console.log('Clicking PROGRAMMING LANGUAGE tab...');
  const langTab = await page.evaluate(() => {
    const lis = Array.from(document.querySelectorAll('li'));
    const target = lis.find(l => l.innerText && l.innerText.includes('PROGRAMMING LANGUAGE'));
    if (target) {
      target.click();
      return 'Clicked tab';
    }
    return 'Not found';
  });
  console.log('Lang tab click:', langTab);
  await new Promise(r => setTimeout(r, 1000));

  // 3. Under PROGRAMMING LANGUAGE, check "Other" (or AL / C++)
  console.log('Selecting Other under Programming Language...');
  const langOther = await page.evaluate(() => {
    const labels = Array.from(document.querySelectorAll('label, span, div'));
    const other = labels.find(l => l.innerText && l.innerText.trim() === 'Other');
    if (other) {
      other.click();
      return 'Clicked Other lang';
    }
    return 'Not found';
  });
  console.log('Lang Other:', langOther);
  await new Promise(r => setTimeout(r, 1000));

  const screenshotPath = path.join(__dirname, 'metadata_set.png');
  await page.screenshot({ path: screenshotPath });
  console.log('Screenshot saved to:', screenshotPath);

  // 4. Click Save & Continue
  console.log('Clicking Save & Continue...');
  const saved = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const saveBtn = btns.find(b => b.innerText.trim().toLowerCase().includes('save & continue'));
    if (saveBtn) {
      saveBtn.scrollIntoView();
      saveBtn.click();
      return true;
    }
    return false;
  });
  console.log('Save & Continue clicked:', saved);

  await new Promise(r => setTimeout(r, 4000));
  console.log('URL after save:', page.url());

  const nextPath = path.join(__dirname, 'after_step1_save.png');
  await page.screenshot({ path: nextPath });
  console.log('Next step screenshot saved to:', nextPath);

  await browser.disconnect();
}

main().catch(console.error);
