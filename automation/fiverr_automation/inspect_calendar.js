const puppeteer = require('puppeteer-core');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const page = (await browser.pages())[0];

  const cal = await page.evaluate(() => {
    const header = document.querySelector('[class*="calendar"] [class*="header"], [class*="picker"] [class*="header"]') || document.querySelector('button[class*="prev"], button[class*="next"]');
    const allButtons = Array.from(document.querySelectorAll('div[class*="calendar"] button, div[class*="picker"] button, [class*="datepicker"] button'));
    return {
      buttons: allButtons.map(b => b.innerText.trim() || b.getAttribute('aria-label')),
      inpReadOnly: document.querySelector('input[placeholder="Start date"]').readOnly
    };
  });
  console.log('Calendar inspection:', cal);

  await browser.disconnect();
}

main().catch(console.error);
