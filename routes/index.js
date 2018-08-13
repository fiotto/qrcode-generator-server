const path = require('path');

const express = require('express');
const router = express.Router();

const QRCode = require('qrcode');
const Jimp = require("jimp");

const text = 'https://www.google.com/';

/* GET users listing. */
router.get('/', function(req, res, next) {
  let buffer;

  let firstImage;
  let secondImage;

  QRCode.toDataURL(text, {
    errorCorrectionLevel: 'H',
    width: 512
  })
  .then((url) => {
    const image = url.split(",")[1];
    buffer = new Buffer(image, 'base64');

    return Jimp.read(buffer);
  })
  .then((image) => {
    firstImage = image;

    return Jimp.read("tmp/image.png")
  })
  .then((image) => {
    secondImage = image;

    secondImage.scaleToFit(128, 128);

    let x = (512 - secondImage.bitmap.width)/2;
    let y = (512 - secondImage.bitmap.height)/2

    firstImage.composite( secondImage, x, y);

    firstImage.getBuffer(Jimp.MIME_PNG, function (err, buffer) {
      res.writeHead(200, {
         'Content-Type': 'image/png',
         'Content-Length': buffer.length
      });

      res.end(buffer);
    });
  })
  .catch((err) => {
    console.error(err)
  })
});

module.exports = router;
