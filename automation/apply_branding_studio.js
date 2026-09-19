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

  // Find file inputs
  const fileInputs = await studioPage.$$('input[type="file"]');
  console.log(`Found ${fileInputs.length} file inputs.`);

  // 1. Upload Banner Image
  const bannerPath = '/Users/teddy/teddy-apps/marketing/assets/youtube_banner_2560x1440.png';
  console.log('Uploading banner to fileInputs[0]...');
  await fileInputs[0].uploadFile(bannerPath);
  await new Promise(r => setTimeout(r, 2500));

  // Click "Færdig" / "Done" on crop dialog
  console.log('Accepting banner crop modal...');
  await studioPage.evaluate(() => {
    const doneBtn = Array.from(document.querySelectorAll('ytcp-button, button')).find(b => b.innerText.includes('Færdig') || b.innerText.includes('Done'));
    if (doneBtn) doneBtn.click();
  });
  await new Promise(r => setTimeout(r, 2500));

  // 2. Upload Profile Picture / Avatar
  const avatarPath = '/Users/teddy/teddy-apps/marketing/assets/teddy-apps-logo-square.png';
  console.log('Uploading avatar to fileInputs[1]...');
  await fileInputs[1].uploadFile(avatarPath);
  await new Promise(r => setTimeout(r, 2500));

  // Click "Færdig" / "Done" on crop dialog
  console.log('Accepting avatar crop modal...');
  await studioPage.evaluate(() => {
    const doneBtn = Array.from(document.querySelectorAll('ytcp-button, button')).find(b => b.innerText.includes('Færdig') || b.innerText.includes('Done'));
    if (doneBtn) doneBtn.click();
  });
  await new Promise(r => setTimeout(r, 2500));

  // 3. Scroll down and set Description
  console.log('Setting description text...');
  const descriptionText = `Velkommen til Teddy Apps. Vi er danske specialister i Microsoft Dynamics 365 Business Central udvikling, API-integrationer og automatiseret forretningsflow.

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

  await studioPage.evaluate((desc) => {
    const textarea = document.querySelector('textarea#description-textarea, #description textarea, textarea');
    if (textarea) {
      textarea.value = desc;
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
      textarea.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }, descriptionText);

  await new Promise(r => setTimeout(r, 2000));

  await studioPage.screenshot({ path: '/Users/teddy/teddy-apps/marketing/assets/studio_branding_applied.png' });
  console.log('Screenshot saved to studio_branding_applied.png');

  browser.disconnect();
}

main().catch(console.error);
