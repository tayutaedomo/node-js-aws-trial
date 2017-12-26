var express = require('express');
var router = express.Router();

var CLOUDFRONT_KEYPARE_ID = process.env.CLOUDFRONT_KEYPARE_ID;

var title = 'Node.js aws-sdk Trial';


router.get('/url', function(req, res, next) {
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

