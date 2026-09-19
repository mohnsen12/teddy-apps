const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222', defaultViewport: null });
  const pages = await browser.pages();
  const ytPage = pages.find(p => p.url().includes('youtube.com'));

  if (!ytPage) {
    console.error('No YouTube page found');
    browser.disconnect();
    return;
  }

  console.log('Focusing modal...');
  // Find name and handle inputs
  const inputs = await ytPage.$$('input[type="text"]');
  console.log(`Found ${inputs.length} text inputs.`);

  // Let's identify which input is Name and which is Handle
  // The first text input is search_query, then Name, then Handle
  for (const input of inputs) {
    const val = await input.evaluate(el => ({ val: el.value, ariaLabel: el.getAttribute('aria-label') }));
    console.log('Input:', val);
  }

  // Set name and handle
  await ytPage.evaluate(() => {
    const textInputs = Array.from(document.querySelectorAll('input[type="text"]')).filter(i => i.name !== 'search_query');
    if (textInputs.length >= 2) {
      // Name
      textInputs[0].value = 'Teddy Apps';
      textInputs[0].dispatchEvent(new Event('input', { bubbles: true }));
      textInputs[0].dispatchEvent(new Event('change', { bubbles: true }));

      // Handle
      textInputs[1].value = 'teddyapps';
      textInputs[1].dispatchEvent(new Event('input', { bubbles: true }));
      textInputs[1].dispatchEvent(new Event('change', { bubbles: true }));
    }
  });

  // Check file input for avatar
  const fileInput = await ytPage.$('input[type="file"]');
  if (fileInput) {
    const avatarPath = '/Users/teddy/teddy-apps/marketing/assets/teddy-apps-logo-square.png';
    console.log('Uploading avatar image:', avatarPath);
    await fileInput.uploadFile(avatarPath);
  }

  await new Promise(r => setTimeout(r, 2000));

  // Check handle availability status
  const modalInfo = await ytPage.evaluate(() => {
    return {
      nameVal: Array.from(document.querySelectorAll('input[type="text"]'))[1]?.value,
      handleVal: Array.from(document.querySelectorAll('input[type="text"]'))[2]?.value,
      bodyText: document.querySelector('ytd-channel-creation-dialog-renderer, tp-yt-paper-dialog, #dialog')?.innerText || document.body.innerText.substring(0, 500)
    };
  });

  console.log('Updated Modal Info:', JSON.stringify(modalInfo, null, 2));

  await ytPage.screenshot({ path: '/Users/teddy/teddy-apps/marketing/assets/create_channel_filled.png' });
  console.log('Screenshot saved to create_channel_filled.png');

  browser.disconnect();
}

main().catch(console.error);
