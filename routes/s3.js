var express = require('express');
var router = express.Router();

var Promise = require('bluebird');
var AWS = require('aws-sdk');
var s3 =  new AWS.S3();

var AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
var AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;

var title = 'Node.js aws-sdk Trial';
var bucket = 'node-js-sdk-trial.tayutaedomo.net';


router.get('/get', function(req, res, next) {
  res.render('s3/get', {
    title: 'S3 Get | ' + title,
    data: null
  });
});

router.post('/get', function(req, res, next) {
  var key = req.body.key;
  var params = {
    Bucket: bucket,
    Key: key
  };

  s3.getObject(params, function (err, data) {
    res.render('s3/get', {
      title: 'S3 Get | ' + title,
      data: {
        error: err,
        result: data
      }
    });
  });
});

router.get('/url', function(req, res, next) {
  var key = 'white.png';

  var v4 = require('aws-signature-v4');
  var url = v4.createPresignedURL(
    'GET',
    's3.amazonaws.com',
    '/' + bucket + '/' + key,
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

router.get('/head', function(req, res, next) {
  res.render('s3/head', {
    title: 'S3 Head | ' + title,
    data: null
  });
});

router.post('/head', function(req, res, next) {
  var key = req.body.key;

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

router.get('/head_empty', function(req, res, next) {
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

// Refer: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#listObjects-property
router.get('/list_objects', function(req, res, next) {
  var s3 =  Promise.promisifyAll(new AWS.S3());

  // Use bluebird
  s3.listObjectsAsync({ Bucket: bucket }).then(function(data) {
    res.render('s3/list_objects', {
      title: 'S3 ListObjects | ' + title,
      data: {
        error: null,
        result: data
      }
    });

  }).catch(function(err) {
    console.error(err);
    res.render('s3/list_objects', {
      title: 'S3 ListObjects | ' + title,
      data: {
        error: err,
        result: null
      }
    });
  });
});

router.get('/storage_class', function(req, res, next) {
  res.render('s3/storage_class', {
    title: 'S3 StorageClass | ' + title,
    data: null
  });
});

router.post('/storage_class', function(req, res, next) {
  var key = req.body.key;
  var storage_class = req.body.storage_class;
  var params = {
    Bucket: bucket,
    CopySource: [bucket, key].join('/'),
    Key: key,
    StorageClass: storage_class
  };
  console.log('storage_class', params);

  s3.copyObject(params, function (err, data) {
    res.render('s3/storage_class', {
      title: 'S3 StorageClass | ' + title,
      data: {
        error: err,
        result: data
      }
    });
  });
});


module.exports = router;

