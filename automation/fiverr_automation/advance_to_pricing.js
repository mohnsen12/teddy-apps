const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const page = (await browser.pages())[0];

  console.log('Current URL before click:', page.url());

  // Click Save & Continue button
  const clicked = await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Save & Continue'));
    if (btn) {
      btn.click();
      return true;
    }
    return false;
  });
  console.log('Clicked Save & Continue:', clicked);

  await new Promise(r => setTimeout(r, 3000));
  console.log('URL after wait:', page.url());

  // If still on general tab, check if tab 2 (Pricing) is clickable
  if (page.url().includes('tab=general')) {
    console.log('Still on general, trying tab 2...');
    await page.evaluate(() => {
      const step2 = Array.from(document.querySelectorAll('*')).find(e => e.innerText && e.innerText.trim() === '2' || e.innerText && e.innerText.includes('Pricing'));
      if (step2) step2.click();
    });
    await new Promise(r => setTimeout(r, 3000));
    console.log('URL after tab 2 click:', page.url());
  }

  const shot = path.join(__dirname, 'after_advance.png');
  await page.screenshot({ path: shot, fullPage: true });
  console.log('Saved shot to:', shot);

  await browser.disconnect();
}

main().catch(console.error);
