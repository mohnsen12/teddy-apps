const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const page = (await browser.pages())[0];

  const gig1Url = 'https://www.fiverr.com/users/teddybot82/manage_gigs/develop-a-custom-microsoft-dynamics-365-business-central-extension/edit?tab=publish&wizard=5';
  console.log('Navigating to Gig 1 publish step:', gig1Url);
  await page.goto(gig1Url, { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 4000));

  const shot1 = path.join(__dirname, 'gig1_publish_screen.png');
  await page.screenshot({ path: shot1, fullPage: true });
  console.log('Saved gig1 publish shot to:', shot1);

  const text = await page.evaluate(() => document.body.innerText);
  console.log('Text snippet:\n', text.slice(0, 1500));

  // Look for Publish Gig button
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
    console.log('Clicked Publish Gig for Gig 1! Waiting 4s...');
    await new Promise(r => setTimeout(r, 4000));

    const shotDone = path.join(__dirname, 'gig1_published_success.png');
    await page.screenshot({ path: shotDone, fullPage: true });
    console.log('Saved gig 1 published confirmation shot to:', shotDone);

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
    console.log('Publish Gig button not found immediately on Gig 1');
  }

  await browser.disconnect();
}

main().catch(console.error);
