const puppeteer = require('puppeteer-core');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const page = (await browser.pages()).find(p => p.url().includes('faq_description') || p.url().includes('fiverr.com'));

  const info = await page.evaluate(() => {
    const editors = Array.from(document.querySelectorAll('[contenteditable="true"], textarea, .ql-editor, [class*="editor"]')).map(el => ({
      tag: el.tagName,
      className: el.className,
      contentEditable: el.contentEditable,
      placeholder: el.placeholder
    }));

    const faqBtns = Array.from(document.querySelectorAll('button, a')).filter(b => b.innerText && b.innerText.includes('FAQ')).map(b => ({
      tag: b.tagName,
      text: b.innerText.trim(),
      className: b.className
    }));

    return { editors, faqBtns };
  });

  console.log('Description editors & FAQ info:', JSON.stringify(info, null, 2));
  await browser.disconnect();
}

main().catch(console.error);
