const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

const slides = [
  {
    title: 'Teddy Apps',
    subtitle: 'Microsoft Dynamics 365 Business Central Specialists',
    badge: 'Senior ERP Architecture',
    tag: 'WHO WE ARE',
    body: 'We help growing companies and international SMBs unlock the full potential of Business Central through clean code, custom AL extensions, and maintainable automation.'
  },
  {
    title: 'What We Build',
    subtitle: 'End-to-End Extensions & Enterprise Integrations',
    badge: 'Tailored Solutions',
    tag: 'CORE EXPERTISE',
    body: '• Custom AL extensions & workflow automation\n• E-commerce & CRM integrations (Shopify, WooCommerce, HubSpot)\n• Real-time REST & OData APIs'
  },
  {
    title: 'Proven Delivery',
    subtitle: 'Real-World Business Central Integrations',
    badge: 'Delivered Projects',
    tag: 'PORTFOLIO HIGHLIGHTS',
    body: '• GLS ShipIT automated label printing & tracking sync\n• Automated bookkeeping, bank matching & ledger posting\n• 24/7 B2B dealer ordering portals & self-service systems'
  },
  {
    title: 'Why Teddy Apps?',
    subtitle: 'High Precision, Clean Code & Clear Communication',
    badge: '5+ Years Experience',
    tag: 'THE ADVANTAGE',
    body: '• 5+ years specialized Business Central engineering experience\n• Future-proof AL architecture that survives BC upgrades\n• Danish & English fluent, based in Denmark'
  },
  {
    title: "Let's Build Together",
    subtitle: 'Ready to automate your Business Central workflows?',
    badge: 'Open for Business',
    tag: 'GET IN TOUCH',
    body: 'Reach out today with your project requirements or browse our gigs to find the exact package that fits your business needs.'
  }
];

function generateSlideHtml(s, idx) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
    body {
      width: 1920px;
      height: 1080px;
      background: radial-gradient(circle at 20% 25%, #1e293b 0%, #0f172a 45%, #020617 100%);
      color: #f8fafc;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 100px 120px;
      position: relative;
      overflow: hidden;
    }
    .bg-grid {
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background-image: linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
      background-size: 60px 60px;
      z-index: 1;
    }
    .glow-1 {
      position: absolute;
      width: 600px;
      height: 600px;
      background: radial-gradient(circle, rgba(37, 99, 235, 0.3) 0%, transparent 70%);
      top: -150px;
      right: -100px;
      z-index: 1;
    }
    .glow-2 {
      position: absolute;
      width: 500px;
      height: 500px;
      background: radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, transparent 70%);
      bottom: -100px;
      left: 100px;
      z-index: 1;
    }
    .header {
      position: relative;
      z-index: 2;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .logo-container {
      display: flex;
      align-items: center;
      gap: 20px;
    }
    .logo-icon {
      width: 64px;
      height: 64px;
      background: #020617;
      border: 2px solid #38bdf8;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 26px;
      color: #38bdf8;
      box-shadow: 0 0 25px rgba(56, 189, 248, 0.3);
    }
    .brand-name {
      font-size: 32px;
      font-weight: 800;
      letter-spacing: -0.5px;
      color: #ffffff;
    }
    .brand-sub {
      font-size: 16px;
      color: #94a3b8;
      font-weight: 500;
    }
    .badge {
      background: rgba(56, 189, 248, 0.15);
      border: 1px solid #38bdf8;
      color: #38bdf8;
      padding: 12px 28px;
      border-radius: 30px;
      font-size: 18px;
      font-weight: 700;
      letter-spacing: 0.5px;
    }
    .main-content {
      position: relative;
      z-index: 2;
      max-width: 1500px;
    }
    .tag {
      font-size: 18px;
      font-weight: 800;
      letter-spacing: 3px;
      color: #38bdf8;
      text-transform: uppercase;
      margin-bottom: 20px;
    }
    .title {
      font-size: 78px;
      font-weight: 900;
      line-height: 1.05;
      letter-spacing: -2px;
      margin-bottom: 20px;
      background: linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .subtitle {
      font-size: 34px;
      color: #94a3b8;
      font-weight: 400;
      margin-bottom: 40px;
    }
    .body-box {
      background: rgba(15, 23, 42, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 20px;
      padding: 34px 44px;
      font-size: 26px;
      line-height: 1.6;
      color: #e2e8f0;
      white-space: pre-line;
      box-shadow: 0 20px 40px rgba(0,0,0,0.4);
    }
    .footer {
      position: relative;
      z-index: 2;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      padding-top: 30px;
    }
    .step-indicator {
      display: flex;
      gap: 12px;
    }
    .step-dot {
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.2);
    }
    .step-dot.active {
      background: #38bdf8;
      box-shadow: 0 0 12px #38bdf8;
      width: 36px;
      border-radius: 10px;
    }
    .footer-right {
      font-size: 18px;
      color: #64748b;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div class="bg-grid"></div>
  <div class="glow-1"></div>
  <div class="glow-2"></div>

  <div class="header">
    <div class="logo-container">
      <div class="logo-icon">TA</div>
      <div>
        <div class="brand-name">Teddy Apps</div>
        <div class="brand-sub">Dynamics 365 Business Central Development</div>
      </div>
    </div>
    <div class="badge">${s.badge}</div>
  </div>

  <div class="main-content">
    <div class="tag">${s.tag}</div>
    <div class="title">${s.title}</div>
    <div class="subtitle">${s.subtitle}</div>
    <div class="body-box">${s.body}</div>
  </div>

  <div class="footer">
    <div class="step-indicator">
      ${[0,1,2,3,4].map(i => `<div class="step-dot ${i === idx ? 'active' : ''}"></div>`).join('')}
    </div>
    <div class="footer-right">Teddy Apps • fiverr.com/teddybot82</div>
  </div>
</body>
</html>`;
}

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  const slideDir = path.join(__dirname, 'video_frames');
  if (!fs.existsSync(slideDir)) fs.mkdirSync(slideDir, { recursive: true });

  const slideImages = [];
  for (let i = 0; i < slides.length; i++) {
    const html = generateSlideHtml(slides[i], i);
    await page.setContent(html, { waitUntil: 'load' });
    const imgPath = path.join(slideDir, `slide_${i}.png`);
    await page.screenshot({ path: imgPath });
    slideImages.push(imgPath);
    console.log(`Saved slide image ${i}: ${imgPath}`);
  }

  await page.close();
  await browser.disconnect();

  const outputVideo = '/Users/teddy/teddy-apps/marketing/assets/fiverr/intro_video.mp4';
  console.log('Assembling video with ffmpeg...');

  // Create concat file: each slide shown for 4.5 seconds
  const concatFile = path.join(slideDir, 'slides.txt');
  let concatContent = '';
  for (let i = 0; i < slides.length; i++) {
    concatContent += `file '${path.join(slideDir, `slide_${i}.png`)}'\nduration 4.5\n`;
  }
  // Add last slide once more for ffmpeg concat demuxer requirement
  concatContent += `file '${path.join(slideDir, `slide_${slides.length - 1}.png`)}'\n`;
  fs.writeFileSync(concatFile, concatContent);

  // Run ffmpeg with high quality H.264 + silent stereo audio track
  const cmd = `/opt/homebrew/bin/ffmpeg -y -f concat -safe 0 -i "${concatFile}" -f lavfi -i anullsrc=channel_layout=stereo:sample_rate=44100 -c:v libx264 -pix_fmt yuv420p -r 30 -c:a aac -shortest -movflags +faststart "${outputVideo}"`;
  execSync(cmd, { stdio: 'inherit' });

  console.log(`Intro video successfully generated at: ${outputVideo}`);
}

main().catch(console.error);
