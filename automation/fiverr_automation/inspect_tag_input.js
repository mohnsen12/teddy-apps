const puppeteer = require('puppeteer-core');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const page = (await browser.pages()).find(p => p.url().includes('manage_gigs') || p.url().includes('fiverr.com'));

  const info = await page.evaluate(() => {
    // Find Positive keywords container
    const labels = Array.from(document.querySelectorAll('*')).filter(e => e.innerText && e.innerText.trim() === 'Positive keywords');
    const container = labels[0]?.closest('section, div[class*="section"], div[class*="form"], div');
    const inputs = Array.from(document.querySelectorAll('input')).map((inp, idx) => ({
      idx,
      type: inp.type,
      class: inp.className,
      placeholder: inp.placeholder,
      parentTag: inp.parentElement?.tagName,
      parentClass: inp.parentElement?.className
    }));
    return { labelsCount: labels.length, inputs };
  });

  console.log('Inputs on page:', JSON.stringify(info, null, 2));
  await browser.disconnect();
}

main().catch(console.error);
