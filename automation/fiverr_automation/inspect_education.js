const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const page = (await browser.pages())[0];

  console.log('Clicking Add education button...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.innerText && b.innerText.trim().toLowerCase() === 'add education');
    if (btn) btn.click();
  });

  await new Promise(r => setTimeout(r, 1500));

  const shot = path.join(__dirname, 'education_opened.png');
  await page.screenshot({ path: shot, fullPage: true });
  console.log('Saved screenshot to:', shot);

  const inputs = await page.evaluate(() => {
    const form = Array.from(document.querySelectorAll('input, select, textarea')).filter(el => {
      return el.closest('div[class*="education"]') || el.placeholder || el.tagName === 'SELECT';
    });
    return form.map(el => ({
      tag: el.tagName,
      type: el.type,
      placeholder: el.placeholder || '',
      className: el.className
    }));
  });
  console.log('Education inputs:', inputs);

  await browser.disconnect();
}

main().catch(console.error);
