const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const page = (await browser.pages()).find(p => p.url().includes('gallery') || p.url().includes('fiverr.com'));

  console.log('Uploading images on:', page.url());

  const img1 = '/Users/teddy/teddy-apps/marketing/assets/fiverr/custom-bc-apps-01.png';
  const img2 = '/Users/teddy/teddy-apps/marketing/assets/fiverr/custom-bc-apps-02.png';
  const img3 = '/Users/teddy/teddy-apps/marketing/assets/fiverr/custom-bc-apps-03.png';

  // Find the image file input
  const fileInput = await page.$('.dropzone-body.image input[type="file"]');
  if (!fileInput) {
    console.error('Image file input not found!');
    await browser.disconnect();
    return;
  }

  console.log('Uploading img1...');
  await fileInput.uploadFile(img1);
  await new Promise(r => setTimeout(r, 4000));

  // Check if additional slots or file inputs appeared
  const fileInputs = await page.$$('.dropzone-body.image input[type="file"], .gallery-item-placeholder input[type="file"]');
  console.log('File inputs count after img1:', fileInputs.length);

  console.log('Uploading img2 & img3...');
  // Upload to slot 2 and slot 3 if separate, or pass all
  const imageInputs = await page.$$('li.gallery-item-placeholder input[type="file"]');
  console.log('Placeholder inputs:', imageInputs.length);

  // Let's also try uploading img2 to the available input
  const currentInputs = await page.$$('.dropzone-body.image input[type="file"]');
  if (currentInputs.length > 1) {
    await currentInputs[1].uploadFile(img2);
    await new Promise(r => setTimeout(r, 3000));
    const nextInputs = await page.$$('.dropzone-body.image input[type="file"]');
    if (nextInputs.length > 2) {
      await nextInputs[2].uploadFile(img3);
    }
  } else if (currentInputs.length === 1) {
    await currentInputs[0].uploadFile(img2, img3);
  }

  await new Promise(r => setTimeout(r, 4000));

  const shotPath = path.join(__dirname, 'images_uploaded.png');
  await page.screenshot({ path: shotPath, fullPage: true });
  console.log('Images uploaded screenshot saved to:', shotPath);

  await browser.disconnect();
}

main().catch(console.error);
