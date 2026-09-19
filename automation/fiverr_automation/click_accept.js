const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('fiverr.com')) || pages[0];

  // Click the Accept button on the cookie banner
  const clicked = await page.evaluate(() => {
    const allButtons = Array.from(document.querySelectorAll('button'));
    const acceptBtn = allButtons.find(b => b.innerText.trim() === 'Accept');
    if (acceptBtn) {
      acceptBtn.click();
      return true;
    }
    return false;
  });
  console.log('Clicked Accept on cookie banner:', clicked);

  await new Promise(r => setTimeout(r, 1500));

  // Inspect the Join modal
  const modalInfo = await page.evaluate(() => {
    const inputs = Array.from(document.querySelectorAll('input')).map(i => ({
      type: i.type,
      name: i.name,
      id: i.id,
      placeholder: i.placeholder
    }));
    const buttons = Array.from(document.querySelectorAll('button')).map(b => b.innerText.trim()).filter(Boolean);
    return { inputs, buttons };
  });

  console.log('Modal info:', JSON.stringify(modalInfo, null, 2));

  const screenshotPath = path.join(__dirname, 'current_screen.png');
  await page.screenshot({ path: screenshotPath });
  console.log('Screenshot saved to:', screenshotPath);

  await browser.disconnect();
}

main().catch(console.error);
