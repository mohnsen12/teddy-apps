const puppeteer = require('puppeteer-core');
const path = require('path');

async function addOne(page, skillSearch) {
  console.log('=== Adding:', skillSearch);

  // 1. Click "+ Add new"
  const clickedAddNew = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const btn = buttons.find(b => b.innerText.includes('Add new'));
    if (btn) {
      btn.scrollIntoView();
      btn.click();
      return true;
    }
    return false;
  });
  console.log('Clicked + Add new:', clickedAddNew);
  await new Promise(r => setTimeout(r, 1000));

  // 2. Type into input
  const input = await page.$('input[placeholder*="Add skill" i]');
  if (!input) {
    console.log('No input found for skill');
    return false;
  }
  await input.focus();
  await page.keyboard.down('Meta');
  await page.keyboard.press('a');
  await page.keyboard.up('Meta');
  await page.keyboard.press('Backspace');
  await input.type(skillSearch, { delay: 40 });
  await new Promise(r => setTimeout(r, 1000));

  // 3. Click first autocomplete suggestion
  const optionClicked = await page.evaluate(() => {
    const options = Array.from(document.querySelectorAll('li, [role="option"]'));
    const visible = options.filter(o => o.offsetParent !== null && o.innerText.trim());
    if (visible.length > 0) {
      visible[0].click();
      return visible[0].innerText.trim();
    }
    return null;
  });
  console.log('Selected option:', optionClicked);
  await new Promise(r => setTimeout(r, 800));

  // 4. Click Experience level dropdown
  await page.evaluate(() => {
    const divs = Array.from(document.querySelectorAll('div, span, button')).filter(el => {
      return el.innerText && el.innerText.includes('Experience level');
    });
    if (divs.length > 0) divs[divs.length - 1].click();
  });
  await new Promise(r => setTimeout(r, 600));

  // 5. Click "Pro"
  await page.evaluate(() => {
    const items = Array.from(document.querySelectorAll('*')).filter(el => el.innerText && el.innerText.trim() === 'Pro' && el.children.length === 0);
    if (items.length > 0) items[0].click();
  });
  await new Promise(r => setTimeout(r, 600));

  // 6. Click "Add"
  const added = await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.trim() === 'Add');
    if (btn && !btn.disabled) {
      btn.click();
      return true;
    }
    return false;
  });
  console.log('Added:', added);
  await new Promise(r => setTimeout(r, 1500));
}

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('seller_onboarding') || p.url().includes('fiverr.com')) || pages[0];

  const skills = ['API', 'ERP', 'Automation', 'PHP', 'E-commerce'];
  for (const s of skills) {
    await addOne(page, s);
  }

  const screenshotPath = path.join(__dirname, 'current_screen.png');
  await page.screenshot({ path: screenshotPath });
  console.log('Screenshot saved to:', screenshotPath);

  await browser.disconnect();
}

main().catch(console.error);
