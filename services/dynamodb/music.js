'use strict';

const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'us-east-1'
});

const table_name = 'node-js-aws-trial.Music';


// Refer: https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html#createTable-property
const create_table = (callback) => {
  const params = {
    AttributeDefinitions: [
      {
        AttributeName: "Artist",
        AttributeType: "S"
      },
      {
        AttributeName: "SongTitle",
        AttributeType: "S"
      }
    ],
    KeySchema: [
      {
        AttributeName: "Artist",
        KeyType: "HASH"
      },
      {
        AttributeName: "SongTitle",
        KeyType: "RANGE"
      }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 1,
      WriteCapacityUnits: 1
    },
    TableName: table_name
  };

  dynamodb.createTable(params, function(err, data) {
    callback(err, data);
    // if (err) console.log(err, err.stack); // an error occurred
    // else     console.log(data);           // successful response
  });
};

// Refer: https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html#deleteTable-property
const delete_table = (callback) => {
  const params = {
    TableName: table_name
  };

  dynamodb.deleteTable(params, function(err, data) {
    callback(err, data);
    // if (err) console.log(err, err.stack); // an error occurred
    // else     console.log(data);           // successful response
  });
};

// Refer: https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html#putItem-property
const put_item = (form, callback) => {
  const params = {
    Item: {
      'Artist': {
        S: form.artist
      },
      'SongTitle': {
        S: form.song_title
      },
      'AlbumTitle': {
        S: form.album_title
      }
    },
    ReturnConsumedCapacity: 'TOTAL',
    TableName: table_name
  };

  dynamodb.putItem(params, function(err, data) {
    callback(err, data);
    // if (err) console.log(err, err.stack); // an error occurred
    // else     console.log(data);           // successful response
  });
};


module.exports = {
  create_table: create_table,
  delete_table: delete_table,
  put_item: put_item
};

