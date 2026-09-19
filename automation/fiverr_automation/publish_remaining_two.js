const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const projects = [
  {
    name: 'Project 3 (Forhandler indkøbspanel)',
    title: 'B2B Dealer Purchase Portal for Business Central',
    industry: 'Technology',
    durationVal: 'ONE_TO_THREE_MONTHS',
    cost: '1200',
    monthVal: '5', // June
    yearVal: '2024',
    description: 'Built a secure self-service B2B dealer ordering portal connected directly to Business Central via REST APIs. Dealers can check live inventory, customer-specific pricing, place bulk orders, and view invoice history 24/7 with zero manual order entry.',
    imagePath: '/Users/teddy/teddy-apps/marketing/assets/fiverr/portfolio/forhandler-indkobspanel.png',
    gigSearch: 'build a business central b2b portal'
  },
  {
    name: 'Project 4 (Rykkerprocedurer)',
    title: 'Automated Dunning & Payment Reminders for BC',
    industry: 'Technology',
    durationVal: 'SEVEN_TO_THIRTY_DAYS',
    cost: '500',
    monthVal: '9', // October
    yearVal: '2024',
    description: 'Custom dunning and reminder workflow for Business Central. Automatically generates tiered reminder notices, computes late payment interest, produces compliant PDF dunning letters, and emails overdue customers on predefined recurring schedules.',
    imagePath: '/Users/teddy/teddy-apps/marketing/assets/fiverr/portfolio/rykkerprocedurer.png',
    gigSearch: 'develop a custom microsoft dynamics 365'
  }
];

async function addProject(browser, proj) {
  console.log(`\n========================================`);
  console.log(`Starting: ${proj.name} - "${proj.title}"`);
  console.log(`========================================`);

  let pages = await browser.pages();
  let portfolioPage = pages.find(p => p.url().includes('portfolio') && !p.url().includes('/new'));
  if (!portfolioPage) portfolioPage = pages[0];

  // Click "Create new project"
  console.log('Clicking "Create new project"...');
  await portfolioPage.evaluate(() => {
    const links = Array.from(document.querySelectorAll('a, button'));
    const btn = links.find(el => el.innerText && el.innerText.trim().toLowerCase().includes('create new project'));
    if (btn) btn.click();
  });

  await new Promise(r => setTimeout(r, 3500));
  pages = await browser.pages();
  let newTab = pages.find(p => p.url().includes('portfolio/new'));
  if (!newTab) {
    console.log('Opening /portfolio/new directly...');
    newTab = await browser.newPage();
    await newTab.goto('https://www.fiverr.com/users/teddybot82/portfolio/new', { waitUntil: 'networkidle2' });
  }

  await newTab.bringToFront();
  await newTab.waitForSelector('input[name="title"]', { timeout: 15000 });

  // 1. Title
  console.log(`Typing title: ${proj.title}`);
  await newTab.focus('input[name="title"]');
  await newTab.evaluate(() => {
    const t = document.querySelector('input[name="title"]');
    if (t) t.value = '';
  });
  await newTab.type('input[name="title"]', proj.title, { delay: 15 });

  // 2. Industry
  console.log('Selecting Industry: Technology...');
  const indInput = await newTab.$('input[placeholder*="Select an industry"]');
  if (indInput) {
    await indInput.focus();
    await indInput.type('Tech', { delay: 30 });
    await new Promise(r => setTimeout(r, 600));
    const clickedInd = await newTab.evaluate(() => {
      const options = Array.from(document.querySelectorAll('li, [role="option"], label, span'));
      const t = options.find(o => o.innerText && o.innerText.trim() === 'Technology');
      if (t) {
        t.click();
        return true;
      }
      return false;
    });
    console.log('Industry selected:', clickedInd);
    await new Promise(r => setTimeout(r, 400));
    await newTab.keyboard.press('Escape');
  }

  // 3. Duration radio
  console.log(`Selecting duration radio: ${proj.durationVal}...`);
  await newTab.evaluate((dVal) => {
    const r = document.querySelector(`input[type="radio"][value="${dVal}"]`);
    if (r) r.click();
  }, proj.durationVal);

  // 4. Cost
  if (proj.cost) {
    console.log(`Typing cost: ${proj.cost}...`);
    const cInput = await newTab.$('input[name="cost"]');
    if (cInput) {
      await cInput.focus();
      await cInput.type(proj.cost, { delay: 20 });
    }
  }

  // 5. Date radios (month and year)
  console.log(`Selecting month ${proj.monthVal} and year ${proj.yearVal}...`);
  await newTab.evaluate((mVal, yVal) => {
    const mr = document.querySelector(`input[type="radio"][value="${mVal}"]`);
    if (mr) mr.click();
    const yr = document.querySelector(`input[type="radio"][value="${yVal}"]`);
    if (yr) yr.click();
  }, proj.monthVal, proj.yearVal);

  // 6. Description
  console.log('Filling description...');
  await newTab.focus('textarea[name="overview"]');
  await newTab.type('textarea[name="overview"]', proj.description, { delay: 10 });
  await new Promise(r => setTimeout(r, 500));

  // 7. Upload Image
  console.log(`Uploading image: ${proj.imagePath}...`);
  const filename = path.basename(proj.imagePath);
  const imgBase64 = fs.readFileSync(proj.imagePath).toString('base64');

  await newTab.evaluate(async (b64, fname) => {
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

  console.log('Waiting for image upload...');
  for (let i = 0; i < 20; i++) {
    await new Promise(r => setTimeout(r, 1000));
    const isUp = await newTab.evaluate(() => {
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
      console.log(`Upload confirmed in ${i + 1}s!`);
      break;
    }
  }

  // 8. Click Continue to Step 2
  console.log('Clicking Continue...');
  await newTab.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const cont = btns.find(b => b.innerText && b.innerText.trim().toLowerCase() === 'continue');
    if (cont) cont.click();
  });

  await new Promise(r => setTimeout(r, 4000));

  // 9. Step 2: Category & Gig
  console.log('Step 2: Selecting Software Development...');
  const catInput = await newTab.$('input[placeholder*="Select a category"]');
  if (catInput) {
    await catInput.focus();
    await catInput.type('Software', { delay: 30 });
    await new Promise(r => setTimeout(r, 800));
    const swClicked = await newTab.evaluate(() => {
      const options = Array.from(document.querySelectorAll('li, [role="option"], label, span'));
      const sw = options.find(o => o.innerText && o.innerText.trim() === 'Software Development');
      if (sw) {
        sw.click();
        return true;
      }
      return false;
    });
    console.log('Category clicked:', swClicked);
    await new Promise(r => setTimeout(r, 500));
  }

  console.log(`Selecting related gig: "${proj.gigSearch}"...`);
  const gigChecked = await newTab.evaluate((search) => {
    const checkboxes = Array.from(document.querySelectorAll('input[type="checkbox"]'));
    const target = checkboxes.find(cb => {
      let p = cb.parentElement;
      while (p && !p.innerText) p = p.parentElement;
      return p && p.innerText.toLowerCase().includes(search.toLowerCase());
    });
    if (target) {
      target.click();
      return true;
    }
    return false;
  }, proj.gigSearch);
  console.log('Gig checked:', gigChecked);
  await new Promise(r => setTimeout(r, 600));

  // 10. Click Publish project
  console.log('Clicking Publish project...');
  const pubClicked = await newTab.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const pub = btns.find(b => b.innerText && b.innerText.trim().toLowerCase() === 'publish project' && !b.disabled);
    if (pub) {
      pub.click();
      return true;
    }
    return false;
  });
  console.log('Publish project clicked:', pubClicked);

  await new Promise(r => setTimeout(r, 6000));
  console.log(`Published ${proj.name}! Current URL: ${newTab.url()}`);

  try {
    await newTab.close();
  } catch(e) {}
}

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  
  for (const p of projects) {
    await addProject(browser, p);
    await new Promise(r => setTimeout(r, 3000));
  }

  console.log('\n========================================');
  console.log('ALL PORTFOLIO PROJECTS PUBLISHED!');
  console.log('========================================');
  await browser.disconnect();
}

main().catch(console.error);
