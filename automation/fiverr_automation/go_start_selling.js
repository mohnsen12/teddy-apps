const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('fiverr.com')) || pages[0];

  // Navigate to start_selling or click profile menu
  console.log('Navigating to https://www.fiverr.com/start_selling ...');
  await page.goto('https://www.fiverr.com/start_selling', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));

  const screenshotPath = path.join(__dirname, 'current_screen.png');
  await page.screenshot({ path: screenshotPath });
  console.log('URL after navigation:', page.url());
  console.log('Page Title:', await page.title());

  const buttons = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('button, a'))
      .map(b => ({ text: b.innerText.trim(), href: b.href }))
      .filter(b => b.text.toLowerCase().includes('seller') || b.text.toLowerCase().includes('get started') || b.text.toLowerCase().includes('continue'));
  });
  console.log('Relevant buttons on start_selling:', buttons);

  await browser.disconnect();
}

main().catch(console.error);
