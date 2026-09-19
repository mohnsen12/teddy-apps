const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const page = (await browser.pages()).find(p => p.url().includes('requirements') || p.url().includes('fiverr.com'));

  console.log('Inspecting requirements on:', page.url());

  // Click + Add New Question
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.innerText && b.innerText.includes('Add New Question'));
    if (btn) btn.click();
  });

  await new Promise(r => setTimeout(r, 600));

  const formElements = await page.evaluate(() => {
    const inputs = Array.from(document.querySelectorAll('input, textarea')).map(i => ({
      tag: i.tagName,
      type: i.type,
      placeholder: i.placeholder,
      class: i.className
    }));
    const buttons = Array.from(document.querySelectorAll('button')).map(b => b.innerText.trim()).filter(Boolean);
    return { inputs, buttons };
  });

  console.log('Form elements:', JSON.stringify(formElements, null, 2));

  const shotPath = path.join(__dirname, 'add_question_open.png');
  await page.screenshot({ path: shotPath, fullPage: true });
  console.log('Saved screenshot to:', shotPath);

  await browser.disconnect();
}

main().catch(console.error);
