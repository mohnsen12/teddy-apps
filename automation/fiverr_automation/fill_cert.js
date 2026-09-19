const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const page = (await browser.pages())[0];

  console.log('Filling Certificate...');
  await page.evaluate(() => {
    const certInp = document.querySelector('input[placeholder="Certificate or award"]');
    if (certInp) {
      certInp.focus();
      certInp.click();
    }
  });
  await page.keyboard.type('Microsoft Certified: Dynamics 365 Business Central Functional Consultant');
  await new Promise(r => setTimeout(r, 400));

  console.log('Filling Received from...');
  await page.evaluate(() => {
    const fromInp = document.querySelector('input[placeholder*="Received from"]');
    if (fromInp) {
      fromInp.focus();
      fromInp.click();
    }
  });
  await page.keyboard.type('Microsoft');
  await new Promise(r => setTimeout(r, 400));

  console.log('Selecting Year received...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button, div[role="button"]'));
    const yrBtn = btns.find(b => b.innerText && b.innerText.trim().toLowerCase().includes('year received'));
    if (yrBtn) yrBtn.click();
  });
  await new Promise(r => setTimeout(r, 600));

  await page.evaluate(() => {
    const options = Array.from(document.querySelectorAll('li, div[role="option"], button'));
    const yr = options.find(o => o.innerText && o.innerText.trim() === '2021');
    if (yr) yr.click();
  });
  await new Promise(r => setTimeout(r, 600));

  const shot = path.join(__dirname, 'cert_filled.png');
  await page.screenshot({ path: shot, fullPage: true });
  console.log('Saved cert filled shot to:', shot);

  // Click Add button inside certification form
  const added = await page.evaluate(() => {
    const certSection = document.querySelector('div[class*="certification"]') || Array.from(document.querySelectorAll('div')).find(d => d.innerText && d.innerText.includes('Certificate or award'));
    if (certSection) {
      const btns = Array.from(certSection.querySelectorAll('button')).filter(b => b.innerText.trim().toLowerCase() === 'add');
      const lastAdd = btns[btns.length - 1];
      if (lastAdd && !lastAdd.disabled) {
        lastAdd.click();
        return true;
      }
    }
    return false;
  });
  console.log('Clicked Add on cert:', added);

  await new Promise(r => setTimeout(r, 2000));

  const shotAfter = path.join(__dirname, 'cert_added.png');
  await page.screenshot({ path: shotAfter, fullPage: true });
  console.log('Saved cert added shot to:', shotAfter);

  await browser.disconnect();
}

main().catch(console.error);
