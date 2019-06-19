var express = require('express');
var router = express.Router();

const fs = require('fs');
const moment = require('moment');
const AWS = require('aws-sdk');
const sign = require('aws-cloudfront-sign');

const CLOUDFRONT_KEYPARE_ID = process.env.CLOUDFRONT_KEYPARE_ID;
const CDN_HOST = 'https://doi4gaf5j9pnq.cloudfront.net';
const PRIVATE_KEY_PATH = __dirname + '/../cert/pk-APKAJ5MB4Q7VGNUPG7CA.pem';


router.get('/url', function(req, res, next) {
  const base_url = `${CDN_HOST}/white.png`;
  const private_key = fs.readFileSync(PRIVATE_KEY_PATH, 'utf-8');

  var url = sign.getSignedUrl(base_url, {
    keypairId: CLOUDFRONT_KEYPARE_ID,
    expireTime: Date.now() + 60000,
    privateKeyString: private_key
  });

  res.render('cloudfront/url', {
    title: 'Pre-signed URL with aws-cloudfront-sign',
    url: url
  });
});


router.get('/url_signer', (req, res, next) => {
  (async () => {

    const base_url = `${CDN_HOST}/white.png`;
    const private_key = fs.readFileSync(PRIVATE_KEY_PATH, 'utf-8');
    const expires = moment.utc().add(1, 'days').unix();

    const url = await get_signed_url_async(
      CLOUDFRONT_KEYPARE_ID,
      private_key,
      {
        url: base_url,
        expires
      }
    );

    const local = {
      title: 'Pre-signed URL with Signer',
      data: {
        url: url
      }
    };

    res.render('cloudfront/url_signer', local);

  })().catch(next);
});

const get_signed_url_async = async (keypair_id, private_key, options) => {
  return new Promise((resolve, reject) => {
    const signer = new AWS.CloudFront.Signer(keypair_id, private_key);
    signer.getSignedUrl(options, (err, url) => {
      if (err) {
        reject(err);
      }
      resolve(url);
    });
  });
};



module.exports = router;

