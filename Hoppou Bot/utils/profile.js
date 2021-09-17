const { createCanvas, loadImage } = require('canvas');
const imagemin = require('imagemin');
const imageminWebp = require('imagemin-webp');

const canvas = createCanvas(1024, 512);
const ctx = canvas.getContext('2d');

function scalePreserveAspectRatio(imgW, imgH, maxW, maxH) {
  return (Math.min((maxW / imgW), (maxH / imgH)));
}

async function addImage(src, imgOffsetX, imgOffsetY, width, height, offsetX = 0, offsetY = 0) {
  const image = await loadImage(src);
  const s = scalePreserveAspectRatio(image.width, image.height, width, height);
  return new Promise((resolve) => {
      ctx.drawImage(image, imgOffsetX, imgOffsetY, image.width, image.height, offsetX, offsetY, image.width * s, image.height * s);
      resolve();
    });
}

module.exports = async function drawProfile(userProfile) {

    // userProfile = {
    //     name: 'zander123p',
    //     userID: '99604105298731008',
    //     title: 'Keeper of the Eternal Flame',
    //     level: 12,
    //     bg: 0,
    //     flare: 0,
    //     animated: true,
    //     imgURL: 'https://cdn.discordapp.com/avatars/99604105298731008/2089e43928ffe621be1bb296f977b89a.png?size=1024',
    // }

    // Background
    ctx.fillStyle = 'black';
    roundRect(ctx, 0, 0, 1024, 512, 20, true);
    ctx.save();
    roundRect(ctx, 0, 0, 1024, 512, 20, false, false, true);

    // Background Image
    await addBackground(userProfile.bg);

    // Card Header
    ctx.fillStyle = 'rgba(72, 72, 72, 0.55)';
    ctx.shadowColor = 'black';
    ctx.shadowBlur = 15;
    ctx.shadowOffsetY = 8;
    ctx.fillRect(0, 0, 1024, 100);
    ctx.shadowOffsetY = 0;
    ctx.shadowColor = 'none';
    ctx.shadowBlur = 0;

    // Text
    ctx.font = '55px serif';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.fillText(`${(userProfile.name.length > 12) ? userProfile.name.substring(0, 11) + '...' : userProfile.name}`, (1024 / 2) / 2, 55 + ((userProfile.title) ? 0 : 15));
    ctx.fillText(`Guild Level: ${userProfile.level}`, (1024 / 2) * 1.5, 55 + 15);

    ctx.shadowColor = 'black';
    ctx.shadowBlur = 15;
    ctx.shadowOffsetY = 8;
    ctx.lineWidth = 8;
    ctx.font = '72px serif';
    ctx.textAlign = 'start';
    ctx.strokeText(`Guild Rank: #${userProfile.rank}`, (1024 / 2) / 2, 512 - 24);
    ctx.fillText(`Guild Rank: #${userProfile.rank}`, (1024 / 2) / 2, 512 - 24);
    ctx.font = '55px serif';
    ctx.textAlign = 'center';
    ctx.lineWidth = 0;
    ctx.shadowOffsetY = 0;
    ctx.shadowColor = 'none';
    ctx.shadowBlur = 0;

    ctx.font = '22px serif';
    if (userProfile.title)
      ctx.fillText(`<${userProfile.title}>`, (1024 / 2) / 2, 60 + 25);
    ctx.textAlign = 'start';

    // // Flare
    // await addFlare(userProfile.flare, userProfile.userID);

    // Profile Image
    ctx.save();
    ctx.beginPath();
    ctx.arc(128, 512 - 128, 128, -Math.PI, Math.PI);
    ctx.lineTo(250, 250);
    ctx.clip();
    await addImage(userProfile.imgURL, 0, 0, 256, 256, 0, 512 - 256);
    ctx.restore();

    let buffer = canvas.toBuffer();

    buffer = await imagemin.buffer(buffer, {
      plugins: [
        imageminWebp({ quality: 50, alphaQuality: 50 }),
      ],
    });

    return buffer;
};

async function addBackground(bg) {
    const background = backgrounds.find(b => b.id === bg);
    ctx.filter = 'blur(2px)';
    await addImage(background.path, background.offset.x, background.offset.y, 1080, 1080);
    ctx.filter = 'none';
}

// async function addFlare(flare, userID) {
//   const _flare = flares.find(f => f.id === flare);
//   if (!_flare) return;
//   _flare.draw();
// }

/**
 * Draws a rounded rectangle using the current state of the canvas.
 * If you omit the last three params, it will draw a rectangle
 * outline with a 5 pixel border radius
 * @param {CanvasRenderingContext2D} ctx
 * @param {Number} x The top left x coordinate
 * @param {Number} y The top left y coordinate
 * @param {Number} width The width of the rectangle
 * @param {Number} height The height of the rectangle
 * @param {Number} [radius = 5] The corner radius; It can also be an object
 *                 to specify different radii for corners
 * @param {Number} [radius.tl = 0] Top left
 * @param {Number} [radius.tr = 0] Top right
 * @param {Number} [radius.br = 0] Bottom right
 * @param {Number} [radius.bl = 0] Bottom left
 * @param {Boolean} [fill = false] Whether to fill the rectangle.
 * @param {Boolean} [stroke = true] Whether to stroke the rectangle.
 * @param {Boolean} [clip = false] Whether to use the rectangle as a clip.
 */
function roundRect(ctx1, x, y, width, height, radius, fill, stroke, clip) {
  if (typeof stroke === 'undefined') {
    stroke = true;
  }
  if (typeof radius === 'undefined') {
    radius = 5;
  }
  if (typeof radius === 'number') {
    radius = { tl: radius, tr: radius, br: radius, bl: radius };
  } else {
    const defaultRadius = { tl: 0, tr: 0, br: 0, bl: 0 };
    for (const side in defaultRadius) {
      radius[side] = radius[side] || defaultRadius[side];
    }
  }
  if (typeof clip === 'undefined') {
    clip = false;
  }

  ctx1.beginPath();
  ctx1.moveTo(x + radius.tl, y);
  ctx1.lineTo(x + width - radius.tr, y);
  ctx1.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
  ctx1.lineTo(x + width, y + height - radius.br);
  ctx1.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
  ctx1.lineTo(x + radius.bl, y + height);
  ctx1.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
  ctx1.lineTo(x, y + radius.tl);
  ctx1.quadraticCurveTo(x, y, x + radius.tl, y);
  ctx1.closePath();
  if (fill) {
    ctx1.fill();
  }
  if (stroke) {
    ctx1.stroke();
  }
  if (clip) {
    ctx1.clip();
  }

}

// const SimplexNoise = require('simplex-noise');

const backgrounds = [
    { id: 0, path: './utils/img/bg1.jpg', offset: { x: 50, y: 120 } },
    { id: 1, path: './utils/img/bg2.jpg', offset: { x: 0, y: 0 } },
    { id: 2, path: './utils/img/bg3.jpg', offset: { x: 0, y: 0 } },
    { id: 3, path: './utils/img/bg4.jpg', offset: { x: 0, y: 50 } },
    { id: 4, path: './utils/img/bg5.jpg', offset: { x: 0, y: 115 } },
];

// // flares = [
// //     { id: 1, async draw(seed) {
// //         let simplex = new SimplexNoise(seed);
// //         ctx.save();

// //         // ctx.beginPath();
// //         // ctx.moveTo(1024, 512/2-50);
// //         // ctx.quadraticCurveTo(1024/2, 512/2-50, (1024/2)/3, 512);
// //         // ctx.lineTo(0, 512);
// //         // ctx.lineTo(0, 0);
// //         // ctx.lineTo(1024, 0);
// //         // ctx.clip();

// //         for (let x = 0; x < 10; x++) {
// //           for (let y = 0; y < 10; y++) {
// //             let noise = simplex.noise2D(x + .5, y + .5);

// //             await addImage(__dirname + '\\img\\flares\\heart.png', 0, 0, 64, 64, x * 100, y * 100);
// //             if (noise > .5) {
// //             }
// //           }
// //         }

// //         ctx.restore();
// //     }},
// // ]