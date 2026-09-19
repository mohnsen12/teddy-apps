const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const page = (await browser.pages()).find(p => p.url().includes('requirements') || p.url().includes('fiverr.com'));

  console.log('Completing Requirements step on:', page.url());

  const requirementText = '1. Brief description of your business process and what you want to achieve. 2. Your Business Central version (Cloud SaaS or On-Premise). 3. Sandbox access or screenshots/documentation. 4. Any specific deadline or rollout milestones.';

  const ta = await page.$('textarea[placeholder*="Request necessary details"]');
  if (ta) {
    await ta.focus();
    await page.keyboard.type(requirementText, { delay: 15 });
  }

  await new Promise(r => setTimeout(r, 600));

  // Click Add
  console.log('Clicking Add...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.innerText.trim() === 'Add');
    if (btn) btn.click();
  });

  await new Promise(r => setTimeout(r, 1500));

  const shotPath = path.join(__dirname, 'requirements_added.png');
  await page.screenshot({ path: shotPath, fullPage: true });
  console.log('Requirements added screenshot saved to:', shotPath);

  // Click Save & Continue
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

  const afterSavePath = path.join(__dirname, 'step5_gallery_reached.png');
  await page.screenshot({ path: afterSavePath, fullPage: true });
  console.log('Gallery reached screenshot saved to:', afterSavePath);

  await browser.disconnect();
}

main().catch(console.error);
