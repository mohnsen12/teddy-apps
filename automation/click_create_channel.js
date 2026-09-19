const puppeteer = require('puppeteer-core');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222', defaultViewport: null });
  const pages = await browser.pages();
  const ytPage = pages.find(p => p.url().includes('youtube.com'));

  console.log('Clicking "Opret kanal"...');
  const btns = await ytPage.$$('>>> ytd-channel-creation-dialog-renderer button');
  console.log(`Found ${btns.length} buttons.`);
  const createBtn = btns.find ? btns[2] : null;

  if (createBtn) {
    await createBtn.click();
    console.log('Clicked "Opret kanal" button!');
  } else {
    // fallback by finding button with text
    await ytPage.evaluate(() => {
      const b = Array.from(document.querySelectorAll('button')).find(el => el.innerText.includes('Opret kanal'));
      if (b) b.click();
    });
  }

  // Wait for creation request to complete and page to redirect or update
  console.log('Waiting 8 seconds for channel creation...');
  await new Promise(r => setTimeout(r, 8000));

  console.log('New URL:', ytPage.url());
  console.log('New Title:', await ytPage.title());

  await ytPage.screenshot({ path: '/Users/teddy/teddy-apps/marketing/assets/channel_created_screen.png' });
  console.log('Screenshot saved to channel_created_screen.png');

  browser.disconnect();
}

main().catch(console.error);
