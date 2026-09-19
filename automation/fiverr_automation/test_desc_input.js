const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const page = (await browser.pages()).find(p => p.url().includes('faq_description') || p.url().includes('fiverr.com'));

  const descriptionText = `Are you looking to tailor Microsoft Dynamics 365 Business Central to match your exact business processes?

I develop clean, robust AL extensions and custom apps for Business Central SaaS (Cloud) and On-Premise.

WHAT I BUILD:
• Custom approval workflows & amount-based routing
• Specialized pages, lists, and business fields
• Routine automation to eliminate repetitive manual tasks
• Custom reports and real-time operational dashboards
• Event subscribers ensuring smooth future BC cloud updates

HOW WE WORK:
1. Scope Review: We review your requirements and sandbox setup.
2. Sandbox Development: Built and demonstrated in an isolated environment.
3. Testing & Refinement: Rigorous quality assurance.
4. Go-Live: Seamless production deployment + full AL source code delivered.

Based in Denmark with specialized Dynamics 365 Business Central expertise. Communication in Danish or English.

PLEASE NOTE:
Always message me before placing an order so we can confirm requirements, scope, and technical compatibility!`;

  // Focus ql-editor and set content
  console.log('Focusing ql-editor...');
  const editor = await page.$('.ql-editor');
  await page.evaluate(e => e.scrollIntoView({ block: 'center' }), editor);
  await editor.focus();
  
  // Set HTML or text inside Quill
  await page.evaluate((text) => {
    const ql = document.querySelector('.ql-editor');
    ql.focus();
    // Use Quill API if available on parent
    const container = document.querySelector('.description-editor');
    // Convert newlines to paragraphs for Quill
    const html = text.split('\n\n').map(para => {
      const lines = para.split('\n').map(l => l.trim()).join('<br>');
      return `<p>${lines}</p>`;
    }).join('');
    ql.innerHTML = html;
    ql.dispatchEvent(new Event('input', { bubbles: true }));
  }, descriptionText);

  await new Promise(r => setTimeout(r, 1000));

  // Check character counter
  const charCounter = await page.evaluate(() => {
    const el = Array.from(document.querySelectorAll('*')).find(e => e.innerText && e.innerText.includes('1200 Characters'));
    return el ? el.innerText : 'counter not found';
  });
  console.log('Character counter:', charCounter);

  const shotPath = path.join(__dirname, 'desc_filled.png');
  await page.screenshot({ path: shotPath, fullPage: true });
  console.log('Screenshot saved to:', shotPath);

  await browser.disconnect();
}

main().catch(console.error);
