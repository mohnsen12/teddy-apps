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

  // 1. Re-upload updated Banner without teddyapps.dk
  console.log('Re-uploading updated banner...');
  const fileInputs = await studioPage.$$('input[type="file"]');
  if (fileInputs.length > 0) {
    await fileInputs[0].uploadFile('/Users/teddy/teddy-apps/marketing/assets/youtube_banner_2560x1440.png');
    await new Promise(r => setTimeout(r, 2500));
    await studioPage.evaluate(() => {
      const doneBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Udfør') || b.innerText.includes('Done'));
      if (doneBtn) doneBtn.click();
    });
    await new Promise(r => setTimeout(r, 2000));
  }

  // 2. Update Description
  const newDesc = `Velkommen til Teddy Apps. Vi er danske specialister i Microsoft Dynamics 365 Business Central udvikling, API-integrationer og automatiseret forretningsflow.

Vi hjælper virksomheder og webshops med at fjerne manuelt tastearbejde, minimere fejl og opnå maksimal effektivitet:
⚡ Skræddersyede AL Extensions og add-ons
🔌 Direkte API-integrationer (GLS ShipIT, webshops, betalingsgateways)
🏦 Automatisk bankafstemning og bogføring
🌐 B2B kunde- og forhandlerportaler i realtid
💰 Automatiseret debitorstyring og rykkerflow

🔗 Links & Kontakt:
💼 Fiverr Services: https://www.fiverr.com/teddybot82
🌐 Portfolio: https://mohnsen12.github.io/teddy-apps/
📧 E-mail: teddybot82@gmail.com`;

  console.log('Updating description...');
  await studioPage.evaluate((desc) => {
    const box = document.querySelector('div#textbox.ytcp-social-suggestions-textbox');
    if (box) {
      box.innerText = desc;
      box.dispatchEvent(new Event('input', { bubbles: true }));
      box.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }, newDesc);

  await new Promise(r => setTimeout(r, 1000));

  // 3. Update Contact Email
  console.log('Updating contact email to teddybot82@gmail.com...');
  await studioPage.evaluate(() => {
    const mailInput = Array.from(document.querySelectorAll('input')).find(i => i.placeholder && i.placeholder.includes('Mailadresse'));
    if (mailInput) {
      mailInput.value = 'teddybot82@gmail.com';
      mailInput.dispatchEvent(new Event('input', { bubbles: true }));
      mailInput.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });

  await new Promise(r => setTimeout(r, 1000));

  // 4. Update Links
  console.log('Updating links...');
  await studioPage.evaluate(() => {
    const linkTitles = Array.from(document.querySelectorAll('input.ytcpChannelLinkItemTitleInput'));
    const linkUrls = Array.from(document.querySelectorAll('input[placeholder="Angiv en webadresse"]'));

    if (linkTitles.length >= 1 && linkUrls.length >= 1) {
      linkTitles[0].value = 'Fiverr Services';
      linkTitles[0].dispatchEvent(new Event('input', { bubbles: true }));
      linkTitles[0].dispatchEvent(new Event('change', { bubbles: true }));

      linkUrls[0].value = 'https://www.fiverr.com/teddybot82';
      linkUrls[0].dispatchEvent(new Event('input', { bubbles: true }));
      linkUrls[0].dispatchEvent(new Event('change', { bubbles: true }));
    }

    if (linkTitles.length >= 2 && linkUrls.length >= 2) {
      linkTitles[1].value = 'Online Portfolio';
      linkTitles[1].dispatchEvent(new Event('input', { bubbles: true }));
      linkTitles[1].dispatchEvent(new Event('change', { bubbles: true }));

      linkUrls[1].value = 'https://mohnsen12.github.io/teddy-apps/';
      linkUrls[1].dispatchEvent(new Event('input', { bubbles: true }));
      linkUrls[1].dispatchEvent(new Event('change', { bubbles: true }));
    }
  });

  await new Promise(r => setTimeout(r, 2000));

  // 5. Click "Udgiv" (Publish)
  console.log('Clicking "Udgiv"...');
  await studioPage.evaluate(() => {
    const pubBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Udgiv') || b.innerText.includes('Publish'));
    if (pubBtn && !pubBtn.disabled) pubBtn.click();
  });

  console.log('Waiting 5 seconds for save...');
  await new Promise(r => setTimeout(r, 5000));

  await studioPage.screenshot({ path: '/Users/teddy/teddy-apps/marketing/assets/studio_updated_no_domain.png' });
  console.log('Screenshot saved to studio_updated_no_domain.png');

  browser.disconnect();
}

main().catch(console.error);
