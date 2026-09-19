const puppeteer = require('puppeteer-core');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const page = (await browser.pages())[0];
  await page.goto('https://www.fiverr.com/verification/user', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 2000));
  
  // Click Continue if it's on the intro screen
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.innerText && b.innerText.toLowerCase().includes('continue'));
    if (btn) btn.click();
  });

  await new Promise(r => setTimeout(r, 1500));
  console.log('Now at verification URL:', page.url());
  await browser.disconnect();
}

main().catch(console.error);
