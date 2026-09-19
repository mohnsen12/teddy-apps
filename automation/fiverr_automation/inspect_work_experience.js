const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const page = (await browser.pages())[0];

  await page.goto('https://www.fiverr.com/sellers/teddybot82/edit', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 2000));

  // Click Add work experience
  console.log('Clicking Add work experience...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.innerText && b.innerText.trim().toLowerCase() === 'add work experience');
    if (btn) btn.click();
  });

  await new Promise(r => setTimeout(r, 1500));

  const shot = path.join(__dirname, 'work_experience_modal.png');
  await page.screenshot({ path: shot, fullPage: true });
  console.log('Saved work experience screenshot to:', shot);

  const inputs = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('input, select, textarea')).map(el => ({
      name: el.name,
      id: el.id,
      placeholder: el.placeholder,
      tag: el.tagName,
      type: el.type,
      label: el.labels && el.labels[0] ? el.labels[0].innerText : ''
    }));
  });
  console.log('Form inputs:', JSON.stringify(inputs, null, 2));

  await browser.disconnect();
}

main().catch(console.error);
