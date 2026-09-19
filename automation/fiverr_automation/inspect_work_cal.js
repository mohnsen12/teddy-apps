const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const page = (await browser.pages())[0];

  // Click start date
  console.log('Clicking Start date input...');
  await page.evaluate(() => {
    const inp = document.querySelector('input[placeholder="Start date"]');
    if (inp) inp.click();
  });
  await new Promise(r => setTimeout(r, 600));

  const shot = path.join(__dirname, 'cal_open_detail.png');
  await page.screenshot({ path: shot });
  console.log('Saved screenshot to:', shot);

  // Print all elements inside the calendar popup
  const calElements = await page.evaluate(() => {
    // Find element containing September 2026
    const all = Array.from(document.querySelectorAll('*'));
    const target = all.find(e => e.innerText && e.innerText.includes('September 2026') && e.children.length > 0 && e.children.length < 10);
    if (!target) return 'Not found';
    return {
      text: target.innerText,
      children: Array.from(target.children).map(c => ({
        tag: c.tagName,
        text: c.innerText.trim(),
        className: c.className
      }))
    };
  });
  console.log('Cal header container:', JSON.stringify(calElements, null, 2));

  await browser.disconnect();
}

main().catch(console.error);
