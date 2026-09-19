const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const page = (await browser.pages())[0];

  // Click start date input
  await page.evaluate(() => {
    const inp = document.querySelector('input[placeholder="Start date"]');
    if (inp) inp.click();
  });
  await new Promise(r => setTimeout(r, 600));

  const popover = await page.evaluate(() => {
    const dialogs = Array.from(document.querySelectorAll('[role="dialog"], [class*="popover"], [class*="picker"], [class*="calendar"], [class*="menu"]'));
    return dialogs.map(d => d.innerText.trim()).filter(Boolean);
  });
  console.log('Popovers after click on start date:', popover);

  const shot = path.join(__dirname, 'start_date_clicked.png');
  await page.screenshot({ path: shot, fullPage: true });
  console.log('Saved screenshot to:', shot);

  await browser.disconnect();
}

main().catch(console.error);
