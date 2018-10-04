const Boom = require('boom');
const bcrypt = require('bcrypt');
const { User } = require('../models');
const { scrubPassword, getToken } = require('../utils');

async function createUser(userParams)  {
  const { password, confirm_password } = userParams;
  
  if (!password || !confirm_password || password !== confirm_password) throw Boom.conflict('Passwords do not match');

  const hash = await bcrypt.hash(password, 5);
  const user = new User({...userParams, password: hash});
  await user.save();

  return {
    success: true,
    token: getToken(user),
    user: scrubPassword(user.toJSON())
  };
};

async function updateUser(userId, userParams) {
  const user = await User.findByIdAndUpdate(userId, userParams, { new: true });

  if (!user) {
    throw 'User not found';
  } else {
    return {
      success: true,
      user: scrubPassword(user.toJSON())
    };
  };
};

module.exports = { 
  createUser, 
  updateUser 
};
