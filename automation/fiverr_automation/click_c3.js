const puppeteer = require('puppeteer-core');
const path = require('path');

async function test() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const page = (await browser.pages())[0];

  const c3 = await page.$('.c3f47d7');
  const box = await c3.boundingBox();
  console.log('c3 boundingBox:', box);

  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
  await new Promise(r => setTimeout(r, 600));

  // Check what new elements appeared in DOM
  const newElements = await page.evaluate(() => {
    const list = Array.from(document.querySelectorAll('li, button, [role="option"], .select-penta-design-box, [class*="option"]'));
    return list.filter(e => e.offsetParent !== null).map(e => e.innerText.trim()).filter(Boolean);
  });
  console.log('Visible elements after click:\n', newElements);

  await page.screenshot({ path: path.join(__dirname, 'c3_clicked.png') });
  await browser.disconnect();
}
test().catch(console.error);
