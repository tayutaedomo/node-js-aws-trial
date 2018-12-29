const express = require('express');
const router = express.Router();

const multer = require('multer');
//const upload_local = multer({ dest: os.tmpdir() });
const upload_memoney = multer({}); // No file output, file.buffer only

var Promise = require('bluebird');
var AWS = require('aws-sdk');
var s3 =  new AWS.S3();

var AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
var AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;


router.get('/to_s3', function(req, res, next) {
  const payload = {
    title: 'Upload to S3 | File Upload',
    data: {}
  };

  res.render('file_upload/to_s3', payload);
});

router.post('/to_s3', upload_memoney.fields([ { name: 'file' } ]), function(req, res, next) {
  console.log('files', req.files);

  const payload = {
    title: 'Upload to S3 | File Upload',
    data: {}
  };

  // PUT

  res.render('file_upload/to_s3', payload);
});


module.exports = router;

