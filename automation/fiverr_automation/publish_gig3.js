const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const page = (await browser.pages())[0];

  const gig3Url = 'https://www.fiverr.com/users/teddybot82/manage_gigs/build-a-business-central-b2b-portal-or-customer-self-service-solution/edit?tab=publish&wizard=5';
  console.log('Navigating to Gig 3 publish step:', gig3Url);
  await page.goto(gig3Url, { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 4000));

  const text = await page.evaluate(() => document.body.innerText);
  console.log('Gig 3 Publish page text:\n', text.slice(0, 1000));

  // Click Publish Gig button
  const published = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button, a'));
    const pubBtn = btns.find(b => b.innerText && b.innerText.trim().toLowerCase() === 'publish gig');
    if (pubBtn) {
      pubBtn.click();
      return true;
    }
    return false;
  });

  if (published) {
    console.log('Clicked Publish Gig for Gig 3! Waiting 4s...');
    await new Promise(r => setTimeout(r, 4000));

    const shotDone = path.join(__dirname, 'gig3_published_success.png');
    await page.screenshot({ path: shotDone, fullPage: true });
    console.log('Saved gig 3 published confirmation shot to:', shotDone);

    const afterText = await page.evaluate(() => document.body.innerText);
    console.log('After text snippet:\n', afterText.slice(0, 1000));

    // Click Done if present
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button, a'));
      const doneBtn = btns.find(b => b.innerText && b.innerText.trim().toLowerCase() === 'done');
      if (doneBtn) doneBtn.click();
    });
    await new Promise(r => setTimeout(r, 2000));
  } else {
    console.log('Publish Gig button not found immediately on Gig 3');
  }

  // Finally navigate to Manage Gigs to see all 3 ACTIVE!
  await page.goto('https://www.fiverr.com/users/teddybot82/manage_gigs', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 3000));

  const finalShot = path.join(__dirname, 'all_three_active.png');
  await page.screenshot({ path: finalShot, fullPage: true });
  console.log('Saved all active screenshot to:', finalShot);

  const activeGigs = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('table tbody tr a, .gig-title a')).map(a => ({ text: a.innerText.trim(), href: a.href }));
  });
  console.log('All active gigs in table:', JSON.stringify(activeGigs, null, 2));

  await browser.disconnect();
}

main().catch(console.error);
