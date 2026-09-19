const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('fiverr.com')) || pages[0];

  console.log('Current URL:', page.url());
  console.log('Page Title:', await page.title());

  const screenshotPath = path.join(__dirname, 'current_screen.png');
  await page.screenshot({ path: screenshotPath });
  console.log('Screenshot saved to:', screenshotPath);

  // Check login state
  const loginState = await page.evaluate(() => {
    const text = document.body ? document.body.innerText : '';
    const hasSignIn = !!document.querySelector('a[href*="login"]') || text.includes('Sign in') || text.includes('Log In');
    const hasJoin = !!document.querySelector('a[href*="join"]') || text.includes('Join');
    const hasUserProfile = !!document.querySelector('[data-qa="user-avatar"], [class*="user-nav"], [class*="avatar"]');
    return {
      hasSignIn,
      hasJoin,
      hasUserProfile,
      bodyTextSnippet: text.slice(0, 300)
    };
  });

  console.log('Login state:', JSON.stringify(loginState, null, 2));
  await browser.disconnect();
}

main().catch(console.error);
