const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const page = (await browser.pages())[0];

  console.log('Clicking Add work experience...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.innerText && b.innerText.trim().toLowerCase() === 'add work experience');
    if (btn) btn.click();
  });

  await new Promise(r => setTimeout(r, 2000));

  const shot = path.join(__dirname, 'work_exp_opened.png');
  await page.screenshot({ path: shot, fullPage: true });
  console.log('Saved work experience screenshot to:', shot);

  const formFields = await page.evaluate(() => {
    const inputs = Array.from(document.querySelectorAll('input, select, textarea, [role="combobox"]'));
    return inputs.map(el => ({
      tagName: el.tagName,
      type: el.type,
      name: el.name,
      id: el.id,
      placeholder: el.placeholder,
      value: el.value,
      className: el.className
    }));
  });
  console.log('Found fields:', JSON.stringify(formFields, null, 2));

  await browser.disconnect();
}

main().catch(console.error);
