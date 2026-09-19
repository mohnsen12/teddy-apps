const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('seller_onboarding') || p.url().includes('fiverr.com')) || pages[0];

  // Click Cancel on the open skill box
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const cancel = btns.find(b => b.innerText.trim() === 'Cancel');
    if (cancel) cancel.click();
  });
  await new Promise(r => setTimeout(r, 1000));

  // Inspect all added skills
  const addedSkills = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('*')).filter(el => {
      return el.children.length === 0 && (el.innerText.includes('Microsoft') || el.innerText.includes('PHP') || el.innerText.includes('API') || el.innerText.includes('ERP') || el.innerText.includes('Pro'));
    });
    return cards.map(c => c.innerText.trim());
  });
  console.log('Added skills list:', addedSkills);

  const screenshotPath = path.join(__dirname, 'current_screen.png');
  await page.screenshot({ path: screenshotPath });
  console.log('Screenshot saved to:', screenshotPath);

  await browser.disconnect();
}

main().catch(console.error);
