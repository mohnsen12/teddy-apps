const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('seller_onboarding') || p.url().includes('fiverr.com')) || pages[0];

  // Scroll up a bit to see Skills section
  await page.evaluate(() => {
    window.scrollTo(0, 300);
  });
  await new Promise(r => setTimeout(r, 1000));

  // Find the "Add skills and expertise" button
  const skillBtnClicked = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const btn = buttons.find(b => b.innerText.toLowerCase().includes('skills'));
    if (btn) {
      btn.scrollIntoView();
      btn.click();
      return true;
    }
    return false;
  });
  console.log('Clicked "Add skills":', skillBtnClicked);

  await new Promise(r => setTimeout(r, 2000));

  const screenshotPath = path.join(__dirname, 'current_screen.png');
  await page.screenshot({ path: screenshotPath });
  console.log('Screenshot saved to:', screenshotPath);

  // Inspect inputs inside the skill modal/popover
  const inputs = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('input, select')).map(el => ({
      tag: el.tagName,
      placeholder: el.placeholder || '',
      className: el.className
    }));
  });
  console.log('Inputs found for skills:', inputs);

  await browser.disconnect();
}

main().catch(console.error);
