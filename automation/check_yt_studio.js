const puppeteer = require('puppeteer-core');

async function main() {
  const browser = await puppeteer.connect({
    browserURL: 'http://127.0.0.1:9222',
    defaultViewport: null
  });

  const pages = await browser.pages();
  const ytPage = pages.find(p => p.url().includes('youtube.com'));

  if (!ytPage) {
    console.log('No YouTube page found.');
    browser.disconnect();
    return;
  }

  // Navigate to YouTube Studio or channel switch
  await ytPage.goto('https://studio.youtube.com/', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 4000));

  console.log('Current URL after navigating to studio:', ytPage.url());
  const details = await ytPage.evaluate(() => {
    return {
      title: document.title,
      bodyText: document.body.innerText.substring(0, 500)
    };
  });

  console.log('Studio details:', JSON.stringify(details, null, 2));

  // Take a screenshot of the studio page
  await ytPage.screenshot({ path: '/Users/teddy/teddy-apps/marketing/assets/yt_studio_state.png' });
  console.log('Screenshot saved to yt_studio_state.png');

  browser.disconnect();
}

main().catch(err => {
  console.error('Error:', err.message);
});
