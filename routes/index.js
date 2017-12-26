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

