const puppeteer = require('puppeteer-core');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const page = (await browser.pages()).find(p => p.url().includes('pricing'));

  const dur = (await page.$$('.pkg-duration-input .select-penta-design-content'))[0];
  await page.evaluate(e => e.scrollIntoView({ block: 'center' }), dur);
  await new Promise(r => setTimeout(r, 300));
  const box = await dur.boundingBox();
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
  await new Promise(r => setTimeout(r, 600));

  // Find all elements that have text with DAYS
  const menuInfo = await page.evaluate(() => {
    const all = Array.from(document.querySelectorAll('*'));
    return all
      .filter(e => e.textContent && e.textContent.includes('DELIVERY') && e.children.length === 0)
      .map(e => ({
        tag: e.tagName,
        className: e.className,
        text: e.textContent.trim(),
        parentTag: e.parentElement?.tagName,
        parentClass: e.parentElement?.className
      }));
  });

  console.log('Menu items found:', menuInfo);
  await browser.disconnect();
}

main().catch(console.error);
