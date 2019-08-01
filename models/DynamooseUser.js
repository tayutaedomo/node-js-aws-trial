const dynamoose = require('dynamoose');

const schema_name = 'node-js-aws-trial.DynamooseUser';

const schema = dynamoose.model(schema_name, {
  username: {
    type: String,
    hashKey: true
  },
  email: {
    type: String,
    rangeKey: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true,
    index: true // name: nameLocalIndex, ProjectionType: ALL
  }

}, {
  throughput: { read: 1, write: 1 },
  timestamps: true
});


module.exports = schema;

