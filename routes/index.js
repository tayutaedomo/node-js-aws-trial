var express = require('express');
var router = express.Router();

var title = 'Node.js aws-sdk Trial';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: title });
});


var AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
var AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;

router.get('/s3/get', function(req, res, next) {
  var AWS = require('aws-sdk');
  var s3 =  new AWS.S3();
  var bucket = 'node-js-sdk-trial.tayutaedomo.net';
  var key = 'white.png';

  s3.getObject({Bucket: bucket, Key: key}, function (err, data) {
    if (err) console.err(err);

    res.render('s3/get', {
      title: 'S3 Get | ' + title,
      data: data
    });
  });
});

router.get('/s3/url', function(req, res, next) {
  var backet = 'node-js-sdk-trial.tayutaedomo.net';
  var key = 'white.png';

  var v4 = require('aws-signature-v4');
  var url = v4.createPresignedURL(
    'GET',
    's3.amazonaws.com',
    '/' + backet + '/' + key,
    's3',
    'UNSIGNED-PAYLOAD',
    {
      key: AWS_ACCESS_KEY_ID,
      secret: AWS_SECRET_ACCESS_KEY,
      protocol: 'https',
      expires: 3600
    }
  );

  res.render('s3/url', {
    title: 'S3 URL | ' + title,
    url: url
  });
});


var CLOUDFRONT_KEYPARE_ID = process.env.CLOUDFRONT_KEYPARE_ID;

router.get('/cloudfront/url', function(req, res, next) {
  var sign = require('aws-cloudfront-sign');

  var host = 'https://doi4gaf5j9pnq.cloudfront.net';
  var path = '/white.png';
  var base_url = host + path;

  var fs = require('fs');
  var file_path = __dirname + '/../cert/pk-APKAJ5MB4Q7VGNUPG7CA.pem';
  var private_key = fs.readFileSync(file_path, 'utf-8');

  var url = sign.getSignedUrl(base_url, {
    keypairId: CLOUDFRONT_KEYPARE_ID,
    expireTime: Date.now() + 60000,
    privateKeyString: private_key
  });

  res.render('cloudfront/url', {
    title: 'CloudFront URL | ' + title,
    url: url
  });
});


module.exports = router;

