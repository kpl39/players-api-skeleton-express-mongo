const { Router } = require('express');
const userService = require('../services/user');

const router = new Router();

router.post('/', createUser);
router.put('/:userid', updateUser);


function createUser(req, res, next) {
  userService.createUser(req.body)
    .then(user => res.status(201).send(user))
    .catch(next);
};

function updateUser(req, res) {
  userService.updateUser(req.params.userid, req.body)
    .then(response => res.status(200).send(response))
    .catch(err => res.status(401).send(err));
};

module.exports = router;
