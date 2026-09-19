const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const page = (await browser.pages())[0];

  const gigs = [
    {
      name: 'Gig 1 (Custom BC-apps)',
      url: 'https://www.fiverr.com/teddybot82/develop-a-custom-microsoft-dynamics-365-business-central-extension'
    },
    {
      name: 'Gig 2 (Integrations)',
      url: 'https://www.fiverr.com/teddybot82/integrate-microsoft-business-central-with-your-webshop-crm-or-api'
    },
    {
      name: 'Gig 3 (B2B Portal)',
      url: 'https://www.fiverr.com/teddybot82/build-a-business-central-b2b-portal-or-customer-self-service-solution'
    }
  ];

  for (let i = 0; i < gigs.length; i++) {
    const gig = gigs[i];
    console.log(`Verifying ${gig.name}: ${gig.url}`);
    await page.goto(gig.url, { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 3000));

    const title = await page.title();
    const h1 = await page.evaluate(() => {
      const h = document.querySelector('h1');
      return h ? h.innerText.trim() : 'No H1';
    });
    console.log(`-> Title: ${title}`);
    console.log(`-> H1: ${h1}`);

    const shot = path.join(__dirname, `verified_gig_${i + 1}.png`);
    await page.screenshot({ path: shot });
    console.log(`-> Saved screenshot to: ${shot}`);
  }

  await browser.disconnect();
}

main().catch(console.error);
