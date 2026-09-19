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

  console.log('Fixing all channel fields cleanly...');
  await studioPage.evaluate(() => {
    // 1. Channel Name
    const nameInput = document.querySelector('input.ytcpChannelEditingChannelNameFormInput');
    if (nameInput) {
      nameInput.value = 'Teddy Apps';
      nameInput.dispatchEvent(new Event('input', { bubbles: true }));
      nameInput.dispatchEvent(new Event('change', { bubbles: true }));
    }

    // 2. Clear Pronomen if any
    const pronomenInput = document.querySelector('input.text-input.ytcp-chip-bar');
    if (pronomenInput) {
      pronomenInput.value = '';
      pronomenInput.dispatchEvent(new Event('input', { bubbles: true }));
      pronomenInput.dispatchEvent(new Event('change', { bubbles: true }));
    }

    // 3. Link 1 Title & URL
    const linkTitles = Array.from(document.querySelectorAll('input.ytcpChannelLinkItemTitleInput'));
    const linkUrls = Array.from(document.querySelectorAll('input[placeholder="Angiv en webadresse"]'));

    if (linkTitles.length >= 1) {
      linkTitles[0].value = 'Hjemmeside';
      linkTitles[0].dispatchEvent(new Event('input', { bubbles: true }));
      linkTitles[0].dispatchEvent(new Event('change', { bubbles: true }));
    }
    if (linkUrls.length >= 1) {
      linkUrls[0].value = 'https://teddyapps.dk';
      linkUrls[0].dispatchEvent(new Event('input', { bubbles: true }));
      linkUrls[0].dispatchEvent(new Event('change', { bubbles: true }));
    }
  });

  await new Promise(r => setTimeout(r, 1500));

  // 4. Click "Tilføj link" for Link 2 (Fiverr)
  console.log('Adding Link 2...');
  await studioPage.evaluate(() => {
    const addBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Tilføj link'));
    if (addBtn) addBtn.click();
  });

  await new Promise(r => setTimeout(r, 1500));

  await studioPage.evaluate(() => {
    const linkTitles = Array.from(document.querySelectorAll('input.ytcpChannelLinkItemTitleInput'));
    const linkUrls = Array.from(document.querySelectorAll('input[placeholder="Angiv en webadresse"]'));

    if (linkTitles.length >= 2) {
      linkTitles[1].value = 'Fiverr Services';
      linkTitles[1].dispatchEvent(new Event('input', { bubbles: true }));
      linkTitles[1].dispatchEvent(new Event('change', { bubbles: true }));
    }
    if (linkUrls.length >= 2) {
      linkUrls[1].value = 'https://www.fiverr.com/teddybot82';
      linkUrls[1].dispatchEvent(new Event('input', { bubbles: true }));
      linkUrls[1].dispatchEvent(new Event('change', { bubbles: true }));
    }
  });

  await new Promise(r => setTimeout(r, 2000));

  await studioPage.screenshot({ path: '/Users/teddy/teddy-apps/marketing/assets/studio_fields_fixed.png' });
  console.log('Screenshot saved to studio_fields_fixed.png');

  browser.disconnect();
}

main().catch(console.error);
