const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('seller_onboarding') || p.url().includes('fiverr.com')) || pages[0];

  // Click the pencil next to Teddyy Apps
  const clickedPencil = await page.evaluate(() => {
    // Find text containing Teddyy Apps
    const all = Array.from(document.querySelectorAll('*'));
    const nameEl = all.find(el => el.innerText && el.innerText.trim().startsWith('Teddyy Apps'));
    if (nameEl) {
      // Find pencil svg or button inside or next to it
      const btn = nameEl.querySelector('svg, button, [role="button"]') || nameEl.nextElementSibling;
      if (btn) {
        btn.click();
        return true;
      }
    }
    // Fallback: look for pencil svgs
    const svgs = Array.from(document.querySelectorAll('svg'));
    for (const s of svgs) {
      const parent = s.parentElement;
      if (parent && parent.innerText && parent.innerText.includes('Teddyy')) {
        s.click();
        return true;
      }
    }
    return false;
  });
  console.log('Clicked name pencil:', clickedPencil);

  await new Promise(r => setTimeout(r, 1000));

  // Inspect inputs visible now
  const inputs = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('input')).map(i => ({
      val: i.value,
      placeholder: i.placeholder,
      visible: i.offsetParent !== null
    }));
  });
  console.log('Visible inputs after clicking pencil:', inputs);

  const screenshotPath = path.join(__dirname, 'name_edit_screen.png');
  await page.screenshot({ path: screenshotPath });
  console.log('Screenshot saved to:', screenshotPath);

  await browser.disconnect();
}

main().catch(console.error);
