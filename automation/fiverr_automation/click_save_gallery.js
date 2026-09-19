const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const page = (await browser.pages()).find(p => p.url().includes('gallery') || p.url().includes('fiverr.com'));

  console.log('Clicking Save & Continue on Gallery step...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.innerText.toLowerCase().includes('save & continue') || b.innerText.toLowerCase().includes('save and continue'));
    if (btn) {
      btn.scrollIntoView();
      btn.click();
    }
  });

  await new Promise(r => setTimeout(r, 4000));
  console.log('Current URL after gallery save:', page.url());

  const shotPath = path.join(__dirname, 'step6_publish_reached.png');
  await page.screenshot({ path: shotPath, fullPage: true });
  console.log('Publish step screenshot saved to:', shotPath);

  await browser.disconnect();
}

main().catch(console.error);
