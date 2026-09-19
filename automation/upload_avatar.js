const puppeteer = require('puppeteer-core');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222', defaultViewport: null });
  const pages = await browser.pages();
  const ytPage = pages.find(p => p.url().includes('youtube.com'));

  const widgetFrame = ytPage.frames().find(f => f.url().includes('profilewidgets.youtube.com'));
  if (!widgetFrame) {
    console.error('Widget frame not found');
    browser.disconnect();
    return;
  }

  // Click "Fra computeren" tab
  await widgetFrame.evaluate(() => {
    const el = Array.from(document.querySelectorAll('*')).find(e => e.innerText === 'Fra computeren');
    if (el) el.click();
  });

  await new Promise(r => setTimeout(r, 2000));

  // Inspect elements in "Fra computeren" tab
  const uploadInfo = await widgetFrame.evaluate(() => {
    const fileInputs = Array.from(document.querySelectorAll('input[type="file"]')).map(i => ({ name: i.name, id: i.id, accept: i.accept }));
    const buttons = Array.from(document.querySelectorAll('button')).map(b => b.innerText.trim()).filter(Boolean);
    return { fileInputs, buttons, text: document.body.innerText.substring(0, 300) };
  });

  console.log('Upload Tab Info:', JSON.stringify(uploadInfo, null, 2));

  // If there is a file input, upload the avatar
  const fileInputHandle = await widgetFrame.$('input[type="file"]');
  if (fileInputHandle) {
    console.log('Uploading avatar to file input...');
    await fileInputHandle.uploadFile('/Users/teddy/teddy-apps/marketing/assets/teddy-apps-logo-square.png');
    console.log('Avatar uploaded!');
    await new Promise(r => setTimeout(r, 3000));
  }

  await ytPage.screenshot({ path: '/Users/teddy/teddy-apps/marketing/assets/avatar_cropper.png' });
  console.log('Screenshot saved to avatar_cropper.png');

  browser.disconnect();
}

main().catch(console.error);
