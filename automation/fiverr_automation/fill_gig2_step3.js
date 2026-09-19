const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const page = (await browser.pages()).find(p => p.url().includes('faq_description') || p.url().includes('fiverr.com'));

  console.log('Completing Gig 2 Step 3 (Description & FAQ) on:', page.url());

  // 1. Format description in Quill
  const htmlContent = `
<p>Tired of manual double entry between Business Central and your webshop, CRM, or banking systems?</p>
<p><br></p>
<p>I build secure, reliable two-way integrations that connect Microsoft Dynamics 365 Business Central with your existing systems, ensuring data flows automatically.</p>
<p><br></p>
<p><strong>WHAT I CONNECT:</strong></p>
<p>• BC ↔ Shopify / WooCommerce: Real-time sync of items, inventory, prices, orders, and customer data</p>
<p>• BC ↔ CRM (HubSpot, Salesforce, Pipedrive)</p>
<p>• BC ↔ Bank & Payment gateways</p>
<p>• BC ↔ B2B portals, WMS, and custom REST/GraphQL APIs</p>
<p><br></p>
<p><strong>KEY BENEFITS:</strong></p>
<p>• Two-way real-time data sync</p>
<p>• Built-in error logging, notifications, and retry mechanisms</p>
<p>• Tested in sandbox prior to production rollout</p>
<p><br></p>
<p><strong>HOW WE WORK:</strong></p>
<p>1. Discovery: Mapping system endpoints, data models, and business logic.</p>
<p>2. Architecture: Designing field mappings and conflict rules.</p>
<p>3. Sandbox Testing: End-to-end sync validation with real test data.</p>
<p>4. Go-Live: Production deployment with live monitoring.</p>
<p><br></p>
<p>Danish BC specialist company. Fluent in Danish and English.</p>
<p><br></p>
<p><strong>PLEASE NOTE:</strong></p>
<p>Please contact me before ordering to verify API accessibility and project scope!</p>
`.trim();

  await page.evaluate((html) => {
    const ql = document.querySelector('.ql-editor');
    ql.focus();
    ql.innerHTML = html;
    ql.dispatchEvent(new Event('input', { bubbles: true }));
  }, htmlContent);

  await new Promise(r => setTimeout(r, 1000));

  // 2. Add 4 FAQs
  const faqs = [
    {
      q: 'Which systems can you integrate with Business Central?',
      a: 'Any system offering an API (REST, GraphQL, Webhooks, SOAP) — including Shopify, WooCommerce, HubSpot, Salesforce, payment gateways, and custom platforms.'
    },
    {
      q: 'Does the integration sync in both directions?',
      a: 'Yes, we determine the direction per data entity (e.g., items BC → Webshop, orders Webshop → BC).'
    },
    {
      q: 'What happens if an external API goes down?',
      a: 'The integration includes automatic retry queues and error notifications, ensuring no orders or transactions are lost.'
    },
    {
      q: 'Can we start with a smaller single flow?',
      a: 'Yes, the Starter package is designed specifically for single data streams (like automated order import).'
    }
  ];

  for (let i = 0; i < faqs.length; i++) {
    const { q, a } = faqs[i];
    console.log(`Adding FAQ ${i + 1}: ${q}`);

    // Click + Add FAQ
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button, a, span'));
      const addFaqBtn = btns.find(b => b.innerText && b.innerText.trim().includes('+ Add FAQ'));
      if (addFaqBtn) {
        addFaqBtn.scrollIntoView({ block: 'center' });
        addFaqBtn.click();
      }
    });
    await new Promise(r => setTimeout(r, 600));

    // Fill question
    const qInput = await page.$('input[placeholder*="Add a Question"], input[name*="question"]');
    if (qInput) {
      await qInput.focus();
      await page.keyboard.type(q, { delay: 15 });
    }

    // Fill answer
    const aInput = await page.$('textarea[placeholder*="Add an Answer"], textarea[name*="answer"]');
    if (aInput) {
      await aInput.focus();
      await page.keyboard.type(a, { delay: 15 });
    }

    // Click Add button
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const btn = btns.find(b => b.innerText.trim() === 'Add');
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 800));
  }

  const shotPath = path.join(__dirname, 'gig2_step3_completed.png');
  await page.screenshot({ path: shotPath, fullPage: true });
  console.log('Saved completed step 3 screenshot');

  // 3. Click Save & Continue
  console.log('Clicking Save & Continue...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.innerText.toLowerCase().includes('save & continue') || b.innerText.toLowerCase().includes('save and continue'));
    if (btn) {
      btn.scrollIntoView();
      btn.click();
    }
  });

  await new Promise(r => setTimeout(r, 4000));
  console.log('Current URL after save:', page.url());

  const afterSavePath = path.join(__dirname, 'gig2_step4_reached.png');
  await page.screenshot({ path: afterSavePath, fullPage: true });
  console.log('Screenshot saved to:', afterSavePath);

  await browser.disconnect();
}

main().catch(console.error);
