const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const page = (await browser.pages()).find(p => p.url().includes('pricing'));

  // Find the revision dropdowns: .flex .select-penta-design
  const revs = await page.$$('.flex .select-penta-design');
  console.log('Revisions dropdowns count:', revs.length);

  if (revs.length > 0) {
    const el = revs[0];
    await page.evaluate(e => e.scrollIntoView({ block: 'center' }), el);
    await new Promise(r => setTimeout(r, 400));
    const box = await el.boundingBox();
    await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
    await new Promise(r => setTimeout(r, 800));

    await page.screenshot({ path: path.join(__dirname, 'revisions_dropdown_open.png') });
    console.log('Screenshot saved');
  }

  await browser.disconnect();
}

main().catch(console.error);
