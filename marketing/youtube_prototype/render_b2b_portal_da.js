const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

const OUT_DIR = '/Users/teddy/teddy-apps/marketing/youtube_prototype';
const FRAMES_DIR = path.join(OUT_DIR, 'frames_b2b');
const AUDIO_FILE = path.join(OUT_DIR, 'master_voiceover_b2b.mp3');
const OUTPUT_VIDEO = path.join(OUT_DIR, 'b2b_portal_explainer_dansk.mp4');

const FPS = 30;
const DURATION_SEC = 49;
const TOTAL_FRAMES = FPS * DURATION_SEC;

if (!fs.existsSync(FRAMES_DIR)) {
  fs.mkdirSync(FRAMES_DIR, { recursive: true });
}

function getHtmlTemplate() {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    body {
      width: 1920px;
      height: 1080px;
      background: #060913;
      color: #f8fafc;
      overflow: hidden;
      position: relative;
    }
    canvas#bg {
      position: absolute;
      top: 0; left: 0; width: 1920px; height: 1080px;
      z-index: 0;
    }
    #ui-container {
      position: absolute;
      top: 0; left: 0; width: 1920px; height: 1080px;
      z-index: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 60px 80px;
    }
    .top-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .logo-badge {
      display: flex;
      align-items: center;
      gap: 16px;
      background: rgba(15, 23, 42, 0.7);
      border: 1px solid rgba(56, 189, 248, 0.3);
      padding: 10px 24px;
      border-radius: 9999px;
      backdrop-filter: blur(12px);
    }
    .logo-dot {
      width: 12px; height: 12px; border-radius: 50%; background: #38bdf8;
      box-shadow: 0 0 12px #38bdf8;
    }
    .logo-text { font-size: 20px; font-weight: 700; letter-spacing: 2px; color: #f8fafc; }
    .ep-tag {
      font-size: 16px; font-weight: 600; color: #94a3b8; letter-spacing: 1.5px;
      background: rgba(30, 41, 59, 0.6); padding: 8px 18px; border-radius: 8px;
      border: 1px solid rgba(255, 255, 255, 0.08);
    }
    #scene-view {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }
    .bottom-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 15px;
      color: #64748b;
      letter-spacing: 1px;
    }
    .tech-pill {
      background: rgba(14, 165, 233, 0.1);
      color: #38bdf8;
      border: 1px solid rgba(14, 165, 233, 0.3);
      padding: 6px 14px;
      border-radius: 6px;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <canvas id="bg" width="1920" height="1080"></canvas>
  <div id="ui-container">
    <div class="top-bar">
      <div class="logo-badge">
        <div class="logo-dot"></div>
        <div class="logo-text">TEDDY APPS</div>
      </div>
      <div class="ep-tag">B2B PORTAL &amp; SELVBETJENING</div>
    </div>

    <div id="scene-view"></div>

    <div class="bottom-bar">
      <div>DYNAMICS 365 BUSINESS CENTRAL &bull; REST API &bull; FORHANDLERPORTAL &bull; 24/7 ORDREFLOW</div>
      <div class="tech-pill">TEDDYAPPS.DK</div>
    </div>
  </div>

  <script>
    const canvas = document.getElementById('bg');
    const ctx = canvas.getContext('2d');
    const sceneView = document.getElementById('scene-view');

    function renderScene(time) {
      ctx.fillStyle = '#060913';
      ctx.fillRect(0, 0, 1920, 1080);

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      const gridSize = 60;
      const offset = (time * 15) % gridSize;
      for (let x = 0; x < 1920; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(1920, x);
        ctx.stroke();
      }
      for (let y = offset; y < 1080; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(1920, y);
        ctx.stroke();
      }

      if (time < 14.5) {
        renderScene1(time);
      } else if (time < 29.0) {
        renderScene2(time - 14.5);
      } else if (time < 40.0) {
        renderScene3(time - 29.0);
      } else {
        renderScene4(time - 40.0);
      }
    }

    function renderScene1(t) {
      const alpha = Math.min(1, t * 2);
      sceneView.innerHTML = \`
        <div style="opacity: \${alpha}; display: flex; flex-direction: column; align-items: center; text-align: center; max-width: 1250px;">
          <div style="background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.4); color: #f87171; padding: 8px 24px; border-radius: 9999px; font-weight: 700; font-size: 16px; letter-spacing: 2px; margin-bottom: 24px; box-shadow: 0 0 20px rgba(239, 68, 68, 0.2);">
            ⚠️ DEN MANUELLE ORDRE-FLASKEHALS
          </div>
          <h1 style="font-size: 60px; font-weight: 800; line-height: 1.15; margin-bottom: 24px; color: #ffffff; letter-spacing: -1px;">
            B2B-ordrer på mail &amp; telefon <br><span style="color: #ef4444;">koster dyrebar tid og tabt omsætning</span>
          </h1>
          <p style="font-size: 26px; color: #94a3b8; max-width: 950px; line-height: 1.5; margin-bottom: 50px;">
            Forhandlere venter på lager- og prisopslag, ordrer skal tastes manuelt i ERP, og I mister salg uden for normal kontortid.
          </p>

          <div style="display: flex; gap: 40px; justify-content: center; width: 100%;">
            <div style="flex: 1; max-width: 340px; background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 20px; padding: 32px; backdrop-filter: blur(16px); box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
              <div style="font-size: 48px; margin-bottom: 12px;">📞</div>
              <div style="font-size: 38px; font-weight: 800; color: #f87171; margin-bottom: 8px;">Supportkø</div>
              <div style="font-size: 18px; color: #94a3b8;">Kundeservice bundet af rutineopkald om lager &amp; priser</div>
            </div>

            <div style="flex: 1; max-width: 340px; background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 20px; padding: 32px; backdrop-filter: blur(16px); box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
              <div style="font-size: 48px; margin-bottom: 12px;">🐌</div>
              <div style="font-size: 38px; font-weight: 800; color: #f87171; margin-bottom: 8px;">Tastetid</div>
              <div style="font-size: 18px; color: #94a3b8;">Manuel indtastning af PDF- og mailordrer i Business Central</div>
            </div>

            <div style="flex: 1; max-width: 340px; background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 20px; padding: 32px; backdrop-filter: blur(16px); box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
              <div style="font-size: 48px; margin-bottom: 12px;">🔒</div>
              <div style="font-size: 38px; font-weight: 800; color: #f87171; margin-bottom: 8px;">Lukket 16:00</div>
              <div style="font-size: 18px; color: #94a3b8;">Kunder kan ikke placere hastende ordrer aften og weekend</div>
            </div>
          </div>
        </div>
      \`;
    }

    function renderScene2(t) {
      const alpha = Math.min(1, t * 2);
      sceneView.innerHTML = \`
        <div style="opacity: \${alpha}; width: 100%; max-width: 1400px; display: flex; flex-direction: column; align-items: center;">
          <div style="background: rgba(14, 165, 233, 0.15); border: 1px solid rgba(14, 165, 233, 0.4); color: #38bdf8; padding: 8px 24px; border-radius: 9999px; font-weight: 700; font-size: 16px; letter-spacing: 2px; margin-bottom: 24px; box-shadow: 0 0 20px rgba(14, 165, 233, 0.2);">
            ⚡ LØSNINGEN: B2B SELVBETJENINGSPORTAL
          </div>
          <h1 style="font-size: 56px; font-weight: 800; text-align: center; margin-bottom: 50px; color: #ffffff;">
            Forhandler Portal <span style="color: #38bdf8;">&harr;</span> Dynamics 365 Business Central
          </h1>

          <div style="display: flex; align-items: center; justify-content: space-between; width: 100%; position: relative; padding: 0 40px;">
            
            <div style="flex: 1; max-width: 360px; background: rgba(15, 23, 42, 0.85); border: 2px solid #38bdf8; border-radius: 24px; padding: 36px 28px; text-align: center; box-shadow: 0 0 35px rgba(56, 189, 248, 0.3); backdrop-filter: blur(16px);">
              <div style="width: 70px; height: 70px; background: linear-gradient(135deg, #0ea5e9, #38bdf8); border-radius: 18px; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px auto; font-size: 32px;">💻</div>
              <h3 style="font-size: 24px; font-weight: 700; margin-bottom: 8px;">Forhandler Portal</h3>
              <p style="font-size: 16px; color: #94a3b8; line-height: 1.4;">Individuelle priser, live lageropslag &amp; CSV hurtigbestilling</p>
              <div style="margin-top: 20px; background: rgba(56, 189, 248, 0.2); color: #38bdf8; font-size: 13px; font-weight: 700; padding: 6px 12px; border-radius: 6px;">24/7 SELVBETJENING</div>
            </div>

            <div style="flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative;">
              <div style="font-size: 12px; font-weight: 700; letter-spacing: 1px; color: #38bdf8; margin-bottom: 8px;">REST API / JSON</div>
              <div style="width: 100%; height: 4px; background: linear-gradient(90deg, #38bdf8, #0284c7); position: relative; border-radius: 2px; box-shadow: 0 0 10px #38bdf8;">
                <div style="position: absolute; width: 14px; height: 14px; background: #ffffff; border-radius: 50%; top: -5px; left: \${(t * 70) % 100}%; box-shadow: 0 0 12px #ffffff;"></div>
              </div>
              <div style="font-size: 13px; color: #64748b; margin-top: 8px;">Prisaftaler &amp; varenumre</div>
            </div>

            <div style="flex: 1; max-width: 360px; background: rgba(15, 23, 42, 0.9); border: 2px solid #0284c7; border-radius: 24px; padding: 36px 28px; text-align: center; box-shadow: 0 0 45px rgba(2, 132, 199, 0.4); backdrop-filter: blur(16px); transform: scale(1.05);">
              <div style="width: 70px; height: 70px; background: linear-gradient(135deg, #0284c7, #0369a1); border-radius: 18px; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px auto; font-size: 32px;">⚡</div>
              <h3 style="font-size: 24px; font-weight: 700; margin-bottom: 8px;">Teddy Apps Motor</h3>
              <p style="font-size: 16px; color: #94a3b8; line-height: 1.4;">Rettighedsstyring, kreditkontrol &amp; datavalidering</p>
              <div style="margin-top: 20px; background: rgba(2, 132, 199, 0.2); color: #38bdf8; font-size: 13px; font-weight: 700; padding: 6px 12px; border-radius: 6px;">SIKKER INTEGRATION</div>
            </div>

            <div style="flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative;">
              <div style="font-size: 12px; font-weight: 700; letter-spacing: 1px; color: #f59e0b; margin-bottom: 8px;">ORDRE DIREKTE</div>
              <div style="width: 100%; height: 4px; background: linear-gradient(90deg, #0284c7, #f59e0b); position: relative; border-radius: 2px; box-shadow: 0 0 10px #f59e0b;">
                <div style="position: absolute; width: 14px; height: 14px; background: #ffffff; border-radius: 50%; top: -5px; left: \${(t * 70) % 100}%; box-shadow: 0 0 12px #ffffff;"></div>
              </div>
              <div style="font-size: 13px; color: #64748b; margin-top: 8px;">Oprettelse i ERP kladde</div>
            </div>

            <div style="flex: 1; max-width: 360px; background: rgba(15, 23, 42, 0.85); border: 2px solid #f59e0b; border-radius: 24px; padding: 36px 28px; text-align: center; box-shadow: 0 0 35px rgba(245, 158, 11, 0.3); backdrop-filter: blur(16px);">
              <div style="width: 70px; height: 70px; background: linear-gradient(135deg, #d97706, #f59e0b); border-radius: 18px; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px auto; font-size: 32px;">📊</div>
              <h3 style="font-size: 24px; font-weight: 700; margin-bottom: 8px;">Business Central</h3>
              <p style="font-size: 16px; color: #94a3b8; line-height: 1.4;">Salgsordre frigivet, plukliste klar på lageret</p>
              <div style="margin-top: 20px; background: rgba(245, 158, 11, 0.2); color: #fbbf24; font-size: 13px; font-weight: 700; padding: 6px 12px; border-radius: 6px;">ØJEBLIKKELIG ORDRE</div>
            </div>

          </div>
        </div>
      \`;
    }

    function renderScene3(t) {
      const alpha = Math.min(1, t * 2);
      sceneView.innerHTML = \`
        <div style="opacity: \${alpha}; display: flex; flex-direction: column; align-items: center; text-align: center; max-width: 1200px;">
          <div style="background: rgba(34, 197, 94, 0.15); border: 1px solid rgba(34, 197, 94, 0.4); color: #4ade80; padding: 8px 24px; border-radius: 9999px; font-weight: 700; font-size: 16px; letter-spacing: 2px; margin-bottom: 24px; box-shadow: 0 0 20px rgba(34, 197, 94, 0.2);">
            📈 DOKUMENTEREDE FORRETNINGSFORDELE
          </div>
          <h1 style="font-size: 64px; font-weight: 800; line-height: 1.15; margin-bottom: 50px; color: #ffffff;">
            24/7 ordremodtagelse. <span style="color: #4ade80;">Nul manuel indtastning.</span>
          </h1>

          <div style="display: flex; gap: 40px; justify-content: center; width: 100%;">
            <div style="flex: 1; max-width: 360px; background: rgba(15, 23, 42, 0.85); border: 2px solid rgba(34, 197, 94, 0.4); border-radius: 24px; padding: 40px 30px; backdrop-filter: blur(16px); box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
              <div style="font-size: 52px; font-weight: 900; color: #4ade80; margin-bottom: 8px;">24/7</div>
              <div style="font-size: 22px; font-weight: 700; color: #ffffff; margin-bottom: 12px;">Døgnåbent B2B Salg</div>
              <div style="font-size: 16px; color: #94a3b8; line-height: 1.4;">Forhandlere kan bestille og se lagertal uden for kontorets åbningstid.</div>
            </div>

            <div style="flex: 1; max-width: 360px; background: rgba(15, 23, 42, 0.85); border: 2px solid rgba(56, 189, 248, 0.4); border-radius: 24px; padding: 40px 30px; backdrop-filter: blur(16px); box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
              <div style="font-size: 52px; font-weight: 900; color: #38bdf8; margin-bottom: 8px;">-60%</div>
              <div style="font-size: 22px; font-weight: 700; color: #ffffff; margin-bottom: 12px;">Færre Rutineopkald</div>
              <div style="font-size: 16px; color: #94a3b8; line-height: 1.4;">Kunder finder selv fakturahistorik, fragtstatus og aftalepriser online.</div>
            </div>

            <div style="flex: 1; max-width: 360px; background: rgba(15, 23, 42, 0.85); border: 2px solid rgba(168, 85, 247, 0.4); border-radius: 24px; padding: 40px 30px; backdrop-filter: blur(16px); box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
              <div style="font-size: 52px; font-weight: 900; color: #c084fc; margin-bottom: 8px;">3x</div>
              <div style="font-size: 22px; font-weight: 700; color: #ffffff; margin-bottom: 12px;">Hurtigere Genbestilling</div>
              <div style="font-size: 16px; color: #94a3b8; line-height: 1.4;">Lyn-upload af genbestillinger via CSV og genbestillings-skabeloner.</div>
            </div>
          </div>
        </div>
      \`;
    }

    function renderScene4(t) {
      const alpha = Math.min(1, t * 2);
      sceneView.innerHTML = \`
        <div style="opacity: \${alpha}; display: flex; flex-direction: column; align-items: center; text-align: center; max-width: 1000px;">
          <div style="width: 100px; height: 100px; background: linear-gradient(135deg, #0284c7, #38bdf8); border-radius: 30px; display: flex; align-items: center; justify-content: center; font-size: 50px; margin-bottom: 30px; box-shadow: 0 0 50px rgba(56, 189, 248, 0.5);">
            🛒
          </div>
          <h1 style="font-size: 64px; font-weight: 800; line-height: 1.15; margin-bottom: 20px; color: #ffffff;">
            Digitalisér jeres B2B-salg <br><span style="color: #38bdf8;">med Teddy Apps</span>
          </h1>
          <p style="font-size: 26px; color: #94a3b8; line-height: 1.5; margin-bottom: 40px;">
            Lad Teddy Apps bygge jeres forhandlerportal, webshopintegration eller specialudvidelse til Business Central.
          </p>

          <div style="display: flex; gap: 20px; align-items: center;">
            <div style="background: linear-gradient(135deg, #0284c7, #38bdf8); color: #020617; padding: 18px 48px; border-radius: 14px; font-size: 22px; font-weight: 800; letter-spacing: 0.5px; box-shadow: 0 10px 30px rgba(56, 189, 248, 0.4);">
              BYG JERES B2B PORTAL &bull; TEDDYAPPS.DK
            </div>
          </div>

          <div style="margin-top: 40px; font-size: 20px; color: #64748b;">
            DYNAMICS 365 BUSINESS CENTRAL &bull; AL UDVIKLING &bull; B2B E-COMMERCE
          </div>
        </div>
      \`;
    }

    window.seek = (t) => {
      renderScene(t);
    };
  </script>
</body>
</html>`;
}

async function main() {
  console.log('--- RENDERING B2B PORTAL EXPLAINER VIDEO ---');
  console.log(`Total duration: ${DURATION_SEC}s @ ${FPS}fps = ${TOTAL_FRAMES} frames`);

  const templateHtml = getHtmlTemplate();
  const templatePath = path.join(OUT_DIR, 'template_b2b.html');
  fs.writeFileSync(templatePath, templateHtml);

  console.log('Launching headless Chrome renderer...');
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1920,1080']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto(`file://${templatePath}`, { waitUntil: 'load' });

  console.log('Rendering B2B Portal frames...');
  const t0 = Date.now();

  for (let f = 0; f < TOTAL_FRAMES; f++) {
    const time = f / FPS;
    await page.evaluate((t) => window.seek(t), time);

    const frameFile = path.join(FRAMES_DIR, `frame_${String(f).padStart(5, '0')}.png`);
    await page.screenshot({ path: frameFile, type: 'png' });

    if (f % 200 === 0 || f === TOTAL_FRAMES - 1) {
      const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
      const pct = Math.round((f / TOTAL_FRAMES) * 100);
      console.log(`[${pct}%] Frame ${f}/${TOTAL_FRAMES} (${elapsed}s elapsed)`);
    }
  }

  await browser.close();
  console.log(`B2B Portal frames rendered in ${((Date.now() - t0) / 1000).toFixed(1)}s!`);

  console.log('Compiling B2B Portal video with FFmpeg and mastered Danish audio...');
  const ffmpegCmd = [
    'ffmpeg', '-y',
    '-framerate', String(FPS),
    '-i', path.join(FRAMES_DIR, 'frame_%05d.png'),
    '-i', AUDIO_FILE,
    '-c:v', 'libx264',
    '-preset', 'fast',
    '-crf', '18',
    '-pix_fmt', 'yuv420p',
    '-c:a', 'aac',
    '-b:a', '192k',
    '-shortest',
    OUTPUT_VIDEO
  ];

  console.log('Running:', ffmpegCmd.join(' '));
  const proc = spawn('ffmpeg', ffmpegCmd.slice(1));

  proc.on('close', (code) => {
    if (code === 0) {
      console.log('\n========================================');
      console.log('B2B PORTAL VIDEO GENERATION COMPLETE! 🎉');
      console.log(`Saved video to: ${OUTPUT_VIDEO}`);
      console.log('========================================');
      fs.rmSync(FRAMES_DIR, { recursive: true, force: true });
      console.log('Cleaned temporary frames directory.');
    } else {
      console.error(`FFmpeg failed with exit code ${code}`);
    }
  });
}

main().catch(console.error);
