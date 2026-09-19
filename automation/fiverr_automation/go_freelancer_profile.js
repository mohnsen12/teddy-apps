const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('fiverr.com')) || pages[0];

  const links = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('a')).map(a => ({
      text: a.innerText.trim(),
      href: a.href
    })).filter(a => a.text.toLowerCase().includes('freelancer') || a.text.toLowerCase().includes('seller') || a.text.toLowerCase().includes('edit'));
  });
  console.log('Relevant links found:', links);

  // Click on "freelancer profile"
  const clicked = await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('a'));
    const target = links.find(a => a.innerText.toLowerCase().includes('freelancer profile'));
    if (target) {
      target.click();
      return true;
    }
    return false;
  });
  console.log('Clicked "freelancer profile":', clicked);

  await new Promise(r => setTimeout(r, 3000));
  console.log('Current URL:', page.url());
  console.log('Page Title:', await page.title());

  const screenshotPath = path.join(__dirname, 'current_screen.png');
  await page.screenshot({ path: screenshotPath });
  console.log('Screenshot saved to:', screenshotPath);

  await browser.disconnect();
}

main().catch(console.error);
