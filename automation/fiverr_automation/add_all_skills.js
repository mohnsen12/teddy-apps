const puppeteer = require('puppeteer-core');
const path = require('path');

async function addSkill(page, skillSearch) {
  console.log(`Adding skill: ${skillSearch}...`);
  // Find the skill input
  const input = await page.$('input[placeholder*="Add skill" i], [class*="ja73c14"] input');
  if (!input) {
    // Maybe we need to click "+ Add new"
    const addNew = await page.evaluate(() => {
      const all = Array.from(document.querySelectorAll('*'));
      const el = all.find(e => e.innerText && e.innerText.trim() === '+ Add new' && e.children.length === 0);
      if (el) { el.click(); return true; }
      return false;
    });
    console.log('Clicked "+ Add new":', addNew);
    await new Promise(r => setTimeout(r, 600));
  }

  const activeInput = await page.$('input[placeholder*="Add skill" i]');
  if (!activeInput) {
    console.log('Cannot find active skill input');
    return false;
  }

  await activeInput.focus();
  await page.keyboard.down('Meta');
  await page.keyboard.press('a');
  await page.keyboard.up('Meta');
  await page.keyboard.press('Backspace');
  await activeInput.type(skillSearch, { delay: 40 });
  await new Promise(r => setTimeout(r, 800));

  // Click first matching option
  const matched = await page.evaluate(() => {
    const options = Array.from(document.querySelectorAll('li, [role="option"]'));
    const visible = options.filter(o => o.offsetParent !== null && o.innerText.trim());
    if (visible.length > 0) {
      visible[0].click();
      return visible[0].innerText.trim();
    }
    return null;
  });
  console.log('Selected option:', matched);
  await new Promise(r => setTimeout(r, 600));

  // Click Experience level dropdown
  await page.evaluate(() => {
    const divs = Array.from(document.querySelectorAll('div, span, button')).filter(el => {
      return el.innerText && el.innerText.includes('Experience level');
    });
    if (divs.length > 0) divs[divs.length - 1].click();
  });
  await new Promise(r => setTimeout(r, 600));

  // Click "Pro"
  await page.evaluate(() => {
    const items = Array.from(document.querySelectorAll('*')).filter(el => el.innerText && el.innerText.trim() === 'Pro' && el.children.length === 0);
    if (items.length > 0) items[0].click();
  });
  await new Promise(r => setTimeout(r, 600));

  // Click "Add"
  const added = await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.trim() === 'Add');
    if (btn && !btn.disabled) {
      btn.click();
      return true;
    }
    return false;
  });
  console.log('Clicked Add:', added);
  await new Promise(r => setTimeout(r, 1200));
}

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('seller_onboarding') || p.url().includes('fiverr.com')) || pages[0];

  const list = ['API Integration', 'ERP', 'Automation', 'PHP', 'E-Commerce'];
  for (const s of list) {
    await addSkill(page, s);
  }

  const screenshotPath = path.join(__dirname, 'current_screen.png');
  await page.screenshot({ path: screenshotPath });
  console.log('Screenshot saved to:', screenshotPath);

  await browser.disconnect();
}

main().catch(console.error);
