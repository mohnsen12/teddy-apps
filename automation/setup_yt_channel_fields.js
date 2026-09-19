const puppeteer = require('puppeteer-core');

async function main() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222', defaultViewport: null });
  const pages = await browser.pages();
  const ytPage = pages.find(p => p.url().includes('youtube.com'));

  const inputs = await ytPage.$$('>>> tp-yt-paper-input input');
  console.log('Found inputs:', inputs.length);

  // 1. Name input
  await inputs[0].click({ clickCount: 3 });
  await ytPage.keyboard.down('Meta');
  await ytPage.keyboard.press('a');
  await ytPage.keyboard.up('Meta');
  await ytPage.keyboard.press('Backspace');
  await ytPage.keyboard.type('Teddy Apps');
  console.log('Typed Name: Teddy Apps');

  // 2. Handle input
  await inputs[1].click({ clickCount: 3 });
  await ytPage.keyboard.down('Meta');
  await ytPage.keyboard.press('a');
  await ytPage.keyboard.up('Meta');
  await ytPage.keyboard.press('Backspace');
  await ytPage.keyboard.type('teddyapps');
  console.log('Typed Handle: teddyapps');

  // Wait for validation
  await new Promise(r => setTimeout(r, 2000));

  // Check if handle is taken or valid
  const handleFeedback = await ytPage.evaluate(() => {
    const dialog = document.querySelector('ytd-channel-creation-dialog-renderer');
    return dialog ? dialog.innerText : '';
  });
  console.log('Dialog Text:\n', handleFeedback);

  // Upload Avatar
  const btns = await ytPage.$$('>>> ytd-channel-creation-dialog-renderer button');
  const chooseImgBtn = btns[0]; // "Vælg billede"

  try {
    const [fileChooser] = await Promise.all([
      ytPage.waitForFileChooser({ timeout: 5000 }),
      chooseImgBtn.click()
    ]);
    console.log('File chooser opened!');
    await fileChooser.accept(['/Users/teddy/teddy-apps/marketing/assets/teddy-apps-logo-square.png']);
    console.log('Avatar uploaded!');
    await new Promise(r => setTimeout(r, 3000));
  } catch (err) {
    console.log('File chooser note:', err.message);
  }

  await ytPage.screenshot({ path: '/Users/teddy/teddy-apps/marketing/assets/create_channel_ready.png' });
  console.log('Screenshot saved to create_channel_ready.png');

  browser.disconnect();
}

main().catch(console.error);
