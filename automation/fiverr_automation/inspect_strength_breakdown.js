const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const page = (await browser.pages())[0];

  console.log('Clicking Profile strength button...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.innerText && b.innerText.toLowerCase().includes('profile strength'));
    if (btn) btn.click();
  });

  await new Promise(r => setTimeout(r, 1500));

  const shot = path.join(__dirname, 'profile_strength_modal.png');
  await page.screenshot({ path: shot, fullPage: true });
  console.log('Saved strength modal screenshot to:', shot);

  const text = await page.evaluate(() => {
    const popover = document.querySelector('[role="dialog"], [class*="modal"], [class*="popover"], [class*="strength"]');
    return popover ? popover.innerText : document.body.innerText.slice(0, 1500);
  });
  console.log('Strength breakdown text:\n', text);

  await browser.disconnect();
}

main().catch(console.error);
