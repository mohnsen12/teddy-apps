const puppeteer = require('puppeteer-core');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222', defaultViewport: null });
  const pages = await browser.pages();
  const studioPage = pages.find(p => p.url().includes('studio.youtube.com'));

  if (!studioPage) {
    console.error('Studio page not found');
    browser.disconnect();
    return;
  }

  await studioPage.bringToFront();

  // Click "Fortsæt" button
  console.log('Clicking "Fortsæt"...');
  await studioPage.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Fortsæt') || b.innerText.includes('Continue'));
    if (btn) btn.click();
  });

  await new Promise(r => setTimeout(r, 2000));

  // Also close any "Spørg Studio" tip if present
  await studioPage.evaluate(() => {
    const lukBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText === 'Luk');
    if (lukBtn) lukBtn.click();
  });

  await new Promise(r => setTimeout(r, 1000));

  // Inspect upload buttons and file inputs
  const pageState = await studioPage.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button, a')).map(el => ({
      text: el.innerText.trim(),
      ariaLabel: el.getAttribute('aria-label'),
      id: el.id
    })).filter(b => b.text || b.ariaLabel);

    const fileInputs = Array.from(document.querySelectorAll('input[type="file"]')).map(i => ({
      id: i.id,
      name: i.name,
      accept: i.accept
    }));

    return { buttons, fileInputs };
  });

  console.log('Page state after Fortsæt:', JSON.stringify(pageState, null, 2));

  await studioPage.screenshot({ path: '/Users/teddy/teddy-apps/marketing/assets/studio_profile_ready.png' });
  console.log('Screenshot saved to studio_profile_ready.png');

  browser.disconnect();
}

main().catch(console.error);
