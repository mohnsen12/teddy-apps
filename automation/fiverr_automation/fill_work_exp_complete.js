const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const page = (await browser.pages())[0];

  console.log('Filling Work Experience Title...');
  await page.evaluate(() => {
    const inp = document.querySelector('input[placeholder="Title"]');
    if (inp) {
      inp.focus();
      inp.click();
    }
  });
  await page.keyboard.type('Senior Business Central Developer & Solution Architect');
  await new Promise(r => setTimeout(r, 400));

  console.log('Selecting Employment type: Self-employed...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button, div[role="button"]'));
    const empBtn = btns.find(b => b.innerText && b.innerText.trim().toLowerCase().includes('employment type'));
    if (empBtn) empBtn.click();
  });
  await new Promise(r => setTimeout(r, 600));

  await page.evaluate(() => {
    const options = Array.from(document.querySelectorAll('li, div[role="option"], button, label'));
    const opt = options.find(o => o.innerText && o.innerText.toLowerCase().includes('self-employed')) ||
                options.find(o => o.innerText && o.innerText.toLowerCase().includes('freelance'));
    if (opt) opt.click();
  });
  await new Promise(r => setTimeout(r, 600));

  console.log('Filling Company name: Teddy Apps...');
  await page.evaluate(() => {
    const inp = document.querySelector('input[placeholder="Company name"]');
    if (inp) {
      inp.focus();
      inp.click();
    }
  });
  await page.keyboard.type('Teddy Apps');
  await new Promise(r => setTimeout(r, 400));

  console.log('Checking "I currently work here"...');
  await page.evaluate(() => {
    const chk = Array.from(document.querySelectorAll('input[type="checkbox"]')).find(c => {
      return c.parentElement && c.parentElement.innerText && c.parentElement.innerText.includes('currently work');
    });
    if (chk && !chk.checked) chk.click();
  });
  await new Promise(r => setTimeout(r, 600));

  console.log('Filling Description...');
  await page.evaluate(() => {
    const txt = document.querySelector('textarea[placeholder*="job history"]');
    if (txt) {
      txt.focus();
      txt.click();
    }
  });
  const desc = "Specialist in Microsoft Dynamics 365 Business Central, custom AL extensions, automated workflows, ERP integrations (Shopify, WooCommerce, CRM, REST APIs), and B2B portals. Over 5 years of experience delivering robust, maintainable cloud solutions.";
  await page.keyboard.type(desc);
  await new Promise(r => setTimeout(r, 600));

  // Now click Start date input to open datepicker
  console.log('Opening Start date picker...');
  await page.evaluate(() => {
    const inp = document.querySelector('input[placeholder="Start date"]');
    if (inp) inp.click();
  });
  await new Promise(r => setTimeout(r, 800));

  // Click previous month button ~60 times to go back 5 years
  await page.evaluate(() => {
    const prev = document.querySelector('button[aria-label="Previous month"]');
    if (prev) {
      for (let i = 0; i < 60; i++) {
        prev.click();
      }
    }
  });
  await new Promise(r => setTimeout(r, 600));

  // Click a day cell
  await page.evaluate(() => {
    const days = Array.from(document.querySelectorAll('button, td, div')).filter(el => {
      const t = el.innerText && el.innerText.trim();
      return (t === '1' || t === '15') && el.children.length === 0;
    });
    // Click the one closest to calendar or last one
    if (days.length > 0) days[0].click();
  });
  await new Promise(r => setTimeout(r, 800));

  const shot = path.join(__dirname, 'work_exp_ready_to_add.png');
  await page.screenshot({ path: shot, fullPage: true });
  console.log('Saved screenshot before Add to:', shot);

  // Click Add button in Work Experience form
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

  const finalShot = path.join(__dirname, 'work_exp_after_add.png');
  await page.screenshot({ path: finalShot, fullPage: true });
  console.log('Saved final screenshot to:', finalShot);

  await browser.disconnect();
}

main().catch(console.error);
