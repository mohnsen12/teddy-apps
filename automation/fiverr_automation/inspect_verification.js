const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const page = (await browser.pages()).find(p => p.url().includes('seller_dashboard') || p.url().includes('fiverr.com'));

  const verifBtn = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button, a'));
    const btn = btns.find(b => b.innerText && b.innerText.toLowerCase().includes('complete verification'));
    if (btn) {
      return {
        tag: btn.tagName,
        href: btn.href || null,
        className: btn.className,
        text: btn.innerText
      };
    }
    return null;
  });

  console.log('Verification button info:', verifBtn);

  // Also check Manage Gigs page in another tab or navigate
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button, a'));
    const btn = btns.find(b => b.innerText && b.innerText.toLowerCase().includes('complete verification'));
    if (btn) btn.click();
  });

  await new Promise(r => setTimeout(r, 4000));
  console.log('Page URL after clicking Complete verification:', page.url());

  const shot = path.join(__dirname, 'verification_step_screen.png');
  await page.screenshot({ path: shot, fullPage: true });
  console.log('Screenshot saved to:', shot);

  await browser.disconnect();
}

main().catch(console.error);
