const Boom = require('boom');
const { Player, User } = require('../models');

async function createPlayer(req)  {
  const { first_name, last_name } = req.body;
  const { authorizedUserId } = req;

  if (userExists(authorizedUserId)) {
    const playerExists = await Player.findOne({first_name, last_name});
    if (playerExists) throw Boom.conflict('Player name already exists');

    const player = new Player({...req.body, created_by: authorizedUserId});
    await player.save();

    return {
      success: true,
      player
    };
  };
};

async function getPlayers({ authorizedUserId }) {
  if (userExists(authorizedUserId)) {
    const players = await Player.find({ created_by: authorizedUserId});
    return {
      success: true,
      players
    };
  };
};

async function deletePlayer(req) {
  const { authorizedUserId } = req;
  const { id } = req.params;

  if (userExists(authorizedUserId)) {
    const player = await Player.findOneAndRemove({ _id: id, created_by: authorizedUserId });
    if (!player) throw 'Not Found';
  };
};

async function userExists(userId) {
  const userExists = await User.findById(userId);

  if (!userExists) {
    throw Boom.unauthorized('No matching user');
  } else {
    return true;
  };
};

module.exports = { 
  createPlayer, 
  getPlayers, 
  deletePlayer 
};
