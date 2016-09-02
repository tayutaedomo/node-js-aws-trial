var express = require('express');
var router = express.Router();

var Promise = require('bluebird');
var AWS = require('aws-sdk');
var s3 =  new AWS.S3();
var sqs = Promise.promisifyAll(new AWS.SQS());

var title = 'Node.js aws-sdk Trial';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: title });
});


var AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
var AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;

router.get('/s3/get', function(req, res, next) {
  var bucket = 'node-js-sdk-trial.tayutaedomo.net';
  var key = 'white.png';

  s3.getObject({Bucket: bucket, Key: key}, function (err, data) {
    res.render('s3/get', {
      title: 'S3 Get | ' + title,
      data: {
        error: err,
        result: data
      }
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

router.get('/s3/head', function(req, res, next) {
  var bucket = 'node-js-sdk-trial.tayutaedomo.net';
  var key = 'white.png';

  s3.headObject({Bucket: bucket, Key: key}, function (err, data) {
    res.render('s3/head', {
      title: 'S3 Head | ' + title,
      data: {
        error: err,
        result: data
      }
    });
  });
});

router.get('/s3/head_empty', function(req, res, next) {
  var bucket = 'node-js-sdk-trial.tayutaedomo.net';
  var key = 'aaa.png';

  s3.headObject({Bucket: bucket, Key: key}, function (err, data) {
    res.render('s3/head', {
      title: 'S3 Head in empty case | ' + title,
      data: {
        error: err,
        result: data
      }
    });
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

router.get('/sqs/enqueue', function(req, res, next) {
  res.render('sqs/enqueue', {
    title: 'SQS Engueue | ' + title,
    data: {}
  })
});

router.post('/sqs/enqueue', function(req, res, next) {
  req.body.message;

  var sqs = new AWS.SQS({ region:'eu-west-1' });

  res.render('sqs/enqueue', {
    title: 'SQS Engueue | ' + title,
    data: {}
  })
});

router.get('/sqs/dequeue', function(req, res, next) {
  // TODO
});

router.get('/sqs/list', function(req, res, next) {
  // TODO
});


module.exports = router;

