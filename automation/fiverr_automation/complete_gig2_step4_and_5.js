const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const page = (await browser.pages()).find(p => p.url().includes('requirements') || p.url().includes('fiverr.com'));

  console.log('Completing Requirements on:', page.url());

  // 1. Click + Add New Question
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.innerText && b.innerText.includes('Add New Question'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 800));

  // 2. Type requirements
  const reqText = '1. Names and versions of the systems to connect (e.g., Shopify + BC Cloud). 2. Which data entities should sync (orders, items, inventory, customers). 3. API documentation/access (can be shared securely in chat). 4. Estimated daily/monthly volume (orders/day, item count).';

  const ta = await page.$('textarea[placeholder*="Request necessary details"], textarea');
  if (ta) {
    await ta.focus();
    await page.keyboard.type(reqText, { delay: 10 });
  }

  await new Promise(r => setTimeout(r, 600));

  // 3. Click Add
  console.log('Clicking Add...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.innerText.trim() === 'Add');
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 1500));

  // 4. Click Save & Continue on Requirements
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
  console.log('URL after requirements Save & Continue:', page.url());

  // 5. Gallery Step
  console.log('Checking gallery page...');
  await page.waitForSelector('.dropzone-body.image input[type="file"]', { timeout: 10000 });

  const img1 = '/Users/teddy/teddy-apps/marketing/assets/fiverr/integrationer-01.png';
  const img2 = '/Users/teddy/teddy-apps/marketing/assets/fiverr/integrationer-02.png';
  const img3 = '/Users/teddy/teddy-apps/marketing/assets/fiverr/integrationer-03.png';

  const fileInput = await page.$('.dropzone-body.image input[type="file"]');
  console.log('Uploading image 1...');
  await fileInput.uploadFile(img1);
  await new Promise(r => setTimeout(r, 3500));

  const currentInputs = await page.$$('.dropzone-body.image input[type="file"]');
  console.log('Available file inputs after img1:', currentInputs.length);
  if (currentInputs.length > 1) {
    console.log('Uploading image 2...');
    await currentInputs[1].uploadFile(img2);
    await new Promise(r => setTimeout(r, 3000));
    const nextInputs = await page.$$('.dropzone-body.image input[type="file"]');
    if (nextInputs.length > 2) {
      console.log('Uploading image 3...');
      await nextInputs[2].uploadFile(img3);
    }
  } else if (currentInputs.length === 1) {
    console.log('Uploading image 2 & 3...');
    await currentInputs[0].uploadFile(img2, img3);
  }

  await new Promise(r => setTimeout(r, 4000));

  const shot = path.join(__dirname, 'gig2_gallery_done.png');
  await page.screenshot({ path: shot, fullPage: true });
  console.log('Gallery shot saved to:', shot);

  // Click Save & Continue on Gallery
  console.log('Clicking Save & Continue on Gallery...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.innerText.toLowerCase().includes('save & continue') || b.innerText.toLowerCase().includes('save and continue'));
    if (btn) {
      btn.scrollIntoView();
      btn.click();
    }
  });

  await new Promise(r => setTimeout(r, 4000));
  console.log('Final URL after gallery save:', page.url());

  const publishShot = path.join(__dirname, 'gig2_final_publish_step.png');
  await page.screenshot({ path: publishShot, fullPage: true });
  console.log('Final publish shot saved to:', publishShot);

  await browser.disconnect();
}

main().catch(console.error);
