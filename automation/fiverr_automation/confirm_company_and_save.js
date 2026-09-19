const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const page = (await browser.pages())[0];

  console.log('Clicking "+ Add Teddy Apps"...');
  await page.evaluate(() => {
    const all = Array.from(document.querySelectorAll('*'));
    const addTeddy = all.find(e => e.innerText && e.innerText.includes('+ Add') && e.innerText.includes('Teddy Apps'));
    if (addTeddy) addTeddy.click();
  });
  await new Promise(r => setTimeout(r, 600));

  console.log('Checking "I currently work here"...');
  await page.evaluate(() => {
    const chk = Array.from(document.querySelectorAll('input[type="checkbox"]')).find(c => {
      return c.parentElement && c.parentElement.innerText && c.parentElement.innerText.includes('currently work');
    });
    if (chk && !chk.checked) chk.click();
  });
  await new Promise(r => setTimeout(r, 600));

  console.log('Clicking Start date input...');
  await page.evaluate(() => {
    const inp = document.querySelector('input[placeholder="Start date"]');
    if (inp) inp.click();
  });
  await new Promise(r => setTimeout(r, 600));

  // In calendar, click previous month button 60 times
  console.log('Clicking previous month 60 times...');
  await page.evaluate(() => {
    const prev = document.querySelector('button[aria-label="Previous month"]');
    if (prev) {
      for (let i = 0; i < 60; i++) prev.click();
    }
  });
  await new Promise(r => setTimeout(r, 600));

  // Click day 1
  console.log('Clicking day 1...');
  await page.evaluate(() => {
    const all = Array.from(document.querySelectorAll('button, td, div')).filter(el => {
      return el.innerText && el.innerText.trim() === '1' && el.children.length === 0;
    });
    if (all.length > 0) all[0].click();
  });
  await new Promise(r => setTimeout(r, 800));

  const shot = path.join(__dirname, 'work_exp_ready_final.png');
  await page.screenshot({ path: shot, fullPage: true });
  console.log('Saved screenshot to:', shot);

  // Click Add button
  const added = await page.evaluate(() => {
    const form = document.querySelector('textarea[placeholder*="job history"]').closest('div[class*="content"], div[class*="section"]') || document.body;
    const addBtns = Array.from(form.querySelectorAll('button')).filter(b => b.innerText.trim().toLowerCase() === 'add');
    if (addBtns.length > 0) {
      const btn = addBtns[addBtns.length - 1];
      if (!btn.disabled) {
        btn.click();
        return true;
      }
    }
    return false;
  });
  console.log('Clicked Add button:', added);

  await new Promise(r => setTimeout(r, 2500));

  const shotAfter = path.join(__dirname, 'work_exp_saved_confirmed.png');
  await page.screenshot({ path: shotAfter, fullPage: true });
  console.log('Saved after shot to:', shotAfter);

  await browser.disconnect();
}

main().catch(console.error);
