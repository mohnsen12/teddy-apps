const puppeteer = require('puppeteer-core');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const page = (await browser.pages()).find(p => p.url().includes('gallery') || p.url().includes('fiverr.com'));

  console.log('Inspecting gallery on:', page.url());

  const fileInputs = await page.evaluate(() => {
    const inputs = Array.from(document.querySelectorAll('input[type="file"]'));
    return inputs.map((inp, idx) => ({
      idx,
      name: inp.name,
      accept: inp.accept,
      multiple: inp.multiple,
      className: inp.className,
      parentTag: inp.parentElement?.tagName,
      parentClass: inp.parentElement?.className
    }));
  });

  console.log('File inputs:', JSON.stringify(fileInputs, null, 2));
  await browser.disconnect();
}

main().catch(console.error);
