const dynamoose = require('dynamoose');

const schema_name = 'DynamooseUser';

const schema = dynamoose.model(schema_name, {
  username: String,
  email: String,
  password: String,
  name: String
});


module.exports = schema;

