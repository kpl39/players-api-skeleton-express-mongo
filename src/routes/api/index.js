const { Router } = require('express');
const user = require('./user');
const login = require('./login');
const player = require('./player');

const router = new Router();

router.use('/user', user);
router.use('/login', login);
router.use('/players', player);

module.exports = router;
