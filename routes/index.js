var express = require('express');
var router = express.Router();

var title = 'Node.js aws-sdk Trial';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: title });
});


var AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
var AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;

var AWS = require('aws-sdk');

router.get('/s3/get', function(req, res, next) {
  var s3 =  new AWS.S3();
  var bucket = 'node-js-sdk-trial.tayutaedomo.net';
  var key = 'white.png';

  s3.getObject({Bucket: bucket, Key: key}, function (err, data) {
    console.log(err, data);

    res.render('index', { title: 's3 get' + title });
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

  res.render('s3/url', { title: title, url: url });
});


module.exports = router;

