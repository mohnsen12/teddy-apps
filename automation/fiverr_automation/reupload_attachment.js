const puppeteer = require('puppeteer-core');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const page = (await browser.pages()).find(p => p.url().includes('portfolio'));

  console.log('Re-uploading attachment...');
  const fileInput = await page.$('input[name="attachments"]');
  await fileInput.uploadFile('/Users/teddy/teddy-apps/marketing/assets/fiverr/portfolio/gls-integration.png');

  await new Promise(r => setTimeout(r, 6000));

  const info = await page.evaluate(() => {
    const att = Array.from(document.querySelectorAll('*')).filter(e => e.innerText && e.innerText.includes('gls-integration'));
    const smallest = att.sort((a, b) => a.innerText.length - b.innerText.length)[0];
    return smallest ? smallest.innerText : 'none';
  });
  console.log('Upload state now:', info);

  await page.screenshot({ path: '/Users/teddy/teddy-apps/automation/fiverr_automation/after_reupload.png', fullPage: true });
  console.log('Saved after_reupload.png');

  await browser.disconnect();
}

main().catch(console.error);
