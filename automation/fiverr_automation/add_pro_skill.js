const puppeteer = require('puppeteer-core');
const path = require('path');

async function selectSkill(page, skillSearch, skillExactMatch) {
  console.log(`Selecting skill: ${skillSearch} -> ${skillExactMatch}`);
  
  // Focus the input
  const input = await page.$('input[placeholder*="Add skill" i]');
  if (!input) {
    console.log('No skill input found');
    return false;
  }
  await input.focus();
  await page.keyboard.down('Meta');
  await page.keyboard.press('a');
  await page.keyboard.up('Meta');
  await page.keyboard.press('Backspace');
  await new Promise(r => setTimeout(r, 200));

  await input.type(skillSearch, { delay: 40 });
  await new Promise(r => setTimeout(r, 800));

  // Click matching item from the suggestion list
  const clickedMatch = await page.evaluate((matchText) => {
    const all = Array.from(document.querySelectorAll('*'));
    // Find leaf element with matchText
    const found = all.find(el => el.innerText && el.innerText.trim().toLowerCase() === matchText.toLowerCase() && el.children.length === 0);
    if (found) {
      found.click();
      return true;
    }
    // Fallback: first item in the list
    const firstOption = all.find(el => el.getAttribute('role') === 'option' || (el.className && el.className.includes('suggestion')));
    if (firstOption) {
      firstOption.click();
      return true;
    }
    return false;
  }, skillExactMatch);
  console.log('Clicked match in list:', clickedMatch);
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
  const proClicked = await page.evaluate(() => {
    const items = Array.from(document.querySelectorAll('*')).filter(el => el.innerText && el.innerText.trim() === 'Pro' && el.children.length === 0);
    if (items.length > 0) {
      items[0].click();
      return true;
    }
    return false;
  });
  console.log('Clicked Pro:', proClicked);
  await new Promise(r => setTimeout(r, 600));

  // Click Add
  const addClicked = await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.trim() === 'Add');
    if (btn && !btn.disabled) {
      btn.click();
      return true;
    }
    return false;
  });
  console.log('Clicked Add:', addClicked);
  await new Promise(r => setTimeout(r, 1000));
  return addClicked;
}

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('seller_onboarding') || p.url().includes('fiverr.com')) || pages[0];

  // Let's add Microsoft Dynamics first
  await selectSkill(page, 'Microsoft Dynamics', 'Microsoft Dynamics');

  const screenshotPath = path.join(__dirname, 'current_screen.png');
  await page.screenshot({ path: screenshotPath });
  console.log('Screenshot saved to:', screenshotPath);

  await browser.disconnect();
}

main().catch(console.error);
