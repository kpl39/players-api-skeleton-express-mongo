const { Router } = require('express');
const user = require('../controllers/user');
const login = require('../controllers/login');
const player = require('../controllers/players');

const router = new Router();

router.use('/api/user', user);
router.use('/api/login', login);
router.use('/api/players', player);

module.exports = router;