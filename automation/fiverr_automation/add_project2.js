const puppeteer = require('puppeteer-core');
const fs = require('fs');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const page = (await browser.pages()).find(p => p.url().includes('portfolio'));

  console.log('Navigating to create project...');
  await page.evaluate(() => {
    const a = Array.from(document.querySelectorAll('a, button')).find(el => el.innerText && el.innerText.includes('Create new project'));
    if (a) a.click();
  });
  await new Promise(r => setTimeout(r, 3000));

  console.log('Current URL:', page.url());

  // 1. Fill Project Title
  console.log('Filling Title...');
  await page.focus('input[name="title"]');
  await page.type('input[name="title"]', 'Automated Bookkeeping Engine for Business Central');

  // 2. Select Industry: Technology
  console.log('Selecting Industry...');
  await page.focus('input[placeholder*="Select an industry"]');
  await page.type('input[placeholder*="Select an industry"]', 'Technology');
  await new Promise(r => setTimeout(r, 600));
  await page.evaluate(() => {
    const items = Array.from(document.querySelectorAll('li, [role="option"], label, div[class*="option"]'));
    const tech = items.find(el => el.innerText && el.innerText.trim() === 'Technology');
    if (tech) tech.click();
  });
  await new Promise(r => setTimeout(r, 400));
  await page.keyboard.press('Escape');

  // 3. Duration: 7-30 days
  console.log('Selecting Duration...');
  await page.evaluate(() => {
    const labels = Array.from(document.querySelectorAll('label, div, span'));
    const d = labels.find(l => l.innerText && l.innerText.trim() === '7-30 days');
    if (d) d.click();
  });

  // 4. Project cost: 750
  console.log('Filling Cost...');
  await page.focus('input[name="cost"]');
  await page.type('input[name="cost"]', '750');

  // 5. Date: August 2024
  console.log('Selecting Date: August 2024...');
  await page.click('[data-track-value="started_at_month"] [data-track-tag="select"]');
  await new Promise(r => setTimeout(r, 500));
  await page.evaluate(() => {
    const all = Array.from(document.querySelectorAll('*'));
    const m = all.find(e => e.innerText && e.innerText.trim().toLowerCase() === 'august');
    if (m) m.click();
  });
  await new Promise(r => setTimeout(r, 500));

  await page.click('[data-track-value="started_at_year"] [data-track-tag="select"]');
  await new Promise(r => setTimeout(r, 500));
  await page.evaluate(() => {
    const all = Array.from(document.querySelectorAll('*'));
    const y = all.find(e => e.innerText && e.innerText.trim() === '2024');
    if (y) y.click();
  });
  await new Promise(r => setTimeout(r, 500));

  // 6. Description
  console.log('Filling Description...');
  await page.focus('textarea[name="overview"]');
  await page.type('textarea[name="overview"]', 'Automated bookkeeping engine in Dynamics 365 Business Central. Automatically parses bank statements, matches general ledger entries, applies payment reconciliations, and posts routine journal lines without manual intervention.');

  // 7. Upload Image: automatisk-bogforing.png
  console.log('Uploading image...');
  const imgBase64 = fs.readFileSync('/Users/teddy/teddy-apps/marketing/assets/fiverr/portfolio/automatisk-bogforing.png').toString('base64');
  await page.evaluate(async (b64) => {
    const fileInput = document.querySelector('input[name="attachments"]');
    let k = Object.keys(fileInput).find(k => k.startsWith('__reactFiber'));
    let f = fileInput[k];
    let dropComp = null;
    while (f) {
      if (f.memoizedProps && f.memoizedProps.onDropAccepted) {
        dropComp = f;
        break;
      }
      f = f.return;
    }
    const byteCharacters = atob(b64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'image/png' });
    const file = new File([blob], 'automatisk-bogforing.png', { type: 'image/png' });
    dropComp.memoizedProps.onDropAccepted([file]);
  }, imgBase64);

  // Wait for upload completion
  console.log('Waiting for upload...');
  for (let i = 0; i < 15; i++) {
    await new Promise(r => setTimeout(r, 1000));
    const isUp = await page.evaluate(() => {
      const fileInput = document.querySelector('input[name="attachments"]');
      let k = Object.keys(fileInput).find(k => k.startsWith('__reactFiber'));
      let f = fileInput[k];
      while (f) {
        if (f.memoizedProps && f.memoizedProps.filerrUploaderOptions) {
          const val = f.memoizedProps.value;
          return val && val[0] && val[0].uploaded;
        }
        f = f.return;
      }
      return false;
    });
    if (isUp) {
      console.log('Upload completed successfully!');
      break;
    }
  }

  // 8. Click Continue
  console.log('Clicking Continue...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const cont = btns.find(b => b.innerText.trim().toLowerCase() === 'continue');
    if (cont) cont.click();
  });
  await new Promise(r => setTimeout(r, 4000));

  // 9. Step 2: Category & Related Gig
  console.log('Filling Step 2...');
  const catInput = await page.$('input[placeholder*="Select a category"]');
  if (catInput) {
    await catInput.focus();
    await catInput.type('Software');
    await new Promise(r => setTimeout(r, 600));
    await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll('li, [role="option"], label, div[class*="option"]'));
      const sw = items.find(e => e.innerText && e.innerText.trim() === 'Software Development');
      if (sw) sw.click();
    });
  }

  console.log('Checking related gig...');
  await page.evaluate(() => {
    const labels = Array.from(document.querySelectorAll('label, div, p, span'));
    const gig = labels.find(l => l.innerText && l.innerText.toLowerCase().includes('develop a custom microsoft dynamics 365'));
    if (gig) gig.click();
  });
  await new Promise(r => setTimeout(r, 600));

  console.log('Publishing project 2...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const pub = btns.find(b => b.innerText.toLowerCase().includes('publish project'));
    if (pub) pub.click();
  });
  await new Promise(r => setTimeout(r, 5000));

  console.log('URL after project 2 publish:', page.url());
  await page.screenshot({ path: '/Users/teddy/teddy-apps/automation/fiverr_automation/project2_published.png', fullPage: true });
  console.log('Saved project2_published.png');

  await browser.disconnect();
}

main().catch(console.error);
