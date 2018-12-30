const express = require('express');
const router = express.Router();

const multer = require('multer');
//const upload_local = multer({ dest: os.tmpdir() });
const upload_memory = multer({}); // No file output, file.buffer only

const AWS = require('aws-sdk');

// const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
// const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const BUCKET = 'node-js-sdk-trial.tayutaedomo.net';


router.get('/to_s3', function(req, res, next) {
  const payload = {
    title: 'Upload to S3 | File Upload',
    data: {}
  };

  res.render('file_upload/to_s3', payload);
});

router.post('/to_s3', upload_memory.fields([ { name: 'file' } ]), function(req, res, next) {
  console.log('files', req.files);

  const payload = {
    title: 'Upload to S3 | File Upload',
    data: {}
  };

  const key = `${req.body.prefix}/${req.files.file[0].originalname}`;
  const body = req.files.file[0].buffer;

  s3_upload(key, body, function(err, data) {
    payload.data.err = err;
    payload.data.data = data;
    payload.data.files = req.files;
    res.render('file_upload/to_s3', payload);
  });
});


function s3_upload(key, body, callback) {
  const s3 = new AWS.S3({
    httpOptions : {
      timeout: 172800000
    }
  });

  const params = {
    Bucket: BUCKET,
    Key: key,
    Body: body
  };

  return s3.upload(params, function (err, data) {
    callback(err, data);
  });
}




module.exports = router;

