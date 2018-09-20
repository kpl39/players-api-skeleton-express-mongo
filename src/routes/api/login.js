const Boom = require('boom');
const { jwtsecret } = require('config');
const jwt = require('jsonwebtoken');
const { Router } = require('express');
const { User } = require('../../models');
const bcrypt = require('bcrypt');

const router = new Router();

router.post('/', async (req, res, next) => {
  const { email, password} = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw 'User Not Found';
    } else {
      bcrypt.compare(password, user.password, function(err, match) {
        if (match) {
          user.password = null;
          res.status(200).send({
            success: true,
            token: getToken(user),
            user
          });
        } else {
          res.status(401).send(err);
        } 
      });
    };
  } catch(err) {
    res.status(401).send(err);
  }
});

const getToken = user => jwt.sign({ userId: user._id }, jwtsecret);

module.exports = router;
