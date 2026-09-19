const puppeteer = require('puppeteer-core');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const page = (await browser.pages())[0];

  const rect = await page.evaluate(() => {
    const all = Array.from(document.querySelectorAll('*'));
    const item = all.find(e => e.innerText && e.innerText.trim().startsWith('+ Add') && e.innerText.includes('Teddy Apps'));
    if (item) {
      const r = item.getBoundingClientRect();
      return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
    }
    return null;
  });

  console.log('Position of + Add Teddy Apps:', rect);
  if (rect) {
    await page.mouse.click(rect.x, rect.y);
    console.log('Clicked at position:', rect);
  }

  await new Promise(r => setTimeout(r, 1000));

  const addBtnState = await page.evaluate(() => {
    const form = document.querySelector('textarea[placeholder*="job history"]').closest('div[class*="content"], div[class*="section"]') || document.body;
    const addBtns = Array.from(form.querySelectorAll('button')).filter(b => b.innerText.trim().toLowerCase() === 'add');
    if (addBtns.length > 0) {
      const b = addBtns[addBtns.length - 1];
      return { disabled: b.disabled, text: b.innerText };
    }
    return null;
  });
  console.log('Add button state after click:', addBtnState);

  if (addBtnState && !addBtnState.disabled) {
    console.log('Clicking Add button now!');
    await page.evaluate(() => {
      const form = document.querySelector('textarea[placeholder*="job history"]').closest('div[class*="content"], div[class*="section"]') || document.body;
      const addBtns = Array.from(form.querySelectorAll('button')).filter(b => b.innerText.trim().toLowerCase() === 'add');
      const b = addBtns[addBtns.length - 1];
      b.click();
    });
    await new Promise(r => setTimeout(r, 2500));
  }

  const shot = require('path').join(__dirname, 'work_exp_after_exact_click.png');
  await page.screenshot({ path: shot, fullPage: true });
  console.log('Saved screenshot to:', shot);

  await browser.disconnect();
}

main().catch(console.error);
