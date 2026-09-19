const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const page = (await browser.pages()).find(p => p.url().includes('portfolio'));

  console.log('Selecting Software Development in Category...');
  await page.evaluate(() => {
    const items = Array.from(document.querySelectorAll('li, [role="option"], label, div[class*="option"]'));
    const sw = items.find(e => e.innerText && e.innerText.trim() === 'Software Development');
    if (sw) sw.click();
  });
  await new Promise(r => setTimeout(r, 600));

  console.log('Selecting related Gig checkbox (API integration)...');
  await page.evaluate(() => {
    const labels = Array.from(document.querySelectorAll('label, div, p, span'));
    const gig = labels.find(l => l.innerText && l.innerText.toLowerCase().includes('integrate microsoft business central'));
    if (gig) gig.click();
  });
  await new Promise(r => setTimeout(r, 600));

  await page.screenshot({ path: path.join(__dirname, 'project1_step2_ready.png'), fullPage: true });
  console.log('Saved project1_step2_ready.png');

  console.log('Clicking Publish project button...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const pub = btns.find(b => b.innerText.toLowerCase().includes('publish project'));
    if (pub) pub.click();
  });

  await new Promise(r => setTimeout(r, 5000));
  console.log('Current URL after publish:', page.url());

  await page.screenshot({ path: path.join(__dirname, 'project1_published.png'), fullPage: true });
  console.log('Saved project1_published.png');

  await browser.disconnect();
}

main().catch(console.error);
