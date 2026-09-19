const puppeteer = require('puppeteer-core');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const page = (await browser.pages())[0];

  await page.evaluate(() => {
    const inp = document.querySelector('input[placeholder="Start date"]');
    if (inp) inp.click();
  });
  await new Promise(r => setTimeout(r, 600));

  const calData = await page.evaluate(() => {
    const prev = document.querySelector('button[aria-label="Previous month"]');
    if (!prev) return 'No prev button';
    const parent = prev.parentElement.parentElement;
    return {
      html: parent.innerHTML
    };
  });
  console.log('Calendar HTML:\n', calData.html);

  await browser.disconnect();
}

main().catch(console.error);
