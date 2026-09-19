const puppeteer = require('puppeteer-core');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('manage_gigs') || p.url().includes('fiverr.com')) || pages[0];

  const html = await page.evaluate(() => {
    const metaOptions = document.querySelector('.metadata-options');
    return metaOptions ? metaOptions.innerHTML : 'metadata-options not found';
  });

  console.log('Metadata-options innerHTML:');
  console.log(html);

  await browser.disconnect();
}

main().catch(console.error);
