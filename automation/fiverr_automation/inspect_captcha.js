const puppeteer = require('puppeteer-core');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('manage_gigs') || p.url().includes('fiverr.com')) || pages[0];

  const frames = page.frames();
  console.log('Frames count:', frames.length);
  frames.forEach((f, i) => console.log(`Frame ${i}: ${f.url()}`));

  const buttonInfo = await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('*')).find(e => e.innerText && e.innerText.trim() === 'Hold nede');
    if (btn) {
      const rect = btn.getBoundingClientRect();
      return { tag: btn.tagName, id: btn.id, class: btn.className, rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height } };
    }
    return null;
  });
  console.log('Button info in main page:', buttonInfo);

  await browser.disconnect();
}

main().catch(console.error);
