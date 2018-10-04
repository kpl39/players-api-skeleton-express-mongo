const { jwtsecret } = require('config');
const jwt = require('jsonwebtoken');

const authorizeUser = (req, res, next) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  if (!token) {
    return res.status(403).send('No token provided');
  }

  const verifiedToken =  jwt.verify(token, jwtsecret);
  const authorizedUserId = verifiedToken.userId;
  req.authorizedUserId = authorizedUserId;
  next();
}

module.exports = authorizeUser;