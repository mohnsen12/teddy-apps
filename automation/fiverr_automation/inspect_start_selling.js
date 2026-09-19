const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('fiverr.com')) || pages[0];

  const elements = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button, a')).map(el => ({
      tag: el.tagName,
      text: el.innerText.trim(),
      href: el.href || null,
      class: el.className,
      rect: el.getBoundingClientRect()
    })).filter(el => el.text.length > 0 && el.text.length < 50);
    return buttons;
  });

  console.log('All buttons/links on start_selling:');
  console.log(JSON.stringify(elements, null, 2));

  // Try to click the first "Get started" button
  const clicked = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button, a'));
    const btn = buttons.find(b => b.innerText.trim().toLowerCase() === 'get started');
    if (btn) {
      btn.scrollIntoView();
      btn.click();
      return true;
    }
    return false;
  });
  console.log('Clicked "Get started":', clicked);

  await new Promise(r => setTimeout(r, 3000));
  console.log('URL after clicking Get started:', page.url());

  const screenshotPath = path.join(__dirname, 'current_screen.png');
  await page.screenshot({ path: screenshotPath, fullPage: false });
  console.log('Screenshot saved to:', screenshotPath);

  await browser.disconnect();
}

main().catch(console.error);
