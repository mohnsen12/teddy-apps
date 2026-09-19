const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const page = (await browser.pages()).find(p => p.url().includes('pricing') || p.url().includes('fiverr.com'));

  console.log('Fixing prices...');
  const prices = ['350', '1200', '3000'];

  await page.evaluate((prices) => {
    const inputs = Array.from(document.querySelectorAll('.price-input'));
    const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
    inputs.forEach((inp, i) => {
      if (prices[i]) {
        inp.focus();
        nativeSetter.call(inp, prices[i]);
        inp.dispatchEvent(new Event('input', { bubbles: true }));
        inp.dispatchEvent(new Event('change', { bubbles: true }));
        inp.blur();
      }
    });
  }, prices);

  await new Promise(r => setTimeout(r, 1000));

  const values = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.price-input')).map(i => i.value);
  });
  console.log('Current price values in DOM:', values);

  const shotPath = path.join(__dirname, 'prices_fixed.png');
  await page.screenshot({ path: shotPath, fullPage: true });
  console.log('Screenshot saved to:', shotPath);

  // If prices are correct, click Save & Continue!
  if (values[0] === '350' && values[1] === '1200' && values[2] === '3000') {
    console.log('Prices verified! Clicking Save & Continue...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const btn = btns.find(b => b.innerText.toLowerCase().includes('save & continue') || b.innerText.toLowerCase().includes('save and continue'));
      if (btn) {
        btn.scrollIntoView();
        btn.click();
      }
    });

    await new Promise(r => setTimeout(r, 4000));
    console.log('Current URL after save:', page.url());

    const afterSavePath = path.join(__dirname, 'after_price_save.png');
    await page.screenshot({ path: afterSavePath, fullPage: true });
    console.log('After save screenshot saved to:', afterSavePath);
  }

  await browser.disconnect();
}

main().catch(console.error);
