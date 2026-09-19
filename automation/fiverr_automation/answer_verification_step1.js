const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const page = (await browser.pages()).find(p => p.url().includes('verification') || p.url().includes('fiverr.com'));

  console.log('Selecting "As part of my primary job or profession"...');
  await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('*'));
    const card = cards.find(c => c.innerText && c.innerText.trim() === 'As part of my primary job or profession');
    if (card) card.click();
  });

  await new Promise(r => setTimeout(r, 600));

  console.log('Clicking Next...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const next = btns.find(b => b.innerText.trim() === 'Next' && !b.disabled);
    if (next) next.click();
  });

  await new Promise(r => setTimeout(r, 3000));
  console.log('URL after next:', page.url());

  const shotPath = path.join(__dirname, 'verification_step2.png');
  await page.screenshot({ path: shotPath, fullPage: true });
  console.log('Saved screenshot to:', shotPath);

  await browser.disconnect();
}

main().catch(console.error);
