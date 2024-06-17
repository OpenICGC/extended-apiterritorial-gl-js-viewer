//Puppeteer per si es vol fer screenshot
/* const puppeteer = require("puppeteer"); */
const sharp = require('sharp');


//screenshot
/* puppeteer
  .launch({
    defaultViewport: {
      width: 512,
      height: 512,
    },
  })
  .then(async (browser) => {
    const page = await browser.newPage();
    await page.goto("https://url.com");
    await page.screenshot({ path: "capture.png" });
    await browser.close();
  });
 */


//Tallar arrodonit i imprimir el 'capture.png'
const roundedCorners192 = Buffer.from(
  '<svg><rect x="0" y="0" width="192" height="192" rx="150" ry="150"/></svg>'
);

sharp('capture.png')
  .resize(192, 192)
  .composite([{
    input: roundedCorners192,
    blend: 'dest-in'
  }])
  .toFile('./public/icgc_icon_192.png');

const roundedCorners256 = Buffer.from(
  '<svg><rect x="0" y="0" width="256" height="256" rx="150" ry="150"/></svg>'
);

sharp('capture.png')
  .resize(256, 256)
  .composite([{
    input: roundedCorners256,
    blend: 'dest-in'
  }])
  .toFile('./public/icgc_icon_256.png');

const roundedCorners512 = Buffer.from(
  '<svg><rect x="0" y="0" width="512" height="512" rx="250" ry="250"/></svg>'
);

sharp('capture.png')
  .resize(512, 512)
  .composite([{
    input: roundedCorners512,
    blend: 'dest-in'
  }])
  .toFile('./public/icgc_icon_512.png');