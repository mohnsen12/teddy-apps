const puppeteer = require('puppeteer-core');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const page = (await browser.pages())[0];

  const iframes = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('iframe')).map(f => ({
      src: f.src,
      id: f.id,
      className: f.className
    }));
  });
  console.log('Iframes:', iframes);

  const shadowHosts = await page.evaluate(() => {
    const all = Array.from(document.querySelectorAll('*'));
    return all.filter(e => e.shadowRoot).map(e => e.tagName);
  });
  console.log('Shadow hosts:', shadowHosts);

  await browser.disconnect();
}

main().catch(console.error);
