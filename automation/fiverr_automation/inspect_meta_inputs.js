const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('manage_gigs') || p.url().includes('fiverr.com')) || pages[0];

  const metadataInfo = await page.evaluate(() => {
    // Find the gig metadata container
    const metaContainer = Array.from(document.querySelectorAll('*')).find(el => el.innerText && el.innerText.includes('Mandatory metadata is missing'));
    if (!metaContainer) return 'Metadata container not found';

    const inputs = Array.from(metaContainer.querySelectorAll('input, select, button')).map(el => ({
      tag: el.tagName,
      type: el.type,
      name: el.name,
      id: el.id,
      checked: el.checked,
      rect: el.getBoundingClientRect()
    }));

    const tabs = Array.from(metaContainer.querySelectorAll('li, div, span, button')).filter(el => {
      return el.innerText && (el.innerText.includes('PLATFORM') || el.innerText.includes('PROGRAMMING'));
    }).map(el => ({ text: el.innerText.trim(), tag: el.tagName }));

    return { inputs, tabs };
  });

  console.log('Metadata details:', JSON.stringify(metadataInfo, null, 2));

  // Also inspect what options are inside the "CHOOSE ..." dropdown
  const chooseBtn = await page.evaluate(() => {
    const all = Array.from(document.querySelectorAll('*'));
    const btn = all.find(el => el.innerText && el.innerText.trim() === 'CHOOSE ...');
    if (btn) {
      btn.click();
      return true;
    }
    return false;
  });
  console.log('Clicked CHOOSE ...:', chooseBtn);
  await new Promise(r => setTimeout(r, 600));

  const screenshotPath = path.join(__dirname, 'choose_options.png');
  await page.screenshot({ path: screenshotPath });
  console.log('Screenshot saved to:', screenshotPath);

  await browser.disconnect();
}

main().catch(console.error);
