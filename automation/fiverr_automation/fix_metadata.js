const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('manage_gigs') || p.url().includes('fiverr.com')) || pages[0];

  // 1. Check C# and .NET Framework under Programming Language
  console.log('Selecting C# and .NET Framework...');
  await page.evaluate(() => {
    const labels = Array.from(document.querySelectorAll('label, span, div'));
    const csharp = labels.find(l => l.innerText && l.innerText.trim() === 'C#');
    if (csharp) csharp.click();
    const dotnet = labels.find(l => l.innerText && l.innerText.trim() === '.NET Framework');
    if (dotnet) dotnet.click();
  });
  await new Promise(r => setTimeout(r, 600));

  // 2. Click PLATFORMS tab
  console.log('Switching to PLATFORMS tab...');
  await page.evaluate(() => {
    const lis = Array.from(document.querySelectorAll('li'));
    const target = lis.find(l => l.innerText && l.innerText.includes('PLATFORMS'));
    if (target) target.click();
  });
  await new Promise(r => setTimeout(r, 800));

  // Inspect platform options
  const platformOptions = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('label, div[class*="option"], span')).map(el => el.innerText.trim()).filter(t => t.length > 0 && t.length < 40);
  });
  console.log('Platform items in view:', platformOptions.slice(0, 20));

  // Check if Microsoft Dynamics or Other is present
  await page.evaluate(() => {
    const all = Array.from(document.querySelectorAll('label, span, div'));
    const dyn = all.find(l => l.innerText && (l.innerText.includes('Microsoft') || l.innerText.includes('Dynamics')));
    if (dyn) {
      dyn.click();
      return 'Clicked Dynamics';
    }
    const other = all.find(l => l.innerText && l.innerText.trim() === 'Other');
    if (other) {
      other.click();
      return 'Clicked Other';
    }
    return 'None';
  });

  await new Promise(r => setTimeout(r, 1000));

  // 3. Click Save & Continue
  console.log('Clicking Save & Continue...');
  const clicked = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.innerText.trim().toLowerCase().includes('save & continue'));
    if (btn) {
      btn.scrollIntoView();
      btn.click();
      return true;
    }
    return false;
  });
  console.log('Clicked Save & Continue:', clicked);

  await new Promise(r => setTimeout(r, 4000));
  console.log('Current URL:', page.url());

  const screenshotPath = path.join(__dirname, 'after_metadata_fix.png');
  await page.screenshot({ path: screenshotPath });
  console.log('Screenshot saved to:', screenshotPath);

  await browser.disconnect();
}

main().catch(console.error);
