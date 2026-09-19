const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const page = (await browser.pages()).find(p => p.url().includes('faq_description') || p.url().includes('fiverr.com'));

  console.log('Completing Gig 3 Step 3 (Description & FAQ) on:', page.url());

  // 1. Format description in Quill
  const htmlContent = `
<p>Empower your wholesale and B2B customers to self-serve 24/7 — eliminating phone queues, manual PDF orders, and data entry errors.</p>
<p><br></p>
<p>I develop custom B2B customer portals in PHP with direct, live two-way integration to Microsoft Dynamics 365 Business Central.</p>
<p><br></p>
<p><strong>CORE PORTAL CAPABILITIES:</strong></p>
<p>• Secure customer login with user role permissions</p>
<p>• Live stock availability pulled directly from BC</p>
<p>• Customer-specific contract pricing & discount matrixes</p>
<p>• Complete order history, invoices, and shipment tracking</p>
<p>• 1-Click re-ordering creating sales orders directly in BC</p>
<p><br></p>
<p><strong>BENEFITS:</strong></p>
<p>• Zero manual re-typing: orders land directly in your ERP</p>
<p>• 24/7 availability for international and wholesale clients</p>
<p>• Tailored to your company's visual brand and logo</p>
<p><br></p>
<p><strong>HOW WE WORK:</strong></p>
<p>1. Alignment: Defining target users, required fields, and BC endpoints.</p>
<p>2. Architecture & UI: Clean responsive design and data flows.</p>
<p>3. Development & Sandbox: Full testing with your real product and customer data.</p>
<p>4. Go-Live: Deployment, onboarding, and ongoing support.</p>
<p><br></p>
<p><strong>PLEASE NOTE:</strong></p>
<p>Contact me prior to ordering to discuss your ERP version, scope, and specific business logic!</p>
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
      q: 'Can customers see their individual agreed prices?',
      a: 'Yes. The portal queries BC\'s sales price and discount matrixes in real-time based on the logged-in debtor number.'
    },
    {
      q: 'Is the portal styled to our company brand?',
      a: 'Absolutely. We match your corporate colors, logo, and layout preferences.'
    },
    {
      q: 'Where is the portal hosted?',
      a: 'You can host it on your own server or cloud environment, or we can assist with complete setup and hosting guidance.'
    },
    {
      q: 'Can new features be added later?',
      a: 'Yes. The PHP and API architecture is modular and built to scale as your B2B sales grow.'
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

  const shotPath = path.join(__dirname, 'gig3_step3_completed.png');
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

  const afterSavePath = path.join(__dirname, 'gig3_step4_reached.png');
  await page.screenshot({ path: afterSavePath, fullPage: true });
  console.log('Screenshot saved to:', afterSavePath);

  await browser.disconnect();
}

main().catch(console.error);
