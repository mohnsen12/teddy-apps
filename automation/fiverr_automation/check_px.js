const puppeteer = require('puppeteer-core');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const page = (await browser.pages())[0];

  const pxBtn = await page.evaluate(() => {
    const btn = document.querySelector('#px-captcha, [aria-label*="press"], [id*="captcha"], .px-captcha-wrapper') || document.querySelector('div[style*="cursor: pointer"]');
    return {
      title: document.title,
      url: page.url(),
      hasIframe: !!document.querySelector('iframe'),
      allDivs: Array.from(document.querySelectorAll('div, button, a')).map(d => d.id || d.className).filter(Boolean)
    };
  });
  console.log('PX info:', pxBtn);

  await browser.disconnect();
}

main().catch(console.error);
