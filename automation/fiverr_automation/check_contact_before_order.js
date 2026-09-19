const puppeteer = require('puppeteer-core');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const page = (await browser.pages())[0];

  const gigUrls = [
    'https://www.fiverr.com/users/teddybot82/manage_gigs/develop-a-custom-microsoft-dynamics-365-business-central-extension/edit?tab=pricing&wizard=1',
    'https://www.fiverr.com/users/teddybot82/manage_gigs/integrate-microsoft-business-central-with-your-webshop-crm-or-api/edit?tab=pricing&wizard=1',
    'https://www.fiverr.com/users/teddybot82/manage_gigs/build-a-business-central-b2b-portal-or-customer-self-service-solution/edit?tab=pricing&wizard=1'
  ];

  for (const url of gigUrls) {
    console.log('Checking gig pricing tab:', url);
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 2500));

    const contactToggle = await page.evaluate(() => {
      const labels = Array.from(document.querySelectorAll('label, [class*="toggle"], [class*="switch"], [class*="checkbox"]'));
      const found = labels.filter(l => l.innerText && (l.innerText.toLowerCase().includes('contact') || l.innerText.toLowerCase().includes('request to order')));
      return found.map(l => ({ text: l.innerText.trim(), className: l.className }));
    });
    console.log('Found toggles/labels related to contact/request to order:', contactToggle);
  }

  await browser.disconnect();
}

main().catch(console.error);
