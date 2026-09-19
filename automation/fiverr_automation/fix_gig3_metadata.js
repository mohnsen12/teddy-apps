const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const page = (await browser.pages()).find(p => p.url().includes('manage_gigs') || p.url().includes('fiverr.com'));

  console.log('Fixing metadata tabs on:', page.url());

  // 1. Click Website Type tab
  console.log('Clicking Website Type tab...');
  await page.evaluate(() => {
    const tabs = Array.from(document.querySelectorAll('.metadata-names-list li, [class*="metadata"] li'));
    const wt = tabs.find(t => t.innerText && t.innerText.toLowerCase().includes('website type'));
    if (wt) wt.click();
  });
  await new Promise(r => setTimeout(r, 600));

  const wtOptions = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('label')).map(l => l.innerText.trim()).filter(Boolean);
  });
  console.log('Website Type options:\n', wtOptions);

  await page.evaluate(() => {
    const labels = Array.from(document.querySelectorAll('label'));
    const portal = labels.find(l => l.innerText && l.innerText.trim().toLowerCase() === 'portal');
    if (portal) portal.click();
    const business = labels.find(l => l.innerText && l.innerText.trim().toLowerCase() === 'business');
    if (business) business.click();
    const ecom = labels.find(l => l.innerText && l.innerText.trim().toLowerCase().includes('e-commerce'));
    if (ecom) ecom.click();
  });
  await new Promise(r => setTimeout(r, 600));

  // 2. Click Website Features tab
  console.log('Clicking Website Features tab...');
  await page.evaluate(() => {
    const tabs = Array.from(document.querySelectorAll('.metadata-names-list li, [class*="metadata"] li'));
    const wf = tabs.find(t => t.innerText && t.innerText.toLowerCase().includes('features'));
    if (wf) wf.click();
  });
  await new Promise(r => setTimeout(r, 600));

  const wfOptions = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('label')).map(l => l.innerText.trim()).filter(Boolean);
  });
  console.log('Website Features options:\n', wfOptions);

  // Click relevant features
  await page.evaluate(() => {
    const labels = Array.from(document.querySelectorAll('label'));
    const targets = ['portal', 'inventory', 'customer', 'account', 'analytics', 'payment', 'shipping', 'dashboard', 'form'];
    labels.forEach(l => {
      const text = l.innerText.toLowerCase();
      if (targets.some(t => text.includes(t))) {
        l.click();
      }
    });
  });
  await new Promise(r => setTimeout(r, 600));

  const shot = path.join(__dirname, 'gig3_metadata_fixed.png');
  await page.screenshot({ path: shot, fullPage: true });
  console.log('Saved fixed metadata shot to:', shot);

  // 3. Click Save & Continue
  console.log('Clicking Save & Continue...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.innerText.toLowerCase().includes('save & continue') || b.innerText.toLowerCase().includes('save and continue'));
    if (btn) {
      btn.scrollIntoView();
      btn.click();
    }
  });

  await new Promise(r => setTimeout(r, 4000));
  console.log('Current URL after save:', page.url());

  const afterShot = path.join(__dirname, 'gig3_pricing_reached.png');
  await page.screenshot({ path: afterShot, fullPage: true });
  console.log('Saved after shot to:', afterShot);

  await browser.disconnect();
}

main().catch(console.error);
