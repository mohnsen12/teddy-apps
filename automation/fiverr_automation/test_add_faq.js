const puppeteer = require('puppeteer-core');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const page = (await browser.pages()).find(p => p.url().includes('faq_description') || p.url().includes('fiverr.com'));

  const q = 'Do you develop in our own environment?';
  const a = 'Yes. Development takes place in your BC sandbox. Go-live happens in your production environment alongside you.';

  // Fill question
  const qInput = await page.$('input[placeholder*="Add a Question"]');
  if (qInput) {
    await qInput.focus();
    await page.keyboard.type(q, { delay: 20 });
  }

  // Fill answer
  const aInput = await page.$('textarea[placeholder*="Add an Answer"]');
  if (aInput) {
    await aInput.focus();
    await page.keyboard.type(a, { delay: 20 });
  }

  // Click Add
  const addBtn = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.innerText.trim() === 'Add');
    if (btn) {
      btn.click();
      return true;
    }
    return false;
  });
  console.log('Clicked Add:', addBtn);

  await new Promise(r => setTimeout(r, 1000));

  // Check what FAQs are now displayed
  const faqs = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.faq-item, [class*="faq"]')).map(el => el.innerText.trim()).filter(Boolean);
  });
  console.log('FAQs count/text:', faqs.slice(0, 5));

  await browser.disconnect();
}

main().catch(console.error);
