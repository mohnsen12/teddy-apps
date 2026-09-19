const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const page = (await browser.pages()).find(p => p.url().includes('verification') || p.url().includes('fiverr.com'));

  console.log('Clicking "Yes, and I\'m the sole employee"...');
  await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('*'));
    const card = cards.find(c => c.innerText && c.innerText.trim().includes("Yes, and I'm the sole employee"));
    if (card) card.click();
  });

  await new Promise(r => setTimeout(r, 400));
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const next = btns.find(b => b.innerText.trim() === 'Next' && !b.disabled);
    if (next) next.click();
  });

  await new Promise(r => setTimeout(r, 2500));
  console.log('URL:', page.url());

  const shotPath = path.join(__dirname, 'verification_step3.png');
  await page.screenshot({ path: shotPath, fullPage: true });
  console.log('Screenshot saved to:', shotPath);

  await browser.disconnect();
}

main().catch(console.error);
