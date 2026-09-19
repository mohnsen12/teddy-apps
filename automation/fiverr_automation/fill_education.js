const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const page = (await browser.pages())[0];

  console.log('Filling Education fields...');

  // 1. Country: Click country trigger and type Denmark
  await page.evaluate(() => {
    const countryInp = document.querySelector('input[placeholder="Country"]');
    if (countryInp) {
      countryInp.focus();
      countryInp.click();
    }
  });
  await new Promise(r => setTimeout(r, 500));
  await page.keyboard.type('Denmark');
  await new Promise(r => setTimeout(r, 600));
  await page.keyboard.press('Enter');
  await new Promise(r => setTimeout(r, 600));

  // 2. School
  await page.evaluate(() => {
    const schoolInp = document.querySelector('input[placeholder="School"]');
    if (schoolInp) {
      schoolInp.focus();
      schoolInp.click();
    }
  });
  await page.keyboard.type('Technical University of Denmark');
  await new Promise(r => setTimeout(r, 400));

  // 3. Degree dropdown
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button, div[role="button"]'));
    const degBtn = btns.find(b => b.innerText && b.innerText.trim().toLowerCase().startsWith('degree'));
    if (degBtn) degBtn.click();
  });
  await new Promise(r => setTimeout(r, 600));

  // Select B.Sc. or Bachelor or first option
  await page.evaluate(() => {
    const options = Array.from(document.querySelectorAll('li, div[role="option"], button'));
    const bsc = options.find(o => o.innerText && (o.innerText.includes('B.Sc') || o.innerText.includes('Bachelor') || o.innerText.includes('Other')));
    if (bsc) bsc.click();
  });
  await new Promise(r => setTimeout(r, 600));

  // 4. Field of study
  await page.evaluate(() => {
    const fieldInp = document.querySelector('input[placeholder="Field of study"]');
    if (fieldInp) {
      fieldInp.focus();
      fieldInp.click();
    }
  });
  await page.keyboard.type('Computer Science & Software Development');
  await new Promise(r => setTimeout(r, 400));

  // 5. Year of graduation
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button, div[role="button"]'));
    const yrBtn = btns.find(b => b.innerText && b.innerText.trim().toLowerCase().includes('year of graduation'));
    if (yrBtn) yrBtn.click();
  });
  await new Promise(r => setTimeout(r, 600));

  await page.evaluate(() => {
    const options = Array.from(document.querySelectorAll('li, div[role="option"], button'));
    const yr = options.find(o => o.innerText && o.innerText.trim() === '2019');
    if (yr) yr.click();
  });
  await new Promise(r => setTimeout(r, 600));

  const shot = path.join(__dirname, 'education_filled.png');
  await page.screenshot({ path: shot, fullPage: true });
  console.log('Saved education filled shot to:', shot);

  // Click Add button inside the education section
  const added = await page.evaluate(() => {
    const edSection = document.querySelector('div[class*="education"]') || Array.from(document.querySelectorAll('div')).find(d => d.innerText && d.innerText.includes('Field of study'));
    if (edSection) {
      const btns = Array.from(edSection.querySelectorAll('button'));
      const addBtn = btns.find(b => b.innerText && b.innerText.trim().toLowerCase() === 'add');
      if (addBtn && !addBtn.disabled) {
        addBtn.click();
        return true;
      }
    }
    return false;
  });
  console.log('Clicked Add on education:', added);

  await new Promise(r => setTimeout(r, 2000));

  const shotAfter = path.join(__dirname, 'education_added.png');
  await page.screenshot({ path: shotAfter, fullPage: true });
  console.log('Saved education added shot to:', shotAfter);

  await browser.disconnect();
}

main().catch(console.error);
