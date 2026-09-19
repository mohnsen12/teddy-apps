const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const page = (await browser.pages())[0];

  console.log('Selecting non-US radio...');
  await page.evaluate(() => {
    const radio = document.querySelector('input[value="non_us"]');
    if (radio) {
      radio.click();
      radio.checked = true;
      radio.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });

  await new Promise(r => setTimeout(r, 600));

  console.log('Clicking Save button...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const saveBtn = btns.find(b => b.innerText && b.innerText.trim().toLowerCase() === 'save');
    if (saveBtn) saveBtn.click();
  });

  await new Promise(r => setTimeout(r, 3000));
  console.log('URL after save:', page.url());

  const shot = path.join(__dirname, 'after_w9_save.png');
  await page.screenshot({ path: shot, fullPage: true });
  console.log('Screenshot saved to:', shot);

  const text = await page.evaluate(() => document.body.innerText);
  console.log('Text snippet:\n', text.slice(0, 1500));

  await browser.disconnect();
}

main().catch(console.error);
