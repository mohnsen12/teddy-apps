const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('seller_onboarding') || p.url().includes('fiverr.com')) || pages[0];

  // Set Display Name and Title using React's native prototype setter
  const res = await page.evaluate(() => {
    const setNativeValue = (el, value) => {
      const proto = el.tagName === 'TEXTAREA' ? window.HTMLTextAreaElement.prototype : window.HTMLInputElement.prototype;
      const setter = Object.getOwnPropertyDescriptor(proto, 'value').set;
      setter.call(el, value);
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
      el.dispatchEvent(new Event('blur', { bubbles: true }));
    };

    const nameInput = document.querySelector('input[placeholder*="display name" i]');
    if (nameInput) {
      setNativeValue(nameInput, 'Claus M.');
    }

    const titleInput = document.querySelector('input[placeholder*="title" i]');
    if (titleInput) {
      setNativeValue(titleInput, 'Business Central Specialist');
    }

    return {
      name: nameInput?.value,
      title: titleInput?.value
    };
  });

  console.log('Result from native setter:', res);
  await new Promise(r => setTimeout(r, 1500));

  const screenshotPath = path.join(__dirname, 'react_native_set.png');
  await page.screenshot({ path: screenshotPath });
  console.log('Screenshot saved to:', screenshotPath);

  await browser.disconnect();
}

main().catch(console.error);
