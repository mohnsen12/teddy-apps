const puppeteer = require('puppeteer-core');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const page = (await browser.pages()).find(p => p.url().includes('faq_description') || p.url().includes('fiverr.com'));

  // Click + Add FAQ
  console.log('Clicking + Add FAQ...');
  await page.evaluate(() => {
    const btn = document.querySelector('button.btn-add-faq, button.add-faq');
    if (btn) btn.click();
  });

  await new Promise(r => setTimeout(r, 600));

  // Inspect the inputs that appear
  const inputs = await page.evaluate(() => {
    const all = Array.from(document.querySelectorAll('input, textarea')).map(i => ({
      tag: i.tagName,
      name: i.name,
      placeholder: i.placeholder,
      class: i.className
    }));
    const buttons = Array.from(document.querySelectorAll('button')).map(b => ({
      text: b.innerText.trim(),
      class: b.className
    })).filter(b => b.text.length > 0 && b.text.length < 30);
    return { all, buttons };
  });

  console.log('FAQ Form elements:', JSON.stringify(inputs, null, 2));
  await browser.disconnect();
}

main().catch(console.error);
