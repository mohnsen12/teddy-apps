const puppeteer = require('puppeteer-core');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const page = (await browser.pages())[0];

  const dateDetails = await page.evaluate(() => {
    const startInp = document.querySelector('input[placeholder="Start date"]');
    const chk = Array.from(document.querySelectorAll('input[type="checkbox"]')).find(c => {
      return c.parentElement && c.parentElement.innerText && c.parentElement.innerText.includes('currently work');
    });
    return {
      hasStart: !!startInp,
      hasChk: !!chk,
      chkChecked: chk ? chk.checked : null,
      parentText: chk ? chk.parentElement.innerText : null
    };
  });
  console.log('Date details:', dateDetails);

  await browser.disconnect();
}

main().catch(console.error);
