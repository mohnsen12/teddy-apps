const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('seller_onboarding') || p.url().includes('fiverr.com')) || pages[0];

  // 1. Clear and type "Microsoft Dynamics"
  const input = await page.$('input[placeholder*="Add skill" i]');
  if (input) {
    await input.click({ clickCount: 3 });
    await page.keyboard.press('Backspace');
    await input.type('Microsoft Dynamics', { delay: 40 });
    await new Promise(r => setTimeout(r, 1000));
  }

  // 2. Click "Microsoft Dynamics" from the autocomplete menu
  const itemClicked = await page.evaluate(() => {
    const items = Array.from(document.querySelectorAll('li, [role="option"], div')).filter(el => {
      return el.innerText && el.innerText.trim() === 'Microsoft Dynamics' && el.children.length === 0;
    });
    if (items.length > 0) {
      items[0].click();
      return true;
    }
    return false;
  });
  console.log('Clicked autocomplete item:', itemClicked);

  await new Promise(r => setTimeout(r, 1000));

  // 3. Click Experience Level dropdown
  const levelOpened = await page.evaluate(() => {
    const divs = Array.from(document.querySelectorAll('div, span, button')).filter(el => {
      return el.innerText && el.innerText.includes('Experience level');
    });
    if (divs.length > 0) {
      divs[divs.length - 1].click();
      return true;
    }
    return false;
  });
  console.log('Level opened:', levelOpened);
  await new Promise(r => setTimeout(r, 800));

  // 4. Click "Expert"
  const expertClicked = await page.evaluate(() => {
    const items = Array.from(document.querySelectorAll('li, [role="option"], div, span')).filter(el => {
      return el.innerText && el.innerText.trim().toLowerCase() === 'expert';
    });
    if (items.length > 0) {
      items[items.length - 1].click();
      return true;
    }
    return false;
  });
  console.log('Expert selected:', expertClicked);
  await new Promise(r => setTimeout(r, 800));

  // 5. Click "Add" button
  const addClicked = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const btn = buttons.find(b => b.innerText.trim() === 'Add');
    if (btn) {
      btn.click();
      return true;
    }
    return false;
  });
  console.log('Add clicked:', addClicked);

  await new Promise(r => setTimeout(r, 1500));

  const screenshotPath = path.join(__dirname, 'current_screen.png');
  await page.screenshot({ path: screenshotPath });
  console.log('Screenshot saved to:', screenshotPath);

  await browser.disconnect();
}

main().catch(console.error);
