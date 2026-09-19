const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const page = (await browser.pages()).find(p => p.url().includes('requirements') || p.url().includes('fiverr.com'));

  console.log('Completing Requirements step for Gig 2 on:', page.url());

  const requirementText = '1. Names and versions of the systems to connect (e.g., Shopify + BC Cloud). 2. Which data entities should sync (orders, items, inventory, customers). 3. API documentation/access (can be shared securely in chat). 4. Estimated daily/monthly volume (orders/day, item count).';

  const ta = await page.$('textarea[placeholder*="Request necessary details"]');
  if (ta) {
    await ta.focus();
    await page.keyboard.type(requirementText, { delay: 12 });
  }

  await new Promise(r => setTimeout(r, 600));

  // Click Add
  console.log('Clicking Add requirement...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.innerText.trim() === 'Add');
    if (btn) btn.click();
  });

  await new Promise(r => setTimeout(r, 1500));

  // Click Save & Continue
  console.log('Clicking Save & Continue on Requirements...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.innerText.toLowerCase().includes('save & continue') || b.innerText.toLowerCase().includes('save and continue'));
    if (btn) {
      btn.scrollIntoView();
      btn.click();
    }
  });

  await new Promise(r => setTimeout(r, 4000));
  console.log('URL after Requirements save:', page.url());

  // Step 5: Gallery
  console.log('Uploading Gallery images for Gig 2...');
  const img1 = '/Users/teddy/teddy-apps/marketing/assets/fiverr/integrationer-01.png';
  const img2 = '/Users/teddy/teddy-apps/marketing/assets/fiverr/integrationer-02.png';
  const img3 = '/Users/teddy/teddy-apps/marketing/assets/fiverr/integrationer-03.png';

  const fileInput = await page.$('.dropzone-body.image input[type="file"]');
  if (fileInput) {
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
      await currentInputs[0].uploadFile(img2, img3);
    }
  } else {
    console.log('No file input found directly, checking other selectors...');
  }

  await new Promise(r => setTimeout(r, 4000));

  const galleryShot = path.join(__dirname, 'gig2_gallery_uploaded.png');
  await page.screenshot({ path: galleryShot, fullPage: true });
  console.log('Saved gallery shot to:', galleryShot);

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

  await new Promise(r => setTimeout(r, 5000));
  console.log('URL after Gallery save:', page.url());

  const publishShot = path.join(__dirname, 'gig2_publish_reached.png');
  await page.screenshot({ path: publishShot, fullPage: true });
  console.log('Saved publish shot to:', publishShot);

  await browser.disconnect();
}

main().catch(console.error);
