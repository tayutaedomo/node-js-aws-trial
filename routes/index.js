var express = require('express');
var router = express.Router();

var Promise = require('bluebird');
var AWS = require('aws-sdk');
var sqs = Promise.promisifyAll(new AWS.SQS());

var title = 'Node.js aws-sdk Trial';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: title });
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

