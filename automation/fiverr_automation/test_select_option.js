const puppeteer = require('puppeteer-core');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const page = (await browser.pages()).find(p => p.url().includes('pricing'));

  // Test selecting "5 DAYS DELIVERY" in the currently open or first dropdown
  const success = await page.evaluate(() => {
    const options = Array.from(document.querySelectorAll('button.table-select-option, [class*="table-select-option"]'));
    const target = options.find(o => o.innerText.trim().toUpperCase() === '5 DAYS DELIVERY');
    if (target) {
      target.click();
      return true;
    }
    return false;
  });

  console.log('Selected 5 DAYS DELIVERY:', success);
  await browser.disconnect();
}

main().catch(console.error);
