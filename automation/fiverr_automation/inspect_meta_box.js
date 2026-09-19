const puppeteer = require('puppeteer-core');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('manage_gigs') || p.url().includes('fiverr.com')) || pages[0];

  const html = await page.evaluate(() => {
    const metaBox = document.querySelector('[class*="metadata"]');
    return metaBox ? metaBox.outerHTML : 'Not found by class';
  });

  console.log('Metadata outerHTML snippet:');
  console.log(html.slice(0, 1500));

  await browser.disconnect();
}

main().catch(console.error);
