const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const page = (await browser.pages())[0];

  console.log('Clicking Add certifications...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.innerText && b.innerText.trim().toLowerCase() === 'add certifications');
    if (btn) btn.click();
  });

  await new Promise(r => setTimeout(r, 1500));

  const shot = path.join(__dirname, 'cert_opened.png');
  await page.screenshot({ path: shot, fullPage: true });
  console.log('Saved cert screenshot to:', shot);

  const inputs = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('input, select, textarea')).map(el => ({
      tag: el.tagName,
      placeholder: el.placeholder || '',
      className: el.className
    })).filter(x => x.placeholder);
  });
  console.log('Inputs found:', inputs);

  await browser.disconnect();
}

main().catch(console.error);
