
const debug = require('debug')('node-js-aws-trial:routes:dynamodb');

const express = require('express');
const router = express.Router();

const _ = require('underscore');

const title = 'DynamoDB';


// const dynamoose = require('dynamoose');
// const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
// const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
// dynamoose.AWS.config.update({
//   accessKeyId: AWS_ACCESS_KEY_ID,
//   secretAccessKey: AWS_SECRET_ACCESS_KEY,
//   region: 'us-east-1'
// });

const DynamooseCat = require('../models/DynamooseCat');

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



//
// Refer: https://qiita.com/naoko_s/items/523acad62ab4ba18891e
//
const Authenticator = require('../services/auth/authenticator');

/* GET users listing. */
router.get('/auth/login', (req, res) => {
  // エラーメッセージがあるときは出力させる
  const message = req.flash();
  res.render('dynamodb/auth/login', {
    message: message.error || '',
    title: 'ログイン'
  });
});

// ログイン情報がPOSTされたら認証処理に入る
router.post('/auth/login', (req, res, next) => {
  Authenticator.authenticate(req, res, next);
});

router.get('/auth/logout', (req, res) => {
  req.logout();
  //res.redirect('/login');
  res.redirect(Authenticator.redirect.failure);
});

// router.get('/', Authenticator.isAuthenticated, function(req, res) {
//   const user = req.user;
//   res.render('index', {
//     user: user
//   });
// });
router.get('/auth', Authenticator.isAuthenticated, (req, res) => {
  res.render('dynamodb/auth/index', {
    message: null,
    title: 'Logged in'
  });
});



const user_service = require('../services/auth/user');

router.get('/auth2/signup', (req, res) => {
  const local = {
    title: 'Auth2 Sign up | ' + title,
    data: {
      form_email: '',
      form_name: ''
    }
  };

  res.render('dynamodb/auth2/signup', local);
});

router.post('/auth2/signup', (req, res, next) => {
  (async () => {

    const local = {
      title: 'Auth2 Sign up | ' + title,
      data: {
        success: null,
        error: null,
        form_email: req.body.email || '',
        form_name: req.body.name || ''
      }
    };

    const param = {
      email: local.data.form_email,
      password: req.body.password,
      name: local.data.form_name
    };

    if (_.isEmpty(param.email) || _.isEmpty(param.password) || _.isEmpty(param.name)) {
      local.data.error = 'Invalid inputs';
      return res.render('dynamodb/auth2/signup', local);
    }

    const signup = await user_service.create_and_get_user(param);

    debug('signup', signup);

    if (signup.created) {
      local.success = 'Sign up successfully.';
    }

    res.render('dynamodb/auth2/signup', local);

  })().catch(next);
});



const music_service = require('../services/dynamodb/music');

router.get('/sdk/create_table', (req, res) => {
  const local = {
    title: 'SDK, Create Table | ' + title,
    data: {}
  };

  music_service.create_table((err, result) => {
    local.data.error = err;
    local.data.result = result;
    res.render('dynamodb/sdk/create_table', local);
  });
});

router.get('/sdk/delete_table', (req, res) => {
  const local = {
    title: 'SDK, Delete Table | ' + title,
    data: {}
  };

  music_service.delete_table((err, result) => {
    local.data.error = err;
    local.data.result = result;
    res.render('dynamodb/sdk/delete_table', local);
  });
});

router.get('/sdk/put_item', (req, res) => {
  const local = {
    title: 'SDK, Put Item | ' + title,
    data: {}
  };
  res.render('dynamodb/sdk/put_item', local);
});

router.post('/sdk/put_item', (req, res) => {
  const local = {
    title: 'SDK, Put Item | ' + title,
    data: {}
  };

  const form = req.body;

  music_service.put_item(form, (err, result) => {
    local.data.error = err;
    local.data.result = result;
    res.render('dynamodb/sdk/put_item', local);
  });
});

router.get('/sdk/get_item', (req, res) => {
  const local = {
    title: 'SDK, Get Item | ' + title,
    data: {}
  };
  res.render('dynamodb/sdk/get_item', local);
});

router.post('/sdk/get_item', (req, res) => {
  const local = {
    title: 'SDK, Get Item | ' + title,
    data: {}
  };

  const artist = req.body.artist;
  const song_title = req.body.song_title;

  music_service.get_item(artist, song_title, (err, result) => {
    local.data.error = err;
    local.data.result = result;
    res.render('dynamodb/sdk/get_item', local);
  });
});



module.exports = router;

