const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('seller_onboarding') || p.url().includes('fiverr.com')) || pages[0];

  const logoPath = '/Users/teddy/teddy-apps/marketing/assets/teddy-apps-logo-square.png';

  // 1. Check if profile image input exists and upload
  try {
    const fileInput = await page.$('input[type="file"], input[name="profile[image]"]');
    if (fileInput) {
      await fileInput.uploadFile(logoPath);
      console.log('Uploaded profile picture:', logoPath);
      await new Promise(r => setTimeout(r, 2000));
    } else {
      console.log('File input not found directly');
    }
  } catch (e) {
    console.log('Error uploading profile picture:', e.message);
  }

  // 2. Fill Display Name if input is present
  try {
    const nameInput = await page.$('input[placeholder*="display name" i]');
    if (nameInput) {
      await nameInput.click({ clickCount: 3 });
      await nameInput.type('Teddy Apps', { delay: 30 });
      console.log('Filled display name: Teddy Apps');
    }
  } catch (e) {
    console.log('Display name input error:', e.message);
  }

  // 3. Fill Title / Tagline if input is present
  try {
    const titleInput = await page.$('input[placeholder*="title" i]');
    if (titleInput) {
      await titleInput.click({ clickCount: 3 });
      await titleInput.type('Microsoft Business Central development, integrations and automation', { delay: 20 });
      console.log('Filled title / tagline');
    }
  } catch (e) {
    console.log('Title input error:', e.message);
  }

  // 4. Fill About Description
  const aboutText = `Teddy Apps helps businesses get more value from Microsoft Dynamics 365 Business Central.

We build custom BC extensions, integrations, automations and B2B portals that remove manual work and make systems work together. From a small high-value adjustment to a defined integration between Business Central, webshop, CRM or other APIs, we focus on practical delivery, clear communication and maintainable solutions.

Based in Denmark. Available in Danish and English.`;

  try {
    const textarea = await page.$('textarea');
    if (textarea) {
      await textarea.click();
      await page.evaluate((text) => {
        const ta = document.querySelector('textarea');
        if (ta) {
          ta.value = text;
          ta.dispatchEvent(new Event('input', { bubbles: true }));
          ta.dispatchEvent(new Event('change', { bubbles: true }));
        }
      }, aboutText);
      console.log('Filled About description textarea (length:', aboutText.length, ')');
    }
  } catch (e) {
    console.log('About textarea error:', e.message);
  }

  await new Promise(r => setTimeout(r, 1500));

  // Check if there is a Save / Done button for About
  const saved = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const saveBtn = buttons.find(b => ['save', 'done', 'apply'].includes(b.innerText.trim().toLowerCase()));
    if (saveBtn) {
      saveBtn.click();
      return 'Clicked ' + saveBtn.innerText;
    }
    return 'No inner save button found';
  });
  console.log('Inner save status:', saved);

  await new Promise(r => setTimeout(r, 2000));

  const screenshotPath = path.join(__dirname, 'current_screen.png');
  await page.screenshot({ path: screenshotPath });
  console.log('Screenshot saved to:', screenshotPath);

  await browser.disconnect();
}

main().catch(console.error);
