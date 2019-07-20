const dynamoose = require('dynamoose');

const schema_name = 'DynamooseTable';

const schema = dynamoose.model(schema_name, {
  id: Number,
  name: String
});


module.exports = schema;

