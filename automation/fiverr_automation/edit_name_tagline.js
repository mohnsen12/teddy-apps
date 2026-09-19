const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('seller_onboarding') || p.url().includes('fiverr.com')) || pages[0];

  // Find all pencil/edit icons or buttons near Teddy
  const pencils = await page.evaluate(() => {
    // Look for svgs or buttons around Teddy and Senior Developer
    const allSvgs = Array.from(document.querySelectorAll('svg'));
    return allSvgs.map((s, idx) => ({
      idx,
      parentTag: s.parentElement ? s.parentElement.tagName : null,
      parentText: s.parentElement ? s.parentElement.innerText : null,
      parentClass: s.parentElement ? s.parentElement.className : null,
      ariaLabel: s.getAttribute('aria-label') || (s.parentElement ? s.parentElement.getAttribute('aria-label') : null)
    })).filter(s => s.parentText && (s.parentText.includes('Teddy') || s.parentText.includes('Developer')));
  });
  console.log('Pencil/edit items:', pencils);

  // Let's click the edit icon next to name
  const nameEditClicked = await page.evaluate(() => {
    const editBtns = Array.from(document.querySelectorAll('button, span, div[role="button"]'));
    // Find button inside the name container
    const nameHeading = Array.from(document.querySelectorAll('h1, h2, h3, div')).find(el => el.innerText && el.innerText.trim().startsWith('Teddy'));
    if (nameHeading) {
      const btn = nameHeading.querySelector('button, svg, [role="button"]') || nameHeading.nextElementSibling;
      if (btn) {
        btn.click();
        return true;
      }
    }
    return false;
  });
  console.log('Name edit clicked:', nameEditClicked);

  await new Promise(r => setTimeout(r, 1500));

  const screenshotPath = path.join(__dirname, 'current_screen.png');
  await page.screenshot({ path: screenshotPath });
  console.log('Screenshot saved to:', screenshotPath);

  await browser.disconnect();
}

main().catch(console.error);
