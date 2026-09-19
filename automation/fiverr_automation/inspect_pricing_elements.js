const puppeteer = require('puppeteer-core');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('manage_gigs') || p.url().includes('fiverr.com')) || pages[0];

  const info = await page.evaluate(() => {
    // Textareas
    const textareas = Array.from(document.querySelectorAll('textarea')).map((ta, i) => ({
      index: i,
      name: ta.name,
      placeholder: ta.placeholder,
      className: ta.className,
      value: ta.value
    }));

    // Selects / Dropdowns
    const selects = Array.from(document.querySelectorAll('select')).map((s, i) => ({
      index: i,
      name: s.name,
      className: s.className,
      options: Array.from(s.options).map(o => ({ value: o.value, text: o.text }))
    }));

    // Price inputs
    const priceInputs = Array.from(document.querySelectorAll('input[type="number"], input[name*="price"]')).map((inp, i) => ({
      index: i,
      name: inp.name,
      type: inp.type,
      placeholder: inp.placeholder,
      className: inp.className,
      value: inp.value
    }));

    // Checkboxes
    const checkboxes = Array.from(document.querySelectorAll('table input[type="checkbox"], .packages input[type="checkbox"]')).map((cb, i) => ({
      index: i,
      name: cb.name,
      id: cb.id,
      checked: cb.checked
    }));

    return { textareas, selects, priceInputs, checkboxes };
  });

  console.log('--- TEXTAREAS ---');
  console.log(JSON.stringify(info.textareas, null, 2));
  console.log('--- PRICE INPUTS ---');
  console.log(JSON.stringify(info.priceInputs, null, 2));
  console.log('--- SELECTS ---');
  console.log(JSON.stringify(info.selects.map(s => ({ name: s.name, sampleOptions: s.options.slice(0, 5) })), null, 2));
  console.log('--- CHECKBOXES ---');
  console.log(JSON.stringify(info.checkboxes, null, 2));

  await browser.disconnect();
}

main().catch(console.error);
