const Boom = require('boom');
const { jwtsecret } = require('config');
const jwt = require('jsonwebtoken');
const { Router } = require('express');
const { User } = require('../../models');
const bcrypt = require('bcrypt');

const router = new Router();

router.post('/', (req, res, next) => {
  const { password, confirm_password } = req.body;
  if (!password || !confirm_password || password !== confirm_password) throw Boom.conflict('Passwords do not match');

  bcrypt.hash(password, 5, function(err, hash) {
    const user = new User({...req.body, password: hash});
    user
      .save()
      .then(() => {
        user.password = null;
        res.status(201).send({
          success: true,
          token: getToken(user),
          user
        });
      }).catch(next);
  });
});

router.put('/:userId', async (req, res, next) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);

    if (!user) {
      throw 'User not found';
    } else {
      Object.assign(user, req.body);
      user
        .save()
        .then(() => {
          user.password = null;
          res.status(200).send({
            success: true,
            user
          })
        }).catch(next);
    }
  } catch(err) {
    res.status(401).send(err);
  }
});

const getToken = user => jwt.sign({ userId: user._id }, jwtsecret);

module.exports = router;
