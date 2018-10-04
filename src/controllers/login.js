const { Router } = require('express');
const loginService = require('../services/login');

const router = new Router();

router.post('/', loginUser);

function loginUser(req, res, next) {
  loginService.loginUser(req.body)
    .then(response => res.status(200).send(response))
    .catch(err => res.status(401).send(err));
};

module.exports = router;
