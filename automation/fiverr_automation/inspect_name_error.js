const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('seller_onboarding') || p.url().includes('fiverr.com')) || pages[0];

  const info = await page.evaluate(() => {
    const errorEl = document.querySelector('[class*="error"], span, p, div');
    const inputs = Array.from(document.querySelectorAll('input, textarea')).map(i => ({
      tag: i.tagName,
      placeholder: i.placeholder,
      value: i.value,
      name: i.name
    }));
    return {
      inputs,
      text: document.body ? document.body.innerText.slice(0, 500) : ''
    };
  });

  console.log('Inputs and errors:', JSON.stringify(info, null, 2));

  // Let's click on the name to edit it
  // Find pencil or text where "violates" is
  await page.evaluate(() => {
    const pencil = document.querySelector('svg');
    // Find pencil near name
    const svgs = Array.from(document.querySelectorAll('svg'));
    for (const s of svgs) {
      if (s.parentElement && s.parentElement.innerText && s.parentElement.innerText.includes('violates')) {
        s.parentElement.click();
      }
    }
  });

  await browser.disconnect();
}

main().catch(console.error);
