const puppeteer = require('puppeteer-core');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const page = (await browser.pages())[0];

  const box = await page.evaluate(() => {
    // Find element with text 'HOLD NEDE' or 'Press & Hold'
    const all = Array.from(document.querySelectorAll('*'));
    const el = all.find(e => e.innerText && e.innerText.trim() === 'HOLD NEDE' && e.children.length === 0) ||
               all.find(e => e.innerText && e.innerText.trim() === 'HOLD NEDE');
    if (el) {
      const rect = el.getBoundingClientRect();
      return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2, width: rect.width, height: rect.height };
    }
    return null;
  });

  console.log('Button center box:', box);
  if (box) {
    console.log('Moving mouse to button and holding down for 10 seconds...');
    await page.mouse.move(box.x, box.y);
    await page.mouse.down();
    await new Promise(r => setTimeout(r, 10000));
    await page.mouse.up();
    console.log('Released mouse. Waiting 3s...');
    await new Promise(r => setTimeout(r, 3000));
  }

  const title = await page.title();
  console.log('Title after attempt:', title);

  await browser.disconnect();
}

main().catch(console.error);
