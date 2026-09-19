const puppeteer = require('puppeteer-core');
const path = require('path');

async function addSingleSkill(page, skillName) {
  console.log(`Adding skill: ${skillName}...`);
  // Click the skill input
  const input = await page.$('input[placeholder*="Add skill" i]');
  if (!input) {
    console.log('Skill input not found');
    return false;
  }

  await input.click({ clickCount: 3 });
  await input.type(skillName, { delay: 50 });
  await new Promise(r => setTimeout(r, 1000));

  // Check if dropdown suggestions appeared
  const suggestionClicked = await page.evaluate(() => {
    // Look for suggestion items in dropdown or listbox
    const items = Array.from(document.querySelectorAll('[role="option"], [class*="suggestion"], [class*="item"], li'));
    const visible = items.filter(el => el.offsetParent !== null && el.innerText.trim());
    if (visible.length > 0) {
      visible[0].click();
      return visible[0].innerText.trim();
    }
    return null;
  });
  console.log('Suggestion clicked:', suggestionClicked);

  await new Promise(r => setTimeout(r, 800));

  // Select "Experience level" -> "Expert"
  const levelSelected = await page.evaluate(() => {
    // Click experience level dropdown
    const dropdown = Array.from(document.querySelectorAll('*')).find(el => el.innerText && el.innerText.includes('Experience level'));
    if (dropdown) {
      dropdown.click();
    }
    return true;
  });
  await new Promise(r => setTimeout(r, 500));

  // Find and click "Expert"
  const expertClicked = await page.evaluate(() => {
    const options = Array.from(document.querySelectorAll('*')).filter(el => el.innerText && el.innerText.trim().toLowerCase() === 'expert');
    const option = options.find(el => el.offsetParent !== null);
    if (option) {
      option.click();
      return true;
    }
    return false;
  });
  console.log('Expert clicked:', expertClicked);

  await new Promise(r => setTimeout(r, 500));

  // Click "Add" button
  const addClicked = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const btn = buttons.find(b => b.innerText.trim() === 'Add');
    if (btn && !btn.disabled) {
      btn.click();
      return true;
    }
    return false;
  });
  console.log('Add button clicked:', addClicked);
  await new Promise(r => setTimeout(r, 1500));

  return addClicked;
}

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('seller_onboarding') || p.url().includes('fiverr.com')) || pages[0];

  const skills = [
    'Microsoft Dynamics 365',
    'ERP',
    'API Integration',
    'Automation',
    'PHP',
    'E-commerce'
  ];

  for (const s of skills) {
    // Check if "Add skills and expertise" or "Add" is needed
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Add skills and expertise'));
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 800));
    await addSingleSkill(page, s);
  }

  const screenshotPath = path.join(__dirname, 'current_screen.png');
  await page.screenshot({ path: screenshotPath });
  console.log('Screenshot saved to:', screenshotPath);

  await browser.disconnect();
}

main().catch(console.error);
