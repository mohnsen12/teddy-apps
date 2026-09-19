const puppeteer = require('puppeteer-core');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const pages = await browser.pages();
  if (pages.length > 1 && pages[0].url().includes('sellers/teddybot82/edit')) {
    const t0 = await pages[0].title();
    if (t0.includes('human touch')) {
      console.log('Closing stuck Tab 0...');
      await pages[0].close();
    }
  }
  const remaining = await browser.pages();
  console.log('Remaining pages:', remaining.length);
  await browser.disconnect();
}

main().catch(console.error);
