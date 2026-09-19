const puppeteer = require('puppeteer-core');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('manage_gigs') || p.url().includes('fiverr.com')) || pages[0];

  // 1. Inspect dropdown under PLATFORMS
  const dropdown = await page.evaluate(() => {
    const divs = Array.from(document.querySelectorAll('*'));
    const choose = divs.find(d => d.innerText && d.innerText.trim().startsWith('CHOOSE') && d.children.length <= 2);
    if (choose) {
      choose.click();
      return 'Clicked CHOOSE';
    }
    return 'CHOOSE not found';
  });
  console.log('Platform dropdown click:', dropdown);
  await new Promise(r => setTimeout(r, 600));

  const platformOptions = await page.evaluate(() => {
    const items = Array.from(document.querySelectorAll('[class*="option"], li, [role="option"]'));
    return items.map(i => i.innerText.trim()).filter(Boolean);
  });
  console.log('Platform options:', platformOptions);

  // 2. Inspect radio/checkbox for Other under PROGRAMMING LANGUAGE
  const programmingLangTab = await page.evaluate(() => {
    const tabs = Array.from(document.querySelectorAll('*')).filter(el => el.innerText && el.innerText.trim() === 'PROGRAMMING LANGUAGE *');
    if (tabs.length > 0) {
      tabs[0].click();
      return 'Clicked PROGRAMMING LANGUAGE tab';
    }
    return 'Not found';
  });
  console.log('Programming lang tab:', programmingLangTab);
  await new Promise(r => setTimeout(r, 600));

  // 3. Inspect Positive keywords input
  const tagInputInfo = await page.evaluate(() => {
    const heading = Array.from(document.querySelectorAll('*')).find(el => el.innerText && el.innerText.trim() === 'Positive keywords');
    if (heading) {
      let parent = heading.parentElement;
      const input = parent.querySelector('input');
      return {
        found: !!input,
        id: input?.id,
        className: input?.className,
        type: input?.type
      };
    }
    return null;
  });
  console.log('Tag input info:', tagInputInfo);

  await browser.disconnect();
}

main().catch(console.error);
