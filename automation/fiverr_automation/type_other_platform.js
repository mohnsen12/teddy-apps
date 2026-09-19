const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('manage_gigs') || p.url().includes('fiverr.com')) || pages[0];

  console.log('Connected to page:', page.url());

  // Find the text input under Other
  const inputInfo = await page.evaluate(() => {
    const inputs = Array.from(document.querySelectorAll('input[type="text"]'));
    return inputs.map(inp => ({
      className: inp.className,
      placeholder: inp.placeholder,
      value: inp.value,
      parentClass: inp.parentElement?.className
    }));
  });
  console.log('Found text inputs:', inputInfo);

  // Click and type into the other input
  const targetSelector = 'input[type="text"]:not([class*="tag"])'; // or find by parent
  const inputHandle = await page.evaluateHandle(() => {
    const inputs = Array.from(document.querySelectorAll('input[type="text"]'));
    // It's the one inside the metadata or not the tag input
    return inputs.find(i => i.closest('.metadata-container') || i.closest('[class*="meta"]')) || inputs[inputs.length - 1];
  });

  if (inputHandle) {
    console.log('Focusing input...');
    await inputHandle.asElement().focus();
    await page.keyboard.type('Microsoft Dynamics 365', { delay: 50 });
    console.log('Typed Microsoft Dynamics 365');
  }

  await new Promise(r => setTimeout(r, 1000));

  // Check checkmark status on Platforms
  const status = await page.evaluate(() => {
    const li = document.querySelector('.metadata-names-list li');
    return {
      className: li?.className,
      hasCheck: !!li?.querySelector('.icn-green-check.visible')
    };
  });
  console.log('Platforms checkmark status:', status);

  await page.screenshot({ path: path.join(__dirname, 'typed_other.png') });
  await browser.disconnect();
}

main().catch(console.error);
