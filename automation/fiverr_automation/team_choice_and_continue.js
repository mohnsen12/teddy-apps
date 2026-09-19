const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('seller_onboarding') || p.url().includes('fiverr.com')) || pages[0];

  // 1. Find the element containing "I work independently" and click its card
  const clicked = await page.evaluate(() => {
    const all = Array.from(document.querySelectorAll('*'));
    const targetText = all.find(el => el.innerText && el.innerText.trim() === 'I work independently');
    if (targetText) {
      // Find parent card
      let card = targetText;
      while (card && card.parentElement && !card.className.includes('card') && card.tagName !== 'BUTTON') {
        if (card.parentElement.innerText && card.parentElement.innerText.includes('Are you part of a team')) break;
        card = card.parentElement;
      }
      targetText.click();
      if (card) card.click();
      return true;
    }
    return false;
  });
  console.log('Clicked "I work independently" card:', clicked);
  await new Promise(r => setTimeout(r, 1000));

  // 2. Click Continue button
  const continueClicked = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.innerText.trim() === 'Continue');
    if (btn && !btn.disabled) {
      btn.scrollIntoView();
      btn.click();
      return true;
    }
    return false;
  });
  console.log('Clicked Continue:', continueClicked);

  await new Promise(r => setTimeout(r, 4000));
  console.log('URL now:', page.url());

  const screenshotPath = path.join(__dirname, 'after_team_choice.png');
  await page.screenshot({ path: screenshotPath });
  console.log('Screenshot saved to:', screenshotPath);

  await browser.disconnect();
}

main().catch(console.error);
