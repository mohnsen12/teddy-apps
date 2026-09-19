const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const page = (await browser.pages())[0];

  const videoPath = '/Users/teddy/teddy-apps/marketing/assets/fiverr/intro_video.mp4';
  console.log('Target video:', videoPath);

  const fileInputs = await page.$$('input[type="file"]');
  console.log('Found file inputs count:', fileInputs.length);

  // File input 1 is the video input
  const videoInput = fileInputs[1];
  await videoInput.uploadFile(videoPath);
  console.log('Uploaded video file!');

  await new Promise(r => setTimeout(r, 5000));

  await page.screenshot({ path: '/Users/teddy/teddy-apps/automation/fiverr_automation/intro_video_uploaded.png' });
  console.log('Saved intro_video_uploaded.png');

  await browser.disconnect();
}

main().catch(console.error);
