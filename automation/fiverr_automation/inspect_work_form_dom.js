const puppeteer = require('puppeteer-core');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const page = (await browser.pages())[0];

  const details = await page.evaluate(() => {
    const form = document.querySelector('[class*="work-experience"], [class*="form"], div[role="dialog"]') || document.body;
    const inputs = Array.from(document.querySelectorAll('input[placeholder], textarea[placeholder], [role="combobox"], [role="button"]'));
    return inputs.map(el => ({
      tag: el.tagName,
      role: el.getAttribute('role'),
      placeholder: el.placeholder || '',
      ariaLabel: el.getAttribute('aria-label') || '',
      id: el.id,
      name: el.name
    })).filter(x => x.placeholder || x.ariaLabel);
  });
  console.log('Inputs with placeholders/labels:', details);

  // Check buttons inside the work experience section
  const btns = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('button')).map(b => b.innerText.trim()).filter(Boolean);
  });
  console.log('Buttons:', btns);

  await browser.disconnect();
}

main().catch(console.error);
