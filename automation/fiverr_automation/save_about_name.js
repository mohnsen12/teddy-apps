const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('seller_onboarding') || p.url().includes('fiverr.com')) || pages[0];

  // 1. Change display name to "Claus M."
  const nameInput = await page.$('input[placeholder*="display name" i]');
  if (nameInput) {
    await nameInput.focus();
    await page.keyboard.down('Meta');
    await page.keyboard.press('a');
    await page.keyboard.up('Meta');
    await page.keyboard.press('Backspace');
    await nameInput.type('Claus M.', { delay: 40 });
    console.log('Set display name: Claus M.');
  }

  // 2. Change title to "Business Central Specialist" (or full tagline)
  const titleInput = await page.$('input[placeholder*="title" i]');
  if (titleInput) {
    await titleInput.focus();
    await page.keyboard.down('Meta');
    await page.keyboard.press('a');
    await page.keyboard.up('Meta');
    await page.keyboard.press('Backspace');
    await titleInput.type('Business Central & ERP Specialist', { delay: 30 });
    console.log('Set title: Business Central & ERP Specialist');
  }

  // 3. Click "Add details" under About
  const addDetailsBtn = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const b = btns.find(btn => btn.innerText && btn.innerText.includes('Add details'));
    if (b) {
      b.scrollIntoView();
      b.click();
      return true;
    }
    return false;
  });
  console.log('Clicked Add details:', addDetailsBtn);
  await new Promise(r => setTimeout(r, 1200));

  // 4. Fill description textarea
  const aboutText = "Teddy Apps helps businesses get more value from Microsoft Dynamics 365 Business Central. We build custom BC extensions, integrations, automations and B2B portals that remove manual work and make systems work together. From a small high-value adjustment to a defined integration between Business Central, webshop, CRM or other APIs, we focus on practical delivery, clear communication and maintainable solutions. Based in Denmark. Available in Danish and English.";

  const textarea = await page.$('textarea');
  if (textarea) {
    await textarea.focus();
    await page.keyboard.down('Meta');
    await page.keyboard.press('a');
    await page.keyboard.up('Meta');
    await page.keyboard.press('Backspace');
    await page.evaluate((text) => {
      const t = document.querySelector('textarea');
      if (t) {
        t.value = text;
        t.dispatchEvent(new Event('input', { bubbles: true }));
        t.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }, aboutText);
    console.log('Typed about text (length: ' + aboutText.length + ')');
    await new Promise(r => setTimeout(r, 1000));

    // Find and click the Save/Apply button inside the About card
    const saveClicked = await page.evaluate(() => {
      const allBtns = Array.from(document.querySelectorAll('button'));
      const btn = allBtns.find(b => ['save', 'apply', 'done'].includes(b.innerText.trim().toLowerCase()) && b.offsetParent !== null);
      if (btn) {
        btn.click();
        return btn.innerText.trim();
      }
      return null;
    });
    console.log('Save button clicked in About:', saveClicked);
  }

  await new Promise(r => setTimeout(r, 2000));

  const screenshotPath = path.join(__dirname, 'current_screen.png');
  await page.screenshot({ path: screenshotPath });
  console.log('Screenshot saved to:', screenshotPath);

  await browser.disconnect();
}

main().catch(console.error);
