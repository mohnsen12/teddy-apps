const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const page = (await browser.pages()).find(p => p.url().includes('portfolio/new'));

  console.log('Filling Project 1 title...');
  await page.focus('input[name="title"]');
  // Clear and type
  await page.evaluate(() => {
    const t = document.querySelector('input[name="title"]');
    if (t) t.value = '';
  });
  await page.type('input[name="title"]', 'GLS ShipIT Integration for Business Central');

  console.log('Selecting Duration: 7-30 days...');
  await page.evaluate(() => {
    const labels = Array.from(document.querySelectorAll('label, div, span'));
    const d = labels.find(l => l.innerText && l.innerText.trim() === '7-30 days');
    if (d) d.click();
  });

  console.log('Filling Description overview...');
  await page.focus('textarea[name="overview"]');
  await page.type('textarea[name="overview"]', 'Automated logistics integration between Microsoft Dynamics 365 Business Central and GLS ShipIT REST API. Generates labels and syncs parcel tracking automatically.');

  console.log('Uploading image attachment...');
  const imgPath = '/Users/teddy/teddy-apps/marketing/assets/fiverr/portfolio/gls-integration.png';
  const fileInput = await page.$('input[name="attachments"]');
  if (fileInput) {
    await fileInput.uploadFile(imgPath);
    console.log('Uploaded image:', imgPath);
  }

  await new Promise(r => setTimeout(r, 4000));

  await page.screenshot({ path: path.join(__dirname, 'project1_filled_step1.png'), fullPage: true });
  console.log('Saved project1_filled_step1.png');

  console.log('Clicking Continue button...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const cont = btns.find(b => b.innerText.trim().toLowerCase() === 'continue');
    if (cont) cont.click();
  });

  await new Promise(r => setTimeout(r, 4000));
  console.log('Current URL after continue:', page.url());

  await page.screenshot({ path: path.join(__dirname, 'project1_step2_reached.png'), fullPage: true });
  console.log('Saved project1_step2_reached.png');

  await browser.disconnect();
}

main().catch(console.error);
