const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const page = (await browser.pages()).find(p => p.url().includes('faq_description') || p.url().includes('fiverr.com'));

  console.log('Completing Step 3 (Description & FAQ) on:', page.url());

  // 1. Format description in Quill
  const htmlContent = `
<p>Are you looking to tailor Microsoft Dynamics 365 Business Central to match your exact business processes?</p>
<p><br></p>
<p>I develop clean, robust AL extensions and custom apps for Business Central SaaS (Cloud) and On-Premise.</p>
<p><br></p>
<p><strong>WHAT I BUILD:</strong></p>
<p>• Custom approval workflows & amount-based routing</p>
<p>• Specialized pages, lists, and business fields</p>
<p>• Routine automation to eliminate repetitive manual tasks</p>
<p>• Custom reports and real-time operational dashboards</p>
<p>• Event subscribers ensuring smooth future BC cloud updates</p>
<p><br></p>
<p><strong>HOW WE WORK:</strong></p>
<p>1. Scope Review: We review your requirements and sandbox setup.</p>
<p>2. Sandbox Development: Built and demonstrated in an isolated environment.</p>
<p>3. Testing & Refinement: Rigorous quality assurance.</p>
<p>4. Go-Live: Seamless production deployment + full AL source code delivered.</p>
<p><br></p>
<p>Based in Denmark with specialized Dynamics 365 Business Central expertise. Communication in Danish or English.</p>
<p><br></p>
<p><strong>PLEASE NOTE:</strong></p>
<p>Always message me before placing an order so we can confirm requirements, scope, and technical compatibility!</p>
`.trim();

  await page.evaluate((html) => {
    const ql = document.querySelector('.ql-editor');
    ql.focus();
    ql.innerHTML = html;
    ql.dispatchEvent(new Event('input', { bubbles: true }));
  }, htmlContent);

  await new Promise(r => setTimeout(r, 1000));

  // 2. Add remaining FAQs
  const remainingFaqs = [
    {
      q: 'Will we receive the full source code?',
      a: 'Yes. The complete AL source code is always delivered as part of the project.'
    },
    {
      q: 'Which Business Central versions do you support?',
      a: 'Primarily Business Central Cloud (SaaS), as well as modern on-premise deployments. Older NAV versions by prior agreement.'
    },
    {
      q: 'Can you take over maintenance of existing extensions?',
      a: 'Absolutely. Send a message with your current setup and source code, and I will review it.'
    }
  ];

  for (let i = 0; i < remainingFaqs.length; i++) {
    const { q, a } = remainingFaqs[i];
    console.log(`Adding FAQ ${i + 2}: ${q}`);

    // Click + Add FAQ
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const addFaqBtn = btns.find(b => b.innerText && b.innerText.trim().includes('+ Add FAQ'));
      if (addFaqBtn) {
        addFaqBtn.scrollIntoView({ block: 'center' });
        addFaqBtn.click();
      }
    });
    await new Promise(r => setTimeout(r, 600));

    // Fill question
    const qInput = await page.$('input[placeholder*="Add a Question"]');
    if (qInput) {
      await qInput.focus();
      await page.keyboard.type(q, { delay: 20 });
    }

    // Fill answer
    const aInput = await page.$('textarea[placeholder*="Add an Answer"]');
    if (aInput) {
      await aInput.focus();
      await page.keyboard.type(a, { delay: 20 });
    }

    // Click Add
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const btn = btns.find(b => b.innerText.trim() === 'Add');
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 800));
  }

  const shotPath = path.join(__dirname, 'step3_completed.png');
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

  const afterSavePath = path.join(__dirname, 'step4_reached.png');
  await page.screenshot({ path: afterSavePath, fullPage: true });
  console.log('Screenshot saved to:', afterSavePath);

  await browser.disconnect();
}

main().catch(console.error);
