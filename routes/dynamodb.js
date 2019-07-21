const express = require('express');
const router = express.Router();

// const dynamoose = require('dynamoose');
// const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
// const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
// dynamoose.AWS.config.update({
//   accessKeyId: AWS_ACCESS_KEY_ID,
//   secretAccessKey: AWS_SECRET_ACCESS_KEY,
//   region: 'us-east-1'
// });

const DynamooseCat = require('../models/DynamooseCat');

const title = 'DynamoDB';


// Refer: https://dynamoosejs.com/
// const startUpAndReturnDynamo = async () => {
//   const dynaliteServer = dynalite();
//   await dynaliteServer.listen(8000);
//   return dynaliteServer;
// };
// const createDynamooseInstance = () => {
//   dynamoose.AWS.config.update({
//     accessKeyId: AWS_ACCESS_KEY_ID,
//     secretAccessKey: AWS_SECRET_ACCESS_KEY,
//     region: 'us-east-1'
//   });
//   // dynamoose.local(); // This defaults to "http://localhost:8000"
// };

const createAndGetCat = async () => {
  // const Cat = dynamoose.model('Cat', {id: Number, name: String});
  const garfield = new DynamooseCat({id: 666, name: 'Garfield'});
  await garfield.save();
  const badCat = await DynamooseCat.get(666);
  return badCat;
};

// const bootStrap = async () => {
//   await startUpAndReturnDynamo();
//   createDynamooseInstance();
//   const badCat = await createAndGetCat();
//   console.log('Never trust a smiling cat. - ' + badCat.name);
// };
// bootStrap();

router.get('/dynamoose_example', (req, res, next) => {
  (async () => {

    const cat = await createAndGetCat();
    const local = {
      title: 'dynamoose Example | ' + title,
      data: { cat: cat }
    };

    res.render('dynamodb/dynamoose_example', local);

  })().catch(next);
});


module.exports = router;

