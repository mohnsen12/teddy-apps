const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('manage_gigs') || p.url().includes('fiverr.com')) || pages[0];

  console.log('Current URL:', page.url());

  // Check toggle for "Offer packages"
  const toggleInfo = await page.evaluate(() => {
    const toggle = document.querySelector('label[class*="toggle"], input[type="checkbox"]');
    const label = Array.from(document.querySelectorAll('*')).find(e => e.innerText && e.innerText.includes('Offer packages'));
    return {
      toggleFound: !!toggle,
      toggleType: toggle ? toggle.tagName : null,
      labelText: label ? label.innerText : null
    };
  });
  console.log('Toggle info:', toggleInfo);

  // Toggle "Offer packages" ON if not already on
  await page.evaluate(() => {
    const toggleContainer = document.querySelector('.packages-toggle, label[class*="toggle"], [class*="switch"]');
    if (toggleContainer) {
      toggleContainer.click();
    } else {
      const checkbox = document.querySelector('input[type="checkbox"]');
      if (checkbox && !checkbox.checked) checkbox.click();
    }
  });

  await new Promise(r => setTimeout(r, 1500));

  // Inspect the table structure after toggling
  const tableData = await page.evaluate(() => {
    const inputs = Array.from(document.querySelectorAll('input, textarea, select')).map(el => ({
      tagName: el.tagName,
      type: el.type,
      name: el.name,
      placeholder: el.placeholder,
      className: el.className,
      value: el.value
    }));
    return {
      inputsCount: inputs.length,
      sampleInputs: inputs
    };
  });

  console.log('Table inputs:', JSON.stringify(tableData, null, 2));

  const screenshotPath = path.join(__dirname, 'pricing_toggled.png');
  await page.screenshot({ path: screenshotPath, fullPage: true });
  console.log('Screenshot saved to:', screenshotPath);

  await browser.disconnect();
}

main().catch(console.error);
