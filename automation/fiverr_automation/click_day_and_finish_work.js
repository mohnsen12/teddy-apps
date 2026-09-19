const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const page = (await browser.pages())[0];

  console.log('Clicking day 15 in calendar...');
  await page.evaluate(() => {
    const all = Array.from(document.querySelectorAll('*'));
    // Find calendar container
    const cal = all.find(e => e.innerText && e.innerText.includes('September 2021') && e.children.length > 5);
    if (cal) {
      const items = Array.from(cal.querySelectorAll('*'));
      const d15 = items.find(el => el.children.length === 0 && el.innerText && el.innerText.trim() === '15');
      if (d15) d15.click();
    }
  });

  await new Promise(r => setTimeout(r, 600));

  console.log('Clicking "+ Add Teddy Apps"...');
  await page.evaluate(() => {
    const all = Array.from(document.querySelectorAll('*'));
    const addTeddy = all.find(e => e.innerText && e.innerText.includes('+ Add') && e.innerText.includes('Teddy Apps'));
    if (addTeddy) addTeddy.click();
  });

  await new Promise(r => setTimeout(r, 600));

  console.log('Ensuring "I currently work here" is checked...');
  await page.evaluate(() => {
    const chk = Array.from(document.querySelectorAll('input[type="checkbox"]')).find(c => {
      return c.parentElement && c.parentElement.innerText && c.parentElement.innerText.includes('currently work');
    });
    if (chk && !chk.checked) chk.click();
  });

  await new Promise(r => setTimeout(r, 600));

  const shot = path.join(__dirname, 'work_exp_ready_now.png');
  await page.screenshot({ path: shot, fullPage: true });
  console.log('Saved screenshot to:', shot);

  console.log('Checking Add button state...');
  const addBtnInfo = await page.evaluate(() => {
    const form = document.querySelector('textarea[placeholder*="job history"]').closest('div[class*="content"], div[class*="section"]') || document.body;
    const addBtns = Array.from(form.querySelectorAll('button')).filter(b => b.innerText.trim().toLowerCase() === 'add');
    if (addBtns.length > 0) {
      const b = addBtns[addBtns.length - 1];
      return {
        disabled: b.disabled,
        className: b.className,
        text: b.innerText
      };
    }
    return null;
  });
  console.log('Add button info:', addBtnInfo);

  if (addBtnInfo && !addBtnInfo.disabled) {
    console.log('Clicking Add button!');
    await page.evaluate(() => {
      const form = document.querySelector('textarea[placeholder*="job history"]').closest('div[class*="content"], div[class*="section"]') || document.body;
      const addBtns = Array.from(form.querySelectorAll('button')).filter(b => b.innerText.trim().toLowerCase() === 'add');
      const b = addBtns[addBtns.length - 1];
      b.click();
    });
    await new Promise(r => setTimeout(r, 2500));
  }

  const finalShot = path.join(__dirname, 'work_exp_final_saved.png');
  await page.screenshot({ path: finalShot, fullPage: true });
  console.log('Saved final screenshot to:', finalShot);

  await browser.disconnect();
}

main().catch(console.error);
