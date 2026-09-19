const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const page = (await browser.pages())[0];

  // Open calendar
  await page.evaluate(() => {
    const inp = document.querySelector('input[placeholder="Start date"]');
    if (inp) inp.click();
  });
  await new Promise(r => setTimeout(r, 400));

  console.log('Clicking previous month 60 times (5 years back)...');
  const monthText = await page.evaluate(async () => {
    for (let i = 0; i < 60; i++) {
      const prev = document.querySelector('button[aria-label="Previous month"]');
      if (prev) prev.click();
    }
    const all = Array.from(document.querySelectorAll('*'));
    const target = all.find(e => e.children.length === 0 && e.innerText && e.innerText.includes('202'));
    return target ? target.innerText : 'Not found';
  });

  console.log('Current month/year in calendar:', monthText);

  // Click a day (e.g. 1st of that month)
  await page.evaluate(() => {
    const all = Array.from(document.querySelectorAll('*'));
    const day1 = all.find(e => e.children.length === 0 && e.innerText && e.innerText.trim() === '1');
    if (day1) day1.click();
  });

  await new Promise(r => setTimeout(r, 500));
  const val = await page.evaluate(() => document.querySelector('input[placeholder="Start date"]').value);
  console.log('Start date value selected:', val);

  const shot = path.join(__dirname, 'cal_after_5_years.png');
  await page.screenshot({ path: shot });
  console.log('Saved screenshot to:', shot);

  await browser.disconnect();
}

main().catch(console.error);
