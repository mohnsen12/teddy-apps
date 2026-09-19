const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const OUT_PATH = '/Users/teddy/teddy-apps/marketing/assets/youtube_banner_2560x1440.png';

const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    body {
      width: 2560px;
      height: 1440px;
      background: #070a12;
      position: relative;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    /* Background subtle ambient glow */
    .glow-1 {
      position: absolute;
      top: 20%;
      left: 15%;
      width: 800px;
      height: 800px;
      background: radial-gradient(circle, rgba(14, 165, 233, 0.15) 0%, rgba(0,0,0,0) 70%);
      filter: blur(80px);
      z-index: 1;
    }
    .glow-2 {
      position: absolute;
      bottom: 20%;
      right: 15%;
      width: 900px;
      height: 900px;
      background: radial-gradient(circle, rgba(255, 107, 53, 0.12) 0%, rgba(0,0,0,0) 70%);
      filter: blur(90px);
      z-index: 1;
    }

    /* Grid pattern */
    .grid {
      position: absolute;
      inset: 0;
      background-image: 
        linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
      background-size: 80px 80px;
      z-index: 2;
    }

    /* Safe Area (1546 x 423) container */
    .safe-container {
      position: relative;
      z-index: 10;
      width: 1546px;
      height: 423px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 40px;
    }

    .left-col {
      display: flex;
      flex-direction: column;
      gap: 18px;
      max-width: 950px;
    }

    .badge-row {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .badge {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      background: rgba(15, 23, 42, 0.85);
      border: 1px solid rgba(56, 189, 248, 0.35);
      padding: 10px 22px;
      border-radius: 9999px;
      color: #38bdf8;
      font-size: 18px;
      font-weight: 700;
      letter-spacing: 1.5px;
      backdrop-filter: blur(12px);
    }

    .badge-dot {
      width: 10px;
      height: 10px;
      background: #38bdf8;
      border-radius: 50%;
      box-shadow: 0 0 10px #38bdf8;
    }

    .specialist-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: rgba(255, 107, 53, 0.12);
      border: 1px solid rgba(255, 107, 53, 0.4);
      padding: 10px 20px;
      border-radius: 9999px;
      color: #ff8555;
      font-size: 18px;
      font-weight: 700;
      letter-spacing: 1px;
    }

    h1 {
      font-size: 62px;
      font-weight: 900;
      color: #ffffff;
      line-height: 1.15;
      letter-spacing: -0.5px;
    }

    h1 span.highlight {
      background: linear-gradient(135deg, #38bdf8, #818cf8);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .tagline {
      font-size: 24px;
      color: #94a3b8;
      font-weight: 500;
      line-height: 1.4;
    }

    .pillars {
      display: flex;
      gap: 16px;
      margin-top: 4px;
    }

    .pillar-pill {
      background: rgba(30, 41, 59, 0.7);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: #e2e8f0;
      font-size: 17px;
      font-weight: 600;
      padding: 8px 18px;
      border-radius: 10px;
      backdrop-filter: blur(8px);
    }

    .right-col {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 20px;
      min-width: 420px;
    }

    .stat-box {
      background: rgba(15, 23, 42, 0.85);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 20px;
      padding: 24px 32px;
      width: 100%;
      backdrop-filter: blur(16px);
      box-shadow: 0 20px 40px rgba(0,0,0,0.5);
    }

    .stat-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    }
    .stat-row:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }

    .stat-label {
      font-size: 17px;
      color: #94a3b8;
      font-weight: 600;
    }

    .stat-value {
      font-size: 19px;
      color: #ffffff;
      font-weight: 800;
    }

    .stat-val-green {
      color: #4ade80;
    }

    .stat-val-orange {
      color: #ff8555;
    }

    .domain-pill {
      background: linear-gradient(135deg, #0284c7, #2563eb);
      color: #ffffff;
      font-size: 20px;
      font-weight: 800;
      padding: 14px 34px;
      border-radius: 12px;
      letter-spacing: 1px;
      box-shadow: 0 10px 25px rgba(2, 132, 199, 0.35);
    }
  </style>
</head>
<body>
  <div class="glow-1"></div>
  <div class="glow-2"></div>
  <div class="grid"></div>

  <div class="safe-container">
    <div class="left-col">
      <div class="badge-row">
        <div class="badge">
          <div class="badge-dot"></div>
          DYNAMICS 365 BUSINESS CENTRAL
        </div>
        <div class="specialist-badge">
          🇩🇰 DANSK SPECIALIST &bull; AL DEVELOPMENT
        </div>
      </div>

      <h1>
        Vi får Business Central til at <br>
        <span class="highlight">arbejde for din virksomhed</span>
      </h1>

      <p class="tagline">
        Skræddersyede AL-udvidelser, API-integrationer og automatiseret arbejdsflow
      </p>

      <div class="pillars">
        <div class="pillar-pill">🔌 API &amp; GLS Fragt</div>
        <div class="pillar-pill">📱 Custom BC Apps</div>
        <div class="pillar-pill">🌐 B2B Webportaler</div>
        <div class="pillar-pill">⚡ Automatisk Bogføring</div>
      </div>
    </div>

    <div class="right-col">
      <div class="stat-box">
        <div class="stat-row">
          <span class="stat-label">Svartid &amp; Support</span>
          <span class="stat-value stat-val-green">Direkte Dansk Support</span>
        </div>
        <div class="stat-row">
          <span class="stat-label">Leveringstid</span>
          <span class="stat-value">2 &ndash; 4 Uger</span>
        </div>
        <div class="stat-row">
          <span class="stat-label">Fiverr &amp; Erhverv</span>
          <span class="stat-value stat-val-orange">Verificeret Udvikler</span>
        </div>
      </div>

      <div class="domain-pill">
        💼 FIVERR.COM/TEDDYBOT82
      </div>
    </div>
  </div>
</body>
</html>`;

async function main() {
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=2560,1440']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 2560, height: 1440, deviceScaleFactor: 1 });
  await page.setContent(html, { waitUntil: 'networkidle0' });
  await page.screenshot({ path: OUT_PATH, type: 'png' });
  await browser.close();
  console.log(`YouTube Banner saved to: ${OUT_PATH}`);
}

main().catch(console.error);
