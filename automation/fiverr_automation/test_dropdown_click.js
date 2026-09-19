const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const page = (await browser.pages()).find(p => p.url().includes('pricing'));

  const el = await page.$('.pkg-duration-input .select-penta-design-content');
  await page.evaluate(e => e.scrollIntoView({ block: 'center' }), el);
  await new Promise(r => setTimeout(r, 400));

  const box = await el.boundingBox();
  console.log('Bounding Box after scroll:', box);
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
  await new Promise(r => setTimeout(r, 800));

  await page.screenshot({ path: path.join(__dirname, 'after_click_duration.png') });
  console.log('Screenshot saved');

  const visibleTexts = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('*'))
      .filter(e => e.children.length === 0 && e.offsetParent !== null && e.innerText && e.innerText.includes('Day'))
      .map(e => ({ text: e.innerText.trim(), tag: e.tagName, class: e.className }));
  });
  console.log('Visible Day texts:', visibleTexts);

  await browser.disconnect();
}

main().catch(console.error);
