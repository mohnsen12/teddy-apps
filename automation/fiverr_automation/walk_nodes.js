const puppeteer = require('puppeteer-core');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('seller_onboarding') || p.url().includes('fiverr.com')) || pages[0];

  const info = await page.evaluate(() => {
    const texts = [];
    const walk = (node) => {
      if (node.nodeType === Node.TEXT_NODE && node.nodeValue.trim()) {
        texts.push({
          val: node.nodeValue.trim(),
          parentTag: node.parentElement.tagName,
          parentClass: node.parentElement.className
        });
      }
      for (const child of node.childNodes) walk(child);
    };
    walk(document.body);
    return texts.slice(0, 30);
  });

  console.log(JSON.stringify(info, null, 2));
  await browser.disconnect();
}

main().catch(console.error);
