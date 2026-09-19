const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

async function getPage() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('fiverr.com')) || pages[0];
  return { browser, page };
}

async function checkStatus() {
  const { browser, page } = await getPage();
  const url = page.url();
  const title = await page.title();
  
  const screenshotPath = path.join(__dirname, 'current_screen.png');
  await page.screenshot({ path: screenshotPath });

  const info = await page.evaluate(() => {
    const text = document.body ? document.body.innerText : '';
    const inputs = Array.from(document.querySelectorAll('input')).map(i => ({
      name: i.name,
      id: i.id,
      type: i.type,
      placeholder: i.placeholder,
      value: i.type === 'password' ? '***' : i.value
    }));
    const buttons = Array.from(document.querySelectorAll('button, a')).map(b => b.innerText.trim()).filter(t => t.length > 0 && t.length < 40);
    const isUserLoggedIn = !!document.querySelector('[data-qa="user-avatar"], [class*="user-nav"], [class*="user-profile"], img[alt*="profile" i]');
    return {
      inputs,
      buttons: Array.from(new Set(buttons)).slice(0, 20),
      isUserLoggedIn,
      snippet: text.slice(0, 400).replace(/\n+/g, ' ')
    };
  });

  console.log('--- FIVERR STATUS ---');
  console.log('URL:', url);
  console.log('Title:', title);
  console.log('Logged in:', info.isUserLoggedIn);
  console.log('Inputs:', JSON.stringify(info.inputs, null, 2));
  console.log('Snippet:', info.snippet);

  await browser.disconnect();
}

if (process.argv[2] === 'status') {
  checkStatus().catch(console.error);
} else {
  checkStatus().catch(console.error);
}
