const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('seller_onboarding') || p.url().includes('fiverr.com')) || pages[0];

  const profileData = await page.evaluate(() => {
    // Collect all edit buttons, inputs, textareas, file inputs
    const editButtons = Array.from(document.querySelectorAll('button, svg, div[role="button"], a, span'))
      .map(el => ({
        tag: el.tagName,
        ariaLabel: el.getAttribute('aria-label') || '',
        text: el.innerText ? el.innerText.trim() : '',
        className: el.className
      })).filter(el => el.ariaLabel.includes('edit') || el.text.includes('Edit') || el.ariaLabel.includes('photo') || el.text.includes('Add'));

    const sections = Array.from(document.querySelectorAll('h2, h3, h4, [class*="section"]')).map(s => s.innerText.trim()).filter(Boolean);
    const bodyText = document.body.innerText;

    return {
      editButtons: editButtons.slice(0, 30),
      sections: Array.from(new Set(sections)).slice(0, 20),
      fullBodyText: bodyText
    };
  });

  console.log('--- SECTIONS ON PAGE ---');
  console.log(profileData.sections);
  console.log('--- EDIT BUTTONS ---');
  console.log(JSON.stringify(profileData.editButtons, null, 2));
  console.log('--- FULL BODY TEXT ---');
  console.log(profileData.fullBodyText);

  await browser.disconnect();
}

main().catch(console.error);
