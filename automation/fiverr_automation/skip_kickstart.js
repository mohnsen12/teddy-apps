const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('seller_onboarding') || p.url().includes('fiverr.com')) || pages[0];

  const buttons = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('button, a')).map(b => ({
      tag: b.tagName,
      text: b.innerText.trim()
    })).filter(b => b.text.length > 0 && b.text.length < 50);
  });
  console.log('Buttons on Kickstart page:', buttons);

  // Click "Skip" or "Maybe later" or "Continue"
  const clicked = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button, a'));
    const skipBtn = btns.find(b => {
      const t = b.innerText.toLowerCase();
      return t.includes('skip') || t.includes('maybe later') || t.includes('not now') || t.includes('create gig') || t.includes('continue');
    });
    if (skipBtn) {
      skipBtn.scrollIntoView();
      skipBtn.click();
      return skipBtn.innerText.trim();
    }
    return null;
  });
  console.log('Clicked button on Kickstart page:', clicked);

  await new Promise(r => setTimeout(r, 4000));
  console.log('URL now:', page.url());
  console.log('Page Title:', await page.title());

  const screenshotPath = path.join(__dirname, 'after_kickstart.png');
  await page.screenshot({ path: screenshotPath });
  console.log('Screenshot saved to:', screenshotPath);

  await browser.disconnect();
}

main().catch(console.error);
