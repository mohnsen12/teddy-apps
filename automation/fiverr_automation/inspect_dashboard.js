const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('seller_onboarding') || p.url().includes('fiverr.com')) || pages[0];

  const info = await page.evaluate(() => {
    const text = document.body ? document.body.innerText : '';
    const buttons = Array.from(document.querySelectorAll('button, a')).map(b => ({
      tag: b.tagName,
      text: b.innerText.trim(),
      rect: b.getBoundingClientRect()
    })).filter(b => b.text.length > 0 && b.text.length < 50);
    return { buttons, text };
  });

  console.log('Buttons:', JSON.stringify(info.buttons, null, 2));
  console.log('Text on screen:', info.text);

  // Scroll down a bit and take screenshot
  await page.evaluate(() => {
    window.scrollBy(0, 400);
  });
  await new Promise(r => setTimeout(r, 1000));

  const screenshotPath = path.join(__dirname, 'dashboard_screen.png');
  await page.screenshot({ path: screenshotPath });
  console.log('Screenshot saved to:', screenshotPath);

  await browser.disconnect();
}

main().catch(console.error);
