const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('fiverr.com')) || pages[0];

  // Accept cookies if present
  try {
    const acceptBtn = await page.$('button#onetrust-accept-btn-handler, button:has-text("Accept"), button');
    // Find button containing Accept
    const clicked = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const btn = buttons.find(b => b.innerText.trim() === 'Accept');
      if (btn) {
        btn.click();
        return true;
      }
      return false;
    });
    if (clicked) {
      console.log('Clicked Accept cookies');
      await new Promise(r => setTimeout(r, 1000));
    }
  } catch (e) {
    console.log('Cookie banner handling note:', e.message);
  }

  // Click Join
  const joinClicked = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button, a'));
    const joinBtn = buttons.find(b => b.innerText.trim() === 'Join');
    if (joinBtn) {
      joinBtn.click();
      return true;
    }
    return false;
  });
  console.log('Join clicked:', joinClicked);

  await new Promise(r => setTimeout(r, 2000));

  const screenshotPath = path.join(__dirname, 'current_screen.png');
  await page.screenshot({ path: screenshotPath });
  console.log('New screenshot saved to:', screenshotPath);
  console.log('Current URL:', page.url());

  await browser.disconnect();
}

main().catch(console.error);
