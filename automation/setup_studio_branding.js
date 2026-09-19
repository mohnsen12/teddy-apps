const puppeteer = require('puppeteer-core');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222', defaultViewport: null });
  const pages = await browser.pages();
  const ytPage = pages.find(p => p.url().includes('youtube.com'));

  console.log('Navigating to YouTube Studio customization branding...');
  await ytPage.goto('https://studio.youtube.com/channel/UCpMfvJBy705UhHL_2eUWusA/editing/branding', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 4000));

  console.log('Current URL:', ytPage.url());
  console.log('Current Title:', await ytPage.title());

  const brandingInfo = await ytPage.evaluate(() => {
    return {
      buttons: Array.from(document.querySelectorAll('button')).map(b => b.innerText.trim()).filter(Boolean),
      text: document.body.innerText.substring(0, 1000)
    };
  });
  console.log('Branding page info:', JSON.stringify(brandingInfo, null, 2));

  await ytPage.screenshot({ path: '/Users/teddy/teddy-apps/marketing/assets/studio_branding.png' });
  console.log('Screenshot saved to studio_branding.png');

  browser.disconnect();
}

main().catch(console.error);
