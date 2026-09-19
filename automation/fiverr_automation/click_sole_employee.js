const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const page = (await browser.pages()).find(p => p.url().includes('verification') || p.url().includes('fiverr.com'));

  const clicked = await page.evaluate(() => {
    const el = Array.from(document.querySelectorAll('p, div')).find(e => e.innerText && e.innerText.includes('sole employee') && e.children.length === 0);
    if (el) {
      el.click();
      return true;
    }
    return false;
  });
  console.log('Clicked card:', clicked);
  await new Promise(r => setTimeout(r, 600));

  await page.screenshot({ path: path.join(__dirname, 'sole_employee_selected.png') });
  await browser.disconnect();
}

main().catch(console.error);
