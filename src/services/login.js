const bcrypt = require('bcrypt');
const { User } = require('../models');
const { scrubPassword, getToken } = require('../utils');

async function loginUser({email, password})  {
  const user = await User.findOne({ email });

  if (!user) {
    throw 'User Not Found';
  } else {
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      return {
        success: true,
        token: getToken(user),
        user: scrubPassword(user.toJSON())
      }
    } else {
      throw 'Password does not match';
    };
  };
};

module.exports = { loginUser };
