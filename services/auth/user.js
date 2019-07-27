const bcrypt = require('bcryptjs');

const DynamooseUser = require('../../models/DynamooseUser');

const salt = process.env.PASSWORD_SALT || 'passpass';


const create_and_get_user = async (params) => {
  const payload = {
    created: false,
    user: null
  };

  payload.user = await DynamooseUser.get({ username: params.email });

  if (payload.user) return payload;

  payload.user = new DynamooseUser({
    username: params.email,
    email:    params.email,
    password: create_password_hash(params.password),
    name:     params.name || ''
  });

  await payload.user.save();

  payload.created = true;

  return user;
};

const create_password_hash = (raw_pass) => {
  return bcrypt.hashSync(raw_pass, salt);
};



module.exports = {
  create_and_get_user: create_and_get_user
};

