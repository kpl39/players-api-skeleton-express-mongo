const { Router } = require('express');
const playerService = require('../services/player');
const jwtAuthorization = require('../jwtAuthorization');

const router = new Router();

router.use(jwtAuthorization);

router.post('/', createPlayer);
router.get('/', getPlayers);
router.delete('/:id', deletePlayer);


function createPlayer(req, res, next) {
  playerService.createPlayer(req)
    .then(user => res.status(201).send(user))
    .catch(next);
};

function getPlayers(req, res, next) {
  playerService.getPlayers(req)
    .then(response => res.status(200).send(response))
    .catch(next);
};

function deletePlayer(req, res) {
  playerService.deletePlayer(req, res)
    .then(() => res.status(200).send())
    .catch(err => res.status(404).send(err));
};

module.exports = router;
