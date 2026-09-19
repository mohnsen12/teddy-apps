const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const page = (await browser.pages()).find(p => p.url().includes('manage_gigs') || p.url().includes('fiverr.com'));

  console.log('Current URL before click:', page.url());
  
  // Click 'Go to dashboard' button
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button, a'));
    const btn = btns.find(b => b.innerText && b.innerText.toLowerCase().includes('go to dashboard'));
    if (btn) btn.click();
    else window.location.href = 'https://www.fiverr.com/users/teddybot82/seller_dashboard';
  });

  await new Promise(r => setTimeout(r, 4000));
  console.log('Current URL after navigation:', page.url());

  const shot = path.join(__dirname, 'dashboard_screen.png');
  await page.screenshot({ path: shot, fullPage: true });
  console.log('Saved dashboard screenshot to:', shot);

  const text = await page.evaluate(() => document.body.innerText);
  console.log('Dashboard text preview:\n', text.slice(0, 2000));

  await browser.disconnect();
}

main().catch(console.error);
