const puppeteer = require('puppeteer-core');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222', defaultViewport: null });
  const pages = await browser.pages();
  const studioPage = pages.find(p => p.url().includes('studio.youtube.com'));

  console.log('Clicking "Udgiv" (Publish)...');
  await studioPage.evaluate(() => {
    const pubBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Udgiv') || b.innerText.includes('Publish'));
    if (pubBtn) pubBtn.click();
  });

  console.log('Waiting 5 seconds for save to complete...');
  await new Promise(r => setTimeout(r, 5000));

  await studioPage.screenshot({ path: '/Users/teddy/teddy-apps/marketing/assets/published_state.png' });
  console.log('Screenshot saved to published_state.png');

  browser.disconnect();
}

main().catch(console.error);
