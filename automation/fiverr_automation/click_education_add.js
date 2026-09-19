const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const page = (await browser.pages())[0];

  // Close toast if present
  await page.evaluate(() => {
    const closeToast = document.querySelector('[class*="toast"] button, [class*="snackbar"] button, [class*="notification"] button');
    if (closeToast) closeToast.click();
  });

  // Find Add button in Education section
  const clicked = await page.evaluate(() => {
    const all = Array.from(document.querySelectorAll('*'));
    const ed = all.find(e => e.innerText && e.innerText.includes('Field of study') && e.innerText.includes('Year of graduation'));
    if (ed) {
      const addBtns = Array.from(ed.querySelectorAll('button')).filter(b => b.innerText.trim().toLowerCase() === 'add');
      const lastAdd = addBtns[addBtns.length - 1];
      if (lastAdd) {
        lastAdd.scrollIntoView();
        lastAdd.click();
        return true;
      }
    }
    // Fallback: look for all Add buttons
    const btns = Array.from(document.querySelectorAll('button')).filter(b => b.innerText.trim().toLowerCase() === 'add');
    if (btns.length > 0) {
      const btn = btns[btns.length - 1];
      btn.scrollIntoView();
      btn.click();
      return true;
    }
    return false;
  });
  console.log('Clicked education Add button:', clicked);

  await new Promise(r => setTimeout(r, 2500));

  const shot = path.join(__dirname, 'after_education_submit.png');
  await page.screenshot({ path: shot, fullPage: true });
  console.log('Saved after education submit to:', shot);

  await browser.disconnect();
}

main().catch(console.error);
