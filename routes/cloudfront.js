var express = require('express');
var router = express.Router();

const fs = require('fs');
const moment = require('moment');
const AWS = require('aws-sdk');
const sign = require('aws-cloudfront-sign');
const path = require('path');

const CLOUDFRONT_KEYPARE_ID = process.env.CLOUDFRONT_KEYPARE_ID;
const CDN_HOST = 'https://doi4gaf5j9pnq.cloudfront.net';
const PRIVATE_KEY_PATH = path.join(__dirname, '..', 'etc', 'cloudfront', 'pk-APKAJ5MB4Q7VGNUPG7CA.pem');


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

router.get('/url_signer_policy', (req, res, next) => {
  (async () => {

    const base_url = `${CDN_HOST}/*white*`;
    const private_key = fs.readFileSync(PRIVATE_KEY_PATH, 'utf-8');
    const expires = moment.utc().add(1, 'days').unix();

    const policy = {
      "Statement": [
        {
          "Resource": base_url,
          "Condition":{
            "DateLessThan":{ "AWS:EpochTime": expires },
            //"DateGreaterThan":{"AWS:EpochTime":optional beginning date and time in Unix time format and UTC},
            //"IpAddress":{"AWS:SourceIp":"optional IP address"}
          }
        }
      ]
    };

    const url = await get_signed_url_async(
      CLOUDFRONT_KEYPARE_ID,
      private_key,
      {
        url: base_url, // Required?
        //expires,
        policy: JSON.stringify(policy)
      }
    );

    const local = {
      title: 'Pre-signed URL, Custom Policy',
      data: {
        urls: []
      }
    };

    local.data.urls.push(url.replace(base_url, `${CDN_HOST}/white.png`));
    local.data.urls.push(url.replace(base_url, `${CDN_HOST}/white2.png`));
    local.data.urls.push(url.replace(base_url, `${CDN_HOST}/folder/white.png`));
    local.data.urls.push(url.replace(base_url, `${CDN_HOST}/public/images/pixel_white.png`));

    console.log('local', local);

    res.render('cloudfront/url_signer_policy', local);

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


router.get('/url_signer_cookie', (req, res, next) => {
  (async () => {

    const private_key = fs.readFileSync(PRIVATE_KEY_PATH, 'utf-8');
    const expires = moment.utc().add(1, 'days').unix();

    const policy = {
      "Statement": [
        {
          "Resource": `${CDN_HOST}/white*`,
          "Condition":{
            "DateLessThan":{ "AWS:EpochTime": expires }
          }
        },
        // {
        //   "Resource": `${CDN_HOST}/white.png`,
        //   "Condition":{
        //     "DateLessThan":{ "AWS:EpochTime": expires }
        //   }
        // },
        // {
        //   "Resource": `${CDN_HOST}/white2.png`,
        //   "Condition":{
        //     "DateLessThan":{ "AWS:EpochTime": expires }
        //   }
        // }
      ]
    };

    const result = await get_signed_cookie_async(
      CLOUDFRONT_KEYPARE_ID,
      private_key,
      {
        policy: JSON.stringify(policy)
      }
    );

    const local = {
      title: 'Pre-signed URL with Signer',
      data: {
        policy: policy,
        result: result,
        curl: ''
      }
    };

    if (result) {
      const urls = [
        `${CDN_HOST}/white.png`,
        `${CDN_HOST}/white2.png`,
        `${CDN_HOST}/folder/white.png`
      ];

      urls.forEach(url => {
        if (local.data.curl != '') local.data.curl += '\n\n';
        local.data.curl += `$ curl -H 'Cookie:CloudFront-Policy=${result['CloudFront-Policy']}; CloudFront-Key-Pair-Id=${result['CloudFront-Key-Pair-Id']}; CloudFront-Signature=${result['CloudFront-Signature']}' ${url}`;
      });
    }

    res.render('cloudfront/url_signer_cookie', local);

  })().catch(next);
});

const get_signed_cookie_async = async (keypair_id, private_key, options) => {
  return new Promise((resolve, reject) => {
    const signer = new AWS.CloudFront.Signer(keypair_id, private_key);
    signer.getSignedCookie(options, (err, result) => {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });
};



module.exports = router;

