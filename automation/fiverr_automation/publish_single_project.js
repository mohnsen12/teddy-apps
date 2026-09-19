const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

async function publishProject(config) {
  console.log(`\n========================================`);
  console.log(`Starting publishing: "${config.title}"`);
  console.log(`========================================`);

  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  let pages = await browser.pages();
  let page = pages.find(p => p.url().includes('portfolio/new'));

  if (!page) {
    let portfolioPage = pages.find(p => p.url().includes('portfolio'));
    if (!portfolioPage) {
      portfolioPage = pages[0];
      await portfolioPage.goto('https://www.fiverr.com/users/teddybot82/portfolio', { waitUntil: 'networkidle2' });
      await new Promise(r => setTimeout(r, 2000));
    }
    
    console.log('Navigating to create new project...');
    await portfolioPage.evaluate(() => {
      const links = Array.from(document.querySelectorAll('a, button'));
      const createBtn = links.find(el => el.innerText && el.innerText.trim().toLowerCase().includes('create new project'));
      if (createBtn) createBtn.click();
    });

    await new Promise(r => setTimeout(r, 3000));
    pages = await browser.pages();
    page = pages.find(p => p.url().includes('portfolio/new'));
    if (!page) {
      console.log('Opening /portfolio/new directly in tab...');
      page = await browser.newPage();
      await page.goto('https://www.fiverr.com/users/teddybot82/portfolio/new', { waitUntil: 'networkidle2' });
    }
  }

  console.log('Active page URL:', page.url());
  await page.bringToFront();

  // Wait for title input
  await page.waitForSelector('input[name="title"]', { timeout: 10000 });

  // 1. Fill Title
  console.log(`Typing title: ${config.title}`);
  await page.focus('input[name="title"]');
  await page.evaluate(() => {
    const t = document.querySelector('input[name="title"]');
    if (t) t.value = '';
  });
  await page.type('input[name="title"]', config.title, { delay: 20 });

  // 2. Select Duration
  if (config.duration) {
    console.log(`Selecting duration: ${config.duration}`);
    await page.evaluate((dur) => {
      const labels = Array.from(document.querySelectorAll('label, div, span'));
      const d = labels.find(l => l.innerText && l.innerText.trim() === dur);
      if (d) d.click();
    }, config.duration);
    await new Promise(r => setTimeout(r, 500));
  }

  // 3. Fill Cost (optional)
  if (config.cost) {
    console.log(`Filling cost: ${config.cost}`);
    const costInput = await page.$('input[name="cost"]');
    if (costInput) {
      await costInput.focus();
      await costInput.type(config.cost.toString(), { delay: 20 });
    }
  }

  // 4. Fill Description overview
  console.log('Filling description overview...');
  await page.focus('textarea[name="overview"]');
  await page.evaluate(() => {
    const o = document.querySelector('textarea[name="overview"]');
    if (o) o.value = '';
  });
  await page.type('textarea[name="overview"]', config.description, { delay: 10 });
  await new Promise(r => setTimeout(r, 500));

  // 5. Upload Attachment via onDropAccepted
  console.log(`Uploading image: ${config.imagePath}`);
  if (!fs.existsSync(config.imagePath)) {
    throw new Error(`File not found: ${config.imagePath}`);
  }

  const filename = path.basename(config.imagePath);
  const imgBase64 = fs.readFileSync(config.imagePath).toString('base64');

  await page.evaluate(async (b64, fname) => {
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
    if (!dropComp) throw new Error('No dropComp found');

    const byteCharacters = atob(b64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'image/png' });
    const file = new File([blob], fname, { type: 'image/png' });

    dropComp.memoizedProps.onDropAccepted([file]);
  }, imgBase64, filename);

  console.log('Waiting for image upload to finish...');
  for (let i = 0; i < 20; i++) {
    await new Promise(r => setTimeout(r, 1000));
    const isUp = await page.evaluate(() => {
      const fileInput = document.querySelector('input[name="attachments"]');
      if (!fileInput) return false;
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
      console.log(`Image upload verified after ${i + 1}s!`);
      break;
    }
  }

  // 6. Click Continue
  console.log('Clicking Continue button to move to Step 2...');
  const continueClicked = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const cont = btns.find(b => b.innerText && b.innerText.trim().toLowerCase() === 'continue' && !b.disabled);
    if (cont) {
      cont.click();
      return true;
    }
    return false;
  });
  console.log('Continue clicked:', continueClicked);

  await new Promise(r => setTimeout(r, 4000));
  console.log('Step 2 reached. URL:', page.url());

  // 7. Select Category: Software Development
  console.log('Checking category...');
  const catInput = await page.$('input[placeholder*="Select a category"]');
  if (catInput) {
    await catInput.focus();
    await catInput.type('Software', { delay: 30 });
    await new Promise(r => setTimeout(r, 800));
    await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll('li, [role="option"], label, div[class*="option"]'));
      const sw = items.find(e => e.innerText && e.innerText.trim() === 'Software Development');
      if (sw) sw.click();
    });
    await new Promise(r => setTimeout(r, 500));
  } else {
    await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll('li, [role="option"], label, div[class*="option"]'));
      const sw = items.find(e => e.innerText && e.innerText.trim() === 'Software Development');
      if (sw) sw.click();
    });
  }

  // 8. Select Related Gig
  if (config.relatedGigSnippet) {
    console.log(`Selecting related gig matching: "${config.relatedGigSnippet}"`);
    const gigSelected = await page.evaluate((snip) => {
      const labels = Array.from(document.querySelectorAll('label, div, p, span'));
      const gig = labels.find(l => l.innerText && l.innerText.toLowerCase().includes(snip.toLowerCase()));
      if (gig) {
        gig.click();
        return true;
      }
      return false;
    }, config.relatedGigSnippet);
    console.log('Related gig selected:', gigSelected);
    await new Promise(r => setTimeout(r, 600));
  }

  // 9. Click Publish project
  console.log('Clicking Publish project...');
  const published = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const pub = btns.find(b => b.innerText && b.innerText.toLowerCase().includes('publish project') && !b.disabled);
    if (pub) {
      pub.click();
      return true;
    }
    return false;
  });
  console.log('Publish project clicked:', published);

  await new Promise(r => setTimeout(r, 5000));
  console.log('URL after publish:', page.url());

  // Close tab or return
  if (page.url().includes('portfolio/new') === false) {
    console.log('Published successfully! Closing project creation tab...');
    await page.close();
  }

  await browser.disconnect();
  return true;
}

module.exports = { publishProject };

if (require.main === module) {
  publishProject({
    title: 'Automated Bookkeeping Engine for Business Central',
    duration: '7-30 days',
    cost: 750,
    description: 'Automated bookkeeping engine in Dynamics 365 Business Central. Automatically parses bank statements, matches general ledger entries, applies payment reconciliations, and posts routine journal lines without manual intervention.',
    imagePath: '/Users/teddy/teddy-apps/marketing/assets/fiverr/portfolio/automatisk-bogforing.png',
    relatedGigSnippet: 'develop a custom microsoft dynamics 365'
  }).then(() => console.log('>>> Project 2 Completed Successfully! <<<'))
    .catch(console.error);
}
