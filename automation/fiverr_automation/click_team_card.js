const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('seller_onboarding') || p.url().includes('fiverr.com')) || pages[0];

  const cards = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('*')).filter(el => {
      return el.innerText && el.innerText.trim() === 'No\nI work independently';
    }).map(el => ({
      tag: el.tagName,
      class: el.className,
      rect: el.getBoundingClientRect()
    }));
  });
  console.log('Cards found:', cards);

  // Click using page.mouse.click at the card coordinates
  if (cards.length > 0 && cards[0].rect.width > 0) {
    const x = cards[0].rect.x + cards[0].rect.width / 2;
    const y = cards[0].rect.y + cards[0].rect.height / 2;
    console.log(`Clicking card at (${x}, ${y})`);
    await page.mouse.click(x, y);
    await new Promise(r => setTimeout(r, 1000));
  } else {
    // Try clicking by selector
    await page.evaluate(() => {
      const all = Array.from(document.querySelectorAll('div, button'));
      const card = all.find(el => el.innerText && el.innerText.includes('I work independently'));
      if (card) card.click();
    });
  }

  await new Promise(r => setTimeout(r, 1000));

  // Check Continue button
  const continueClicked = await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.trim() === 'Continue');
    if (btn && !btn.disabled) {
      btn.click();
      return true;
    }
    return false;
  });
  console.log('Clicked Continue:', continueClicked);

  await new Promise(r => setTimeout(r, 3000));
  console.log('URL now:', page.url());

  const screenshotPath = path.join(__dirname, 'team_clicked.png');
  await page.screenshot({ path: screenshotPath });
  console.log('Screenshot saved to:', screenshotPath);

  await browser.disconnect();
}

main().catch(console.error);
