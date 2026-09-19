const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const page = (await browser.pages())[0];

  const clicked = await page.evaluate(() => {
    const certSection = document.querySelector('input[placeholder="Certificate or award"]').closest('div[class*="content"], div[class*="section"]') || document.body;
    const addBtns = Array.from(document.querySelectorAll('button')).filter(b => b.innerText.trim().toLowerCase() === 'add');
    const lastAdd = addBtns[addBtns.length - 1];
    if (lastAdd) {
      lastAdd.scrollIntoView();
      lastAdd.click();
      return true;
    }
    return false;
  });
  console.log('Clicked Add:', clicked);

  await new Promise(r => setTimeout(r, 2500));

  const shot = path.join(__dirname, 'cert_final_added.png');
  await page.screenshot({ path: shot, fullPage: true });
  console.log('Saved to:', shot);

  await browser.disconnect();
}

main().catch(console.error);
