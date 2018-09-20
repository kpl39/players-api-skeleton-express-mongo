const Boom = require('boom');
const { jwtsecret } = require('config');
const jwt = require('jsonwebtoken');
const { Router } = require('express');
const { User, Player } = require('../../models');

const router = new Router();

router.post('/', async (req, res, next) => {
  const { first_name, last_name } = req.body;
  const userId = authorizeUser(req, res);

  try {
    const verifiedUser = await User.findById(userId);
    if (!verifiedUser) throw Boom.unauthorized('No matching user');
   
    const existingUser = await Player.findOne({first_name, last_name});
    if (existingUser) throw Boom.conflict('Player name already exists');

    const player = new Player({...req.body, created_by: userId});
    player
      .save()
      .then(() => {
        res.status(201).send({
          success: true,
          player
        });
      }).catch(next);
  } catch(err) {
      next(err);
  };
});

router.get('/', async (req, res, next) => {
  const userId = authorizeUser(req, res);

  try {
    const verifiedUser = await User.findById(userId);
    if (!verifiedUser) throw Boom.unauthorized('No matching user');

    const players = await Player.find({ created_by: userId});
    if (players) {
      res.status(200).send({
        success: true,
        players
      });
    }
  } catch(err) {
      next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  const userId = authorizeUser(req, res);
  const { id } = req.params;

  try {
    const verifiedUser = await User.findById(userId);
    if (!verifiedUser) throw Boom.unauthorized('No matching user');

    const player = await Player.findOne({ _id: id });
    if (player && player.created_by !== userId) {
      throw 'User not authorized';
    } else if (player) {
      Player
        .deleteOne({ _id: id})
        .then(() => {
          res.status(200).send();
        }).catch(next);
    } else {
      throw 'Player not found'
    }
  } catch(err) {
    res.status(404).send(err);
  }
});

const authorizeUser = (req, res) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  if (!token) {
    res.status(403).send('No token provided');
  }

  return getIdFromToken(token).userId;
}

const getToken = user => jwt.sign({ userId: user._id }, jwtsecret);

const getIdFromToken = token => jwt.verify(token, jwtsecret);

module.exports = router;
