const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('seller_onboarding') || p.url().includes('fiverr.com')) || pages[0];

  // 1. Scroll to top
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise(r => setTimeout(r, 600));

  // 2. Check Display Name
  const nameInput = await page.$('input[placeholder*="display name" i]');
  if (nameInput) {
    await nameInput.focus();
    await page.keyboard.down('Meta');
    await page.keyboard.press('a');
    await page.keyboard.up('Meta');
    await page.keyboard.press('Backspace');
    await nameInput.type('Claus M.', { delay: 40 });
    console.log('Typed display name: Claus M.');
  }

  // 3. Scroll to About textarea
  const textarea = await page.$('textarea');
  if (textarea) {
    await textarea.focus();
    await page.keyboard.down('Meta');
    await page.keyboard.press('a');
    await page.keyboard.up('Meta');
    await page.keyboard.press('Backspace');

    const text = "Teddy Apps helps businesses get more value from Microsoft Dynamics 365 Business Central. We build custom BC extensions, integrations, automations and B2B portals that remove manual work and make systems work together. From a small high-value adjustment to a defined integration between Business Central, webshop, CRM or other APIs, we focus on practical delivery, clear communication and maintainable solutions. Based in Denmark. Available in Danish and English.";
    
    console.log('Typing about text...');
    // Using page.keyboard.type or native type
    await textarea.type(text, { delay: 5 });
    console.log('Finished typing about text.');
  }

  await new Promise(r => setTimeout(r, 1000));

  // Check character count displayed on screen
  const status = await page.evaluate(() => {
    const text = document.body ? document.body.innerText : '';
    const nameVal = document.querySelector('input[placeholder*="display name" i]')?.value;
    const aboutVal = document.querySelector('textarea')?.value;
    return { nameVal, aboutLen: aboutVal?.length, snippet: text.slice(0, 400) };
  });
  console.log('Status after typing:', status);

  // 4. Click Continue at the bottom
  const continueBtn = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.innerText.trim() === 'Continue');
    if (btn) {
      btn.scrollIntoView();
      btn.click();
      return true;
    }
    return false;
  });
  console.log('Clicked Continue:', continueBtn);

  await new Promise(r => setTimeout(r, 4000));
  console.log('URL now:', page.url());

  const screenshotPath = path.join(__dirname, 'current_screen.png');
  await page.screenshot({ path: screenshotPath });
  console.log('Screenshot saved to:', screenshotPath);

  await browser.disconnect();
}

main().catch(console.error);
