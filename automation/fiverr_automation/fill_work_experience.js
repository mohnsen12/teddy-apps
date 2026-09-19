const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const page = (await browser.pages())[0];

  console.log('Clicking Add work experience button...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.innerText && b.innerText.trim().toLowerCase() === 'add work experience');
    if (btn) btn.click();
  });

  await new Promise(r => setTimeout(r, 1500));

  // Inspect the open form
  const inputs = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('input, select, textarea')).map(el => ({
      tagName: el.tagName,
      type: el.type,
      placeholder: el.placeholder,
      id: el.id,
      className: el.className,
      value: el.value
    }));
  });
  console.log('Work exp inputs found:', inputs.filter(i => i.placeholder || i.type === 'checkbox' || i.type === 'radio'));

  const shot = path.join(__dirname, 'work_exp_opened_now.png');
  await page.screenshot({ path: shot, fullPage: true });
  console.log('Saved screenshot to:', shot);

  await browser.disconnect();
}

main().catch(console.error);
