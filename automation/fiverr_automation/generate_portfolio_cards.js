const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const projects = [
  {
    id: 'gls-integration',
    tag: 'LOGISTICS & API INTEGRATION',
    title: 'GLS ShipIT Integration',
    subtitle: 'Automated Shipping & Labeling in Business Central',
    badge: '85% Faster Dispatch',
    points: [
      'Direct API connection between Business Central and GLS ShipIT',
      'Automatic shipping label printing from posted sales shipments',
      'Real-time tracking number sync & automatic customer notification',
      'Support for GLS ParcelShops, business parcel & international delivery'
    ],
    tech: ['Business Central AL', 'GLS REST API', 'JSON / Webhooks', 'Automated Workflows']
  },
  {
    id: 'automatisk-bogforing',
    tag: 'FINANCIAL AUTOMATION',
    title: 'Automated Bookkeeping Engine',
    subtitle: 'Bank Reconciliation & Zero-Touch Ledger Posting',
    badge: '10+ Hours Saved / Week',
    points: [
      'Automated bank statement import (CAMT.053 / Open Banking)',
      'Rule-based intelligent matching of incoming payments to open invoices',
      'One-click batch posting with automated difference handling',
      'Comprehensive audit log ensuring full compliance with accounting standards'
    ],
    tech: ['Dynamics 365 BC', 'AL Extension', 'Banking APIs', 'Posting Logic']
  },
  {
    id: 'forhandler-indkobspanel',
    tag: 'B2B SELF-SERVICE PORTAL',
    title: 'B2B Dealer Purchase Portal',
    subtitle: '24/7 Self-Service Ordering Connected to ERP',
    badge: 'Real-time ERP Sync',
    points: [
      'Dealer-specific negotiated pricing & live stock availability',
      'Orders placed on portal instantly create sales orders in Business Central',
      'Self-service access to order tracking, historical invoices & credit status',
      'Mobile-friendly interface built with modern PHP / REST API backend'
    ],
    tech: ['B2B Portal', 'PHP / Tailwind', 'BC OData / REST', 'Customer Account']
  },
  {
    id: 'rykkerprocedurer',
    tag: 'ACCOUNTS RECEIVABLE AUTOMATION',
    title: 'Automated Dunning & Reminders',
    subtitle: 'Intelligent Debt Collection & Cash Flow Optimization',
    badge: '40% Reduction in DSO',
    points: [
      'Multi-tiered dunning ladder: Gentle reminder → Formal notice → Inkasso ready',
      'Automatic calculation of reminder fees & default interest according to Danish law',
      'Dynamic PDF statement generation with branded company identity',
      'Fully automated scheduled email dispatch via Business Central Job Queue'
    ],
    tech: ['AL Extensions', 'Job Queue', 'Finance Management', 'PDF Engine']
  }
];

function generateHtml(p) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
    body {
      width: 1280px;
      height: 769px;
      background: radial-gradient(circle at 15% 20%, #1e293b 0%, #0f172a 50%, #020617 100%);
      color: #f8fafc;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 60px 70px;
      position: relative;
      overflow: hidden;
    }
    .bg-grid {
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background-image: linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
      background-size: 40px 40px;
      z-index: 1;
    }
    .accent-glow {
      position: absolute;
      width: 450px;
      height: 450px;
      background: radial-gradient(circle, rgba(37, 99, 235, 0.25) 0%, rgba(37, 99, 235, 0) 70%);
      top: -100px;
      right: -100px;
      z-index: 1;
    }
    .header {
      position: relative;
      z-index: 2;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .logo-badge {
      display: flex;
      align-items: center;
      gap: 14px;
    }
    .logo-icon {
      width: 48px;
      height: 48px;
      background: #000;
      border: 1px solid #334155;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 20px;
      color: #38bdf8;
    }
    .logo-text {
      font-size: 22px;
      font-weight: 700;
      letter-spacing: -0.5px;
      color: #ffffff;
    }
    .logo-sub {
      font-size: 13px;
      color: #94a3b8;
      font-weight: 500;
    }
    .badge-pill {
      background: rgba(56, 189, 248, 0.12);
      border: 1px solid rgba(56, 189, 248, 0.4);
      color: #38bdf8;
      padding: 8px 18px;
      border-radius: 20px;
      font-size: 14px;
      font-weight: 700;
      letter-spacing: 0.5px;
    }
    .content {
      position: relative;
      z-index: 2;
      margin-top: 10px;
    }
    .tagline {
      font-size: 13px;
      font-weight: 700;
      color: #38bdf8;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      margin-bottom: 12px;
    }
    .title {
      font-size: 52px;
      font-weight: 800;
      line-height: 1.1;
      letter-spacing: -1.5px;
      margin-bottom: 14px;
      background: linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .subtitle {
      font-size: 24px;
      color: #94a3b8;
      font-weight: 400;
      margin-bottom: 36px;
    }
    .points-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px 30px;
      margin-bottom: 30px;
    }
    .point-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      font-size: 17px;
      color: #e2e8f0;
      line-height: 1.4;
    }
    .check-icon {
      flex-shrink: 0;
      width: 22px;
      height: 22px;
      background: #10b981;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
      font-size: 13px;
      margin-top: 2px;
    }
    .footer {
      position: relative;
      z-index: 2;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      padding-top: 20px;
    }
    .tech-stack {
      display: flex;
      gap: 10px;
    }
    .tech-badge {
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.12);
      padding: 6px 14px;
      border-radius: 8px;
      font-size: 13px;
      color: #cbd5e1;
      font-weight: 600;
    }
    .verified-mark {
      color: #10b981;
      font-size: 14px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 6px;
    }
  </style>
</head>
<body>
  <div class="bg-grid"></div>
  <div class="accent-glow"></div>

  <div class="header">
    <div class="logo-badge">
      <div class="logo-icon">TA</div>
      <div>
        <div class="logo-text">Teddy Apps</div>
        <div class="logo-sub">Case Study & Delivery</div>
      </div>
    </div>
    <div class="badge-pill">${p.badge}</div>
  </div>

  <div class="content">
    <div class="tagline">${p.tag}</div>
    <div class="title">${p.title}</div>
    <div class="subtitle">${p.subtitle}</div>

    <div class="points-grid">
      ${p.points.map(pt => `
        <div class="point-item">
          <div class="check-icon">✓</div>
          <div>${pt}</div>
        </div>
      `).join('')}
    </div>
  </div>

  <div class="footer">
    <div class="tech-stack">
      ${p.tech.map(t => `<div class="tech-badge">${t}</div>`).join('')}
    </div>
    <div class="verified-mark">
      <span>● Verified Case Study</span>
    </div>
  </div>
</body>
</html>`;
}

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 769, deviceScaleFactor: 2 });

  const outDir = '/Users/teddy/teddy-apps/marketing/assets/fiverr/portfolio';
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  for (const p of projects) {
    const html = generateHtml(p);
    await page.setContent(html, { waitUntil: 'load' });
    const outFile = path.join(outDir, `${p.id}.png`);
    await page.screenshot({ path: outFile, type: 'png' });
    console.log(`Rendered portfolio image: ${outFile}`);
  }

  await page.close();
  await browser.disconnect();
}

main().catch(console.error);
