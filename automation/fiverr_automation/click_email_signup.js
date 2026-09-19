const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('fiverr.com')) || pages[0];

  const clicked = await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('a, button, span'));
    const target = links.find(el => el.innerText && el.innerText.includes('sign up using email'));
    if (target) {
      target.click();
      return true;
    }
    return false;
  });

  console.log('Clicked "sign up using email":', clicked);
  await new Promise(r => setTimeout(r, 1500));

  const screenshotPath = path.join(__dirname, 'current_screen.png');
  await page.screenshot({ path: screenshotPath });
  console.log('Screenshot saved to:', screenshotPath);

  const inputs = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('input')).map(i => ({
      type: i.type,
      name: i.name,
      id: i.id,
      placeholder: i.placeholder
    }));
  });
  console.log('Inputs now visible:', inputs);

  await browser.disconnect();
}

main().catch(console.error);
