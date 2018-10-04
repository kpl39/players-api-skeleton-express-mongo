const { jwtsecret } = require('config');
const jwt = require('jsonwebtoken');

const scrubPassword = (user) => {
  const { password, ...userNoPassword } = user;
  return userNoPassword;
}

const getToken = user => jwt.sign({ userId: user._id }, jwtsecret);

module.exports = {
  scrubPassword,
  getToken
}