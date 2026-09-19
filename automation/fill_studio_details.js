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

  // 1. Set description
  const descText = `Velkommen til Teddy Apps. Vi er danske specialister i Microsoft Dynamics 365 Business Central udvikling, API-integrationer og automatiseret forretningsflow.

Vi hjælper virksomheder og webshops med at fjerne manuelt tastearbejde, minimere fejl og opnå maksimal effektivitet:
⚡ Skræddersyede AL Extensions og add-ons
🔌 Direkte API-integrationer (GLS ShipIT, webshops, betalingsgateways)
🏦 Automatisk bankafstemning og bogføring
🌐 B2B kunde- og forhandlerportaler i realtid
💰 Automatiseret debitorstyring og rykkerflow

🔗 Links & Kontakt:
🌐 Hjemmeside: https://teddyapps.dk
💼 Fiverr Services: https://www.fiverr.com/teddybot82
📧 E-mail: kontakt@teddyapps.dk`;

  console.log('Filling description in div#textbox...');
  await studioPage.evaluate((text) => {
    const box = document.querySelector('div#textbox.ytcp-social-suggestions-textbox');
    if (box) {
      box.innerText = text;
      box.dispatchEvent(new Event('input', { bubbles: true }));
      box.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }, descText);

  await new Promise(r => setTimeout(r, 1000));

  // 2. Set contact email
  console.log('Filling contact email...');
  await studioPage.evaluate(() => {
    const mailInput = Array.from(document.querySelectorAll('input')).find(i => i.placeholder && i.placeholder.includes('Mailadresse'));
    if (mailInput) {
      mailInput.value = 'kontakt@teddyapps.dk';
      mailInput.dispatchEvent(new Event('input', { bubbles: true }));
      mailInput.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });

  await new Promise(r => setTimeout(r, 1000));

  // 3. Add Link 1: Website
  console.log('Adding Link 1 (Website)...');
  await studioPage.evaluate(() => {
    const addLinkBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Tilføj link'));
    if (addLinkBtn) addLinkBtn.click();
  });
  await new Promise(r => setTimeout(r, 1500));

  await studioPage.evaluate(() => {
    const inputs = Array.from(document.querySelectorAll('ytcp-form-input-container input, ytcp-channel-customization-link input'));
    if (inputs.length >= 2) {
      inputs[0].value = 'Hjemmeside';
      inputs[0].dispatchEvent(new Event('input', { bubbles: true }));
      inputs[0].dispatchEvent(new Event('change', { bubbles: true }));
      inputs[1].value = 'https://teddyapps.dk';
      inputs[1].dispatchEvent(new Event('input', { bubbles: true }));
      inputs[1].dispatchEvent(new Event('change', { bubbles: true }));
    }
  });

  await new Promise(r => setTimeout(r, 1000));

  // 4. Add Link 2: Fiverr
  console.log('Adding Link 2 (Fiverr)...');
  await studioPage.evaluate(() => {
    const addLinkBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Tilføj link'));
    if (addLinkBtn) addLinkBtn.click();
  });
  await new Promise(r => setTimeout(r, 1500));

  await studioPage.evaluate(() => {
    const inputs = Array.from(document.querySelectorAll('ytcp-form-input-container input, ytcp-channel-customization-link input'));
    if (inputs.length >= 4) {
      inputs[2].value = 'Fiverr Services';
      inputs[2].dispatchEvent(new Event('input', { bubbles: true }));
      inputs[2].dispatchEvent(new Event('change', { bubbles: true }));
      inputs[3].value = 'https://www.fiverr.com/teddybot82';
      inputs[3].dispatchEvent(new Event('input', { bubbles: true }));
      inputs[3].dispatchEvent(new Event('change', { bubbles: true }));
    }
  });

  await new Promise(r => setTimeout(r, 2000));

  await studioPage.screenshot({ path: '/Users/teddy/teddy-apps/marketing/assets/studio_details_filled.png' });
  console.log('Screenshot saved to studio_details_filled.png');

  browser.disconnect();
}

main().catch(console.error);
