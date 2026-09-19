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

  console.log('Found YouTube page:', ytPage.url());
  await ytPage.bringToFront();
  
  // Wait a moment for page to stabilize
  await new Promise(r => setTimeout(r, 2000));

  const pageInfo = await ytPage.evaluate(() => {
    const title = document.title;
    const avatar = document.querySelector('button#avatar-btn, ytd-topbar-menu-button-renderer img');
    const signInBtn = document.querySelector('a[href*="signin"], ytd-button-renderer a[href*="accounts.google.com"]');
    return {
      title,
      hasAvatar: !!avatar,
      hasSignInBtn: !!signInBtn,
      avatarSrc: avatar ? avatar.src : null
    };
  });

  console.log('YouTube page state:', JSON.stringify(pageInfo, null, 2));
  browser.disconnect();
}

main().catch(err => {
  console.error('Error:', err.message);
});
