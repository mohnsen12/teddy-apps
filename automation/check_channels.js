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

  await ytPage.goto('https://www.youtube.com/channel_switcher', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));

  console.log('URL:', ytPage.url());
  const pageData = await ytPage.evaluate(() => {
    return {
      title: document.title,
      channels: Array.from(document.querySelectorAll('ytd-account-item-renderer, #channel-title, yt-formatted-string#channel-title')).map(el => el.innerText.trim()).filter(Boolean),
      buttons: Array.from(document.querySelectorAll('button, a')).map(el => el.innerText.trim()).filter(t => t.length > 0 && t.length < 50)
    };
  });

  console.log('Channel Switcher Data:', JSON.stringify(pageData, null, 2));
  await ytPage.screenshot({ path: '/Users/teddy/teddy-apps/marketing/assets/channel_switcher.png' });
  browser.disconnect();
}

main().catch(console.error);
