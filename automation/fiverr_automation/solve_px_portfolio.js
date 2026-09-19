const puppeteer = require('puppeteer-core');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const page = (await browser.pages()).find(p => p.url().includes('portfolio'));

  console.log('Targeting page:', page.url());

  // Check if inside iframe or main document
  let box = await page.evaluate(() => {
    const all = Array.from(document.querySelectorAll('*'));
    const el = all.find(e => e.innerText && e.innerText.toLowerCase().includes('hold nede') && e.children.length === 0) ||
               all.find(e => e.innerText && e.innerText.toLowerCase().includes('hold nede'));
    if (el) {
      const rect = el.getBoundingClientRect();
      return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2, width: rect.width, height: rect.height };
    }
    return null;
  });

  console.log('Button box in main frame:', box);

  if (!box) {
    // Check frames
    for (const frame of page.frames()) {
      try {
        const frameBox = await frame.evaluate(() => {
          const all = Array.from(document.querySelectorAll('*'));
          const el = all.find(e => e.innerText && e.innerText.toLowerCase().includes('hold nede'));
          if (el) {
            const rect = el.getBoundingClientRect();
            return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
          }
          return null;
        });
        if (frameBox) {
          console.log('Found inside frame:', frameBox);
          const frameEl = await frame.frameElement();
          const fRect = await frameEl.boundingBox();
          box = { x: fRect.x + frameBox.x, y: fRect.y + frameBox.y };
          break;
        }
      } catch(e){}
    }
  }

  if (box) {
    console.log('Moving mouse to button at', box, 'and holding down for 11 seconds...');
    await page.mouse.move(box.x, box.y);
    await page.mouse.down();
    await new Promise(r => setTimeout(r, 11000));
    await page.mouse.up();
    console.log('Released mouse. Waiting 4s...');
    await new Promise(r => setTimeout(r, 4000));
  } else {
    console.log('Hold nede button not found!');
  }

  await page.screenshot({ path: '/Users/teddy/teddy-apps/automation/fiverr_automation/after_px_hold.png' });
  console.log('Saved after_px_hold.png');

  await browser.disconnect();
}

main().catch(console.error);
