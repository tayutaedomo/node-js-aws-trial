const dynamoose = require('dynamoose');

const schema_name = 'node-js-aws-trial.DynamooseUser';

const schema = dynamoose.model(schema_name, {
  username: String,
  email: String,
  password: String,
  name: String
});


module.exports = schema;

